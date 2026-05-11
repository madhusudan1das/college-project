const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./modules/user');
const Inquiry = require('./modules/inquiry');
const Chat = require('./modules/chat');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const admin = require('firebase-admin');

function getFirebaseCredential() {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
        return admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT));
    }

    try {
        const serviceAccount = require('./serviceAccountKey.json');
        return admin.credential.cert(serviceAccount);
    } catch (error) {
        console.warn('Firebase Admin credentials not found. Admin user routes will be unavailable.');
        return null;
    }
}

const firebaseCredential = getFirebaseCredential();
if (firebaseCredential) {
    admin.initializeApp({ credential: firebaseCredential });
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../fronted')));

// Database Connection
if (process.env.MONGO_URI) {
    mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => console.log('MongoDB Connected'))
        .catch(err => console.log(err));
} else {
    console.warn('MONGO_URI is not configured. Database routes will fail until it is set.');
}

// Routes

// Register Route
app.post('/api/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin Route: Get all users from Firebase Auth
app.get('/api/admin/users', async (req, res) => {
    try {
        if (!firebaseCredential) {
            return res.status(503).json({ message: 'Firebase Admin is not configured' });
        }

        const listUsersResult = await admin.auth().listUsers(1000); // Fetch up to 1000 users
        const users = listUsersResult.users.map(userRecord => {
            return {
                id: userRecord.uid,
                name: userRecord.displayName || userRecord.email.split('@')[0],
                email: userRecord.email,
                date: userRecord.metadata.creationTime
            };
        });

        // Sort by newest first
        users.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json({ users, count: users.length });
    } catch (error) {
        console.error('Error fetching Firebase users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Contact Route: Save inquiry
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ message: 'Please fill all fields' });
        }
        const newInquiry = new Inquiry({ name, email, message });
        await newInquiry.save();
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Admin Route: Get all inquiries
app.get('/api/admin/inquiries', async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ date: -1 });
        res.json({ inquiries, count: inquiries.length });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Chatbot Route
const genAI = process.env.GEMINI_API_KEY
    ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    : null;

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }
        if (!genAI) {
            return res.status(503).json({ error: 'Gemini API key is not configured' });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent(message);
        const reply = result.response.text();

        const chatRecord = new Chat({
            userMessage: message,
            botReply: reply
        });
        await chatRecord.save();

        res.json({ reply });
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ error: 'Error connecting to AI' });
    }
});

// Serve Frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../fronted/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

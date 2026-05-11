import { auth } from "../firebase-config.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// Login Logic
if (document.getElementById("loginForm")) {
    document.getElementById("loginForm").addEventListener("submit", async function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // Admin Login Bypass
        if (email === "admin@gmail.com" && password === "9339182879") {
            alert("Admin Login Successful!");
            localStorage.setItem('user', JSON.stringify({
                name: "Admin",
                email: email,
                isAdmin: true
            }));
            window.location.href = "../admin/admin.html";
            return; // Exit function so Firebase Auth is not called
        }

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            alert("Login Successful!");
            // Store token and user info for script.js to use
            localStorage.setItem('token', await user.getIdToken());
            localStorage.setItem('user', JSON.stringify({
                name: user.displayName || user.email.split('@')[0],
                email: user.email
            }));

            window.location.href = "../index.html";
        } catch (error) {
            console.error(error);
            alert(error.message || "Login Failed");
        }
    });
}

// Registration Logic
if (document.getElementById("registerForm")) {
    document.getElementById("registerForm").addEventListener("submit", async function (event) {
        event.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Update profile with name
            await updateProfile(user, {
                displayName: name
            });

            alert("Registration Successful!");
            // Auto login after registration
            localStorage.setItem('token', await user.getIdToken());
            localStorage.setItem('user', JSON.stringify({
                name: name,
                email: email
            }));

            window.location.href = "../index.html";
        } catch (error) {
            console.error(error);
            alert(error.message || "Registration Failed");
        }
    });
}

//for menu button 
const menuBtn = document.getElementById("menu-btn");
const navbar = document.getElementById("navbar");
menuBtn.onclick = () => {
    navbar.classList.toggle("active");
};


// for alert on page reload
window.addEventListener('load', () => {
    const navEntries = performance.getEntriesByType && performance.getEntriesByType('navigation');
    const type = navEntries && navEntries[0]
        ? navEntries[0].type
        : (performance.navigation && performance.navigation.type === 1 ? 'reload' : 'other');

    if (type === 'reload') {
        // alert('welcome to our project'); // Commented out to be less annoying during dev
    }
});

// Auth State Management
import { auth } from "./firebase-config.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
    const navBtns = document.querySelector('.nav-btns');
    const signInBtn = document.querySelector('.signin');

    onAuthStateChanged(auth, (user) => {
        if (user) {
            // User is signed in
            if (signInBtn) signInBtn.style.display = 'none';

            // Check if user info is already displayed
            if (!document.querySelector('.user-info')) {
                const userDiv = document.createElement('div');
                userDiv.className = 'user-info';
                userDiv.style.display = 'flex';
                userDiv.style.alignItems = 'center';
                userDiv.style.gap = '10px';
                userDiv.innerHTML = `
                    <span style="font-weight: 600; color: #333;">Hello, ${user.displayName || user.email.split('@')[0]}</span>
                    <button id="logout-btn" style="padding: 8px 15px; background: #ff4757; color: white; border: none; border-radius: 5px; cursor: pointer;">Logout</button>
                `;

                // Insert before the menu button
                const menuBtn = document.getElementById('menu-btn');
                navBtns.insertBefore(userDiv, menuBtn);

                // Logout Logic
                document.getElementById('logout-btn').addEventListener('click', () => {
                    signOut(auth).then(() => {
                        // Sign-out successful.
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.reload();
                    }).catch((error) => {
                        // An error happened.
                        console.error(error);
                    });
                });
            }
        } else {
            // User is signed out
            if (signInBtn) signInBtn.style.display = 'block';
            const userDiv = document.querySelector('.user-info');
            if (userDiv) userDiv.remove();
        }
    });

    /* ================= FLIGHT SEARCH LOGIC ================= */

    // Common Indian Airport Codes
    const airportCodes = {
        "kolkata": "CCU",
        "mumbai": "BOM",
        "delhi": "DEL",
        "bangalore": "BLR",
        "bengaluru": "BLR",
        "chennai": "MAA",
        "hyderabad": "HYD",
        "pune": "PNQ",
        "goa": "GOI",
        "ahmedabad": "AMD",
        "jaipur": "JAI",
        "lucknow": "LKO",
        "patna": "PAT",
        "bhubaneswar": "BBI",
        "guwahati": "GAU"
    };

    function getAirportCode(city) {
        if (!city) return "";
        const lowerCity = city.toLowerCase().trim();
        return airportCodes[lowerCity] || lowerCity.toUpperCase().slice(0, 3); // Fallback to first 3 letters
    }

    document.getElementById('search-btn').addEventListener('click', function () {
        const fromCity = document.getElementById('from-input').value;
        const toCity = document.getElementById('to-input').value;
        const departureDate = document.getElementById('departure-date').value;
        const returnDate = document.getElementById('return-date').value;
        const tripType = document.getElementById('trip-type').value;
        const passengers = document.getElementById('passengers').value;

        if (!fromCity || !toCity || !departureDate) {
            alert("Please fill in From, To, and Departure Date fields.");
            return;
        }

        const fromCode = getAirportCode(fromCity);
        const toCode = getAirportCode(toCity);

        // Format Date: YYYY-MM-DD -> DD/MM/YYYY for some, YYYYMMDD for others
        // MMT expects: DD/MM/YYYY
        const dDateObj = new Date(departureDate);
        const dDay = String(dDateObj.getDate()).padStart(2, '0');
        const dMonth = String(dDateObj.getMonth() + 1).padStart(2, '0');
        const dYear = dDateObj.getFullYear();
        const formattedDepDate = `${dDay}/${dMonth}/${dYear}`; // DD/MM/YYYY

        // MakeMyTrip URL Construction
        // Example: https://www.makemytrip.com/flight/search?itinerary=CCU-BOM-20/11/2025&tripType=O&paxType=A-1_C-0_I-0&intl=false&cabinClass=E
        let mmtUrl = `https://www.makemytrip.com/flight/search?itinerary=${fromCode}-${toCode}-${formattedDepDate}`;

        if (tripType === 'round' && returnDate) {
            const rDateObj = new Date(returnDate);
            const rDay = String(rDateObj.getDate()).padStart(2, '0');
            const rMonth = String(rDateObj.getMonth() + 1).padStart(2, '0');
            const rYear = rDateObj.getFullYear();
            const formattedRetDate = `${rDay}/${rMonth}/${rYear}`;

            mmtUrl = `https://www.makemytrip.com/flight/search?itinerary=${fromCode}-${toCode}-${formattedDepDate}_${toCode}-${fromCode}-${formattedRetDate}`;
        }

        mmtUrl += `&tripType=${tripType === 'round' ? 'R' : 'O'}&paxType=A-${passengers}_C-0_I-0&intl=false&cabinClass=E`;

        // Goibibo URL Construction
        // Example: https://www.goibibo.com/flights/air-CCU-BOM-20251120--1-0-0-E-D/
        const goiDepDate = `${dYear}${dMonth}${dDay}`; // YYYYMMDD
        let goiUrl = `https://www.goibibo.com/flights/air-${fromCode}-${toCode}-${goiDepDate}--${passengers}-0-0-E-D/`;

        // Paytm Flights (via EaseMyTrip or similar generic search if direct link is hard, but let's try generic Google Flights as backup)
        // Google Flights: https://www.google.com/travel/flights?tfs=... (Complex)
        // Let's stick to MMT and Goibibo as requested + maybe Cleartrip

        // Cleartrip
        // https://www.cleartrip.com/flights/results?from=CCU&to=BOM&depart_date=20/11/2025&adults=1&childs=0&infants=0&class=Economy&airline=&carrier=&intl=n&sd=1732300000000&page=loaded
        let ctUrl = `https://www.cleartrip.com/flights/results?from=${fromCode}&to=${toCode}&depart_date=${formattedDepDate}&adults=${passengers}&childs=0&infants=0&class=Economy&intl=n`;

        // Open in new tabs
        window.open(mmtUrl, '_blank');
        setTimeout(() => window.open(goiUrl, '_blank'), 500); // Slight delay to ensure popup blocker doesn't kill both
        // setTimeout(() => window.open(ctUrl, '_blank'), 1000);
    });
});

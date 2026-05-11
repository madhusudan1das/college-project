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

    // Search logic has been moved inline to index.html to avoid CORS blocking on file:/// URLs.
});





// ===============================
// NAVBAR MOBILE MENU
// ===============================
if (menuBtn && navbar) {
    menuBtn.onclick = () => {
        navbar.classList.toggle("active");
    };
}

// ===============================
// AUTH SECTION
// ===============================
const user = JSON.parse(localStorage.getItem("user"));
const authSection = document.getElementById("auth-section");

if (authSection) {
    if (user) {
        authSection.innerHTML = `
            <span class="welcome-text">Hello, ${user.name}</span>
            <button onclick="logout()" class="logout-btn">Sign Out</button>
        `;
    } else {
        authSection.innerHTML = `
            <a href="../login_page/login.html" class="signin">Sign In</a>
        `;
    }
}

function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.reload();
}

// ===============================
// CLASS TABS
// ===============================
const tabs = document.querySelectorAll(".tab");

tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
    });
});

// ===============================
// DROPDOWN FUNCTIONS
// ===============================
function toggleDropdown() {
    const dropdownContent = document.getElementById("dropdownMenu");

    if (!dropdownContent) return;

    dropdownContent.style.display =
        dropdownContent.style.display === "block"
            ? "none"
            : "block";
}

function selectTrip(type) {
    const dropbtn = document.getElementById("trip-type");
    const dropdownMenu = document.getElementById("dropdownMenu");

    if (dropbtn) {
        dropbtn.innerText = type + " ▼";
    }

    if (dropdownMenu) {
        dropdownMenu.style.display = "none";
    }
}

// ===============================
// TRAVELERS INPUT VALIDATION
// ===============================
const travelersInput = document.getElementById("travelers");

if (travelersInput) {
    travelersInput.addEventListener("input", () => {
        let value = travelersInput.value;

        if (value.length > 1) {
            value = value.slice(0, 1);
        }

        if (value === "0") {
            value = "1";
        }

        travelersInput.value = value;
    });
}

// ===============================
// SEARCH FLIGHT
// ===============================
const searchBtn = document.querySelector(".search-btn");

if (searchBtn) {
    searchBtn.addEventListener("click", () => {
        const from = document
            .getElementById("from-location")
            .value.trim();

        const to = document
            .getElementById("to-location")
            .value.trim();

        const departure = document
            .getElementById("checkin")
            .value;

        const returnDate = document
            .getElementById("checkout")
            .value;

        const travelers = document
            .getElementById("travelers")
            .value;

        const selectedTab =
            document.querySelector(".tab.active");

        const flightClass = selectedTab
            ? selectedTab.getAttribute("data-class")
            : "Economy";

        const tripType = document
            .getElementById("trip-type")
            .innerText.replace(" ▼", "");

        // Validation
        if (!from || !to || !departure) {
            alert(
                "Please fill From, Destination and Departure Date."
            );
            return;
        }

        // Create search object
        const searchData = {
            from,
            to,
            departure,
            returnDate,
            travelers,
            flightClass,
            tripType
        };

        // Save to localStorage
        localStorage.setItem(
            "flightSearchData",
            JSON.stringify(searchData)
        );

        // Redirect to results page
        window.location.href =
            "../search-results/search-results.html";
    });
}

// ===============================
// FLIGHT BOX SCROLL ANIMATION
// ===============================
const flightBox = document.querySelector(".flight-box");

function revealFlightBox() {
    if (!flightBox) return;

    const rect = flightBox.getBoundingClientRect();

    if (
        rect.top < window.innerHeight - 100 &&
        rect.bottom > 100
    ) {
        flightBox.classList.add("show");
    }
}

window.addEventListener("scroll", revealFlightBox);
window.addEventListener("load", revealFlightBox);

// ===============================
// TRAVEL IMAGES ROTATION
// ===============================
const travelImages = document.querySelector(".travel-images");

if (travelImages) {
    travelImages.addEventListener("click", () => {
        const big = document.querySelector(".big");
        const mid = document.querySelector(".mid");
        const small = document.querySelector(".small");

        if (!big || !mid || !small) return;

        big.classList.remove("big");
        big.classList.add("mid");

        mid.classList.remove("mid");
        mid.classList.add("small");

        small.classList.remove("small");
        small.classList.add("big");
    });
}

// ===============================
// FEATURE CARDS HOVER
// ===============================
document
    .querySelectorAll(".feature-oval")
    .forEach((box) => {
        box.addEventListener("mouseenter", () => {
            box.style.transform =
                "translateY(-10px) scale(1.03)";
        });

        box.addEventListener("mouseleave", () => {
            box.style.transform =
                "translateY(0) scale(1)";
        });
    });

// ===============================
// MINOR LOUNGE IMAGE SWAP
// ===============================
const ovalImagesContainer =
    document.querySelector(".oval-images");

let imagesSwapped = false;

if (ovalImagesContainer) {
    document
        .querySelectorAll(".oval-images .oval")
        .forEach((oval) => {
            oval.style.transition =
                "left 0.4s ease, top 0.4s ease, transform 0.3s ease";
        });

    ovalImagesContainer.addEventListener("click", () => {
        const img1 = document.querySelector(".img1");
        const img2 = document.querySelector(".img2");

        if (!img1 || !img2) return;

        if (!imagesSwapped) {
            img1.style.left = "130px";
            img1.style.top = "50px";
            img1.style.zIndex = "1";

            img2.style.left = "60px";
            img2.style.top = "20px";
            img2.style.zIndex = "2";

            imagesSwapped = true;
        } else {
            img1.style.left = "60px";
            img1.style.top = "20px";
            img1.style.zIndex = "2";

            img2.style.left = "130px";
            img2.style.top = "50px";
            img2.style.zIndex = "1";

            imagesSwapped = false;
        }

        img1.style.transform = "scale(1.05)";
        img2.style.transform = "scale(1.05)";

        setTimeout(() => {
            img1.style.transform = "scale(1)";
            img2.style.transform = "scale(1)";
        }, 300);
    });
}

// ===============================
// TRAVELERS SECTION ANIMATION
// ===============================
document
    .querySelectorAll(".travelers-section .oval")
    .forEach((oval) => {
        oval.addEventListener("click", () => {
            oval.style.transform = "scale(1.05)";

            setTimeout(() => {
                oval.style.transform = "scale(1)";
            }, 300);
        });
    });

// ===============================
// CLOSE DROPDOWN WHEN CLICK OUTSIDE
// ===============================
document.addEventListener("click", function (event) {
    const dropdown = document.querySelector(".dropdown");
    const dropdownMenu =
        document.getElementById("dropdownMenu");

    if (!dropdown || !dropdownMenu) return;

    if (!dropdown.contains(event.target)) {
        dropdownMenu.style.display = "none";
    }
});

// ===============================
// NEWSLETTER SUBSCRIBE
// ===============================
const subscribeBtn = document.querySelector(
    ".newsletter-box button"
);

if (subscribeBtn) {
    subscribeBtn.addEventListener(
        "click",
        async () => {
            const email = document
                .querySelector(".newsletter-box input")
                .value.trim();

            if (!email) {
                alert(
                    "Please enter your email address!"
                );
                return;
            }

            try {
                const response = await fetch(
                    "/subscribe",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type":
                                "application/json"
                        },
                        body: JSON.stringify({ email })
                    }
                );

                const data = await response.json();
                alert(data.message);
            } catch (error) {
                alert(
                    "Something went wrong. Try again later!"
                );
                console.error(error);
            }
        }
    );
}

// ===============================
// PERFECT LOADER FIX
// ===============================
window.addEventListener("load", () => {
    const videoLoader =
        document.getElementById("loader");

    const spinnerLoader =
        document.getElementById("spinner-loader");

    const video =
        document.getElementById("loaderVideo");

    if (!videoLoader || !spinnerLoader) return;

    const isFirstVisit =
        sessionStorage.getItem("visited") === null;

    if (isFirstVisit) {
        sessionStorage.setItem("visited", "true");

        videoLoader.style.display = "flex";

        if (video) {
            video.play().catch(() => { });
            video.onended = hideVideo;
        }

        setTimeout(hideVideo, 4000);

        function hideVideo() {
            videoLoader.style.opacity = "0";

            setTimeout(() => {
                videoLoader.style.display = "none";
            }, 500);
        }
    } else {
        spinnerLoader.style.display = "flex";

        setTimeout(() => {
            spinnerLoader.style.display = "none";
        }, 800);

        videoLoader.style.display = "none";
    }
});

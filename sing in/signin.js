document.querySelector(".signin-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const phoneInput = document.getElementById("phone").value;

    if (phoneInput.length === 10 && !isNaN(phoneInput)) {
        alert("Phone number accepted! Proceeding...");
        // Here you can redirect or trigger OTP 
    } else {
        alert("Please enter a valid 10-digit phone number.");
    }
});

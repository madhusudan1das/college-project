function showPopup(message, isError = false) {
    const popup = document.createElement("div");
    popup.className = `popup ${isError ? "error" : ""}`;
    popup.innerText = message;
    document.body.appendChild(popup);

    setTimeout(() => popup.classList.add("show"), 100);
    setTimeout(() => {
        popup.classList.remove("show");
        setTimeout(() => popup.remove(), 300);
    }, 2500);
}

document.getElementById("send").addEventListener("click", function () {

    let btn = document.getElementById("send");
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
        showPopup("⚠️ Please fill all fields!", true);
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        showPopup("⚠️ Invalid email address!", true);
        return;
    }

    btn.classList.add("loading");
    btn.innerText = "Sending";

    const params = { name, email, message };

    emailjs.send("service_dv7bl58", "template_e2igjwa", params)
        .then(() => {
            showPopup("✅ Message sent successfully!");

            document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("message").value = "";
        })
        .catch((error) => {
            showPopup("❌ Failed to send message!", true);
            console.error("EmailJS Error:", error);
        })
        .finally(() => {
            btn.classList.remove("loading");
            btn.innerText = "Send Message";
        });
});

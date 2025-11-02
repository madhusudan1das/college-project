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
        alert('welcome to our project');
    }
});

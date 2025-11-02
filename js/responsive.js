const menuBtn = document.getElementById("menu-toggle");
const sidebar = document.querySelector(".side-bar");

if (menuBtn && sidebar) {
    menuBtn.addEventListener("click", () => {
        sidebar.classList.toggle("active");
    });

    // Optional: close drawer when clicking outside
    document.addEventListener("click", (e) => {
        if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
            sidebar.classList.remove("active");
        }
    });
}

function updateOnlineStatus() {
    const offlineNotice = document.getElementById("offlineNotice");

    if (navigator.onLine) {
        offlineNotice.style.display = "none";
    } else {
        offlineNotice.style.display = "block";
    }
}

// Run once at page load
updateOnlineStatus();

// Listen for status changes
window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);

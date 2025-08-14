function startCountdown(targetDate, elementId) {
    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            document.getElementById(elementId).innerHTML = "it's TIME!";
            clearInterval(interval);
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById(elementId).innerHTML =
            `${days}d ${hours}h ${minutes}м ${seconds}s`;
    }

    updateCountdown(); // 
    const interval = setInterval(updateCountdown, 1000);
}

// 
const newYear = new Date("2025-12-31T23:59:59").getTime();
startCountdown(newYear, "countdown");


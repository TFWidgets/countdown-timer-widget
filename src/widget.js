function startCountdown(targetDate) {
    const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            clearInterval(timer);
            console.log("Countdown finished!");
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        console.log(`${days}d ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);
}

startCountdown(new Date("2025-12-31 23:59:59").getTime());

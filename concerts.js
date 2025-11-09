// Concerts Discord Links Management
document.addEventListener('DOMContentLoaded', function() {
    const concertItems = document.querySelectorAll('.concert-item');
    
    concertItems.forEach(item => {
        const discordUrl = item.dataset.discord;
        const discordBtn = item.querySelector('.discord-btn');
        
        if (!discordUrl || discordUrl.trim() === '') {
            // Hide the button if no Discord URL is provided
            if (discordBtn) {
                discordBtn.style.display = 'none';
            }
        } else {
            // Set the Discord URL to the button
            if (discordBtn) {
                discordBtn.href = discordUrl;
                discordBtn.target = '_blank';
                discordBtn.rel = 'noopener noreferrer';
            }
        }
    });
});

// Concerts Discord Links Management and Past Concert Detection
document.addEventListener('DOMContentLoaded', function() {
    const concertItems = document.querySelectorAll('.concert-item');
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to midnight for accurate date comparison
    
    concertItems.forEach(item => {
        const discordUrl = item.dataset.discord;
        const discordBtn = item.querySelector('.discord-btn');
        const concertDateStr = item.dataset.date;
        
        // Check if concert date is in the past
        if (concertDateStr) {
            const concertDate = new Date(concertDateStr);
            concertDate.setHours(0, 0, 0, 0);
            
            if (concertDate < today) {
                // Add 'past-concert' class for styling
                item.classList.add('past-concert');
                
                // Add a "Terminé" badge
                const concertDetails = item.querySelector('.concert-details');
                if (concertDetails && !item.querySelector('.past-badge')) {
                    const badge = document.createElement('span');
                    badge.className = 'past-badge';
                    badge.innerHTML = '<i class="fa-solid fa-check-circle"></i> Terminé';
                    concertDetails.insertBefore(badge, concertDetails.firstChild);
                }
            }
        }
        
        // Discord button management
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

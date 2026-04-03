// Concerts Data - Will be loaded from JSON
let concertsData = {};

// Load concerts data from JSON
async function loadConcertsData() {
    try {
        const response = await fetch('data/concerts.json');
        concertsData = await response.json();
        console.log('Concerts data loaded successfully');
    } catch (error) {
        console.error('Error loading concerts data:', error);
    }
}

// Generate concert HTML
function generateConcertHTML(concert) {
    const concertDate = new Date(concert.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    concertDate.setHours(0, 0, 0, 0);
    const isPast = concertDate < today;
    
    const months = ['JAN', 'FEV', 'MAR', 'AVR', 'MAI', 'JUN', 'JUL', 'AOU', 'SEP', 'OCT', 'NOV', 'DEC'];
    const day = concertDate.getDate().toString().padStart(2, '0');
    const month = months[concertDate.getMonth()];
    const year = concertDate.getFullYear();
    
    const pastBadge = isPast ? '<span class="past-badge"><i class="fa-solid fa-check-circle"></i> Terminé</span>' : '';
    const pastClass = isPast ? ' past-concert' : '';
    
    return `
        <div class="concert-item${pastClass}" data-discord="${concert.discord}" data-date="${concert.date}">
            <div class="concert-date">
                <div class="date-day">${day}</div>
                <div class="date-month">${month}</div>
                <div class="date-year">${year}</div>
            </div>
            <div class="concert-details">
                ${pastBadge}
                <h3 class="concert-venue">${concert.venue}</h3>
                <p class="concert-location">
                    <svg class="location-icon" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                    </svg>
                    ${concert.location}
                </p>
                <p class="concert-time">${concert.time}</p>
            </div>
            <div class="concert-actions">
                <a href="${concert.discord}" class="concert-btn discord-btn" target="_blank" rel="noopener noreferrer">
                    <i class="fa-brands fa-discord"></i>
                    Discord
                </a>
            </div>
        </div>
    `;
}

// Sort concerts by date
function sortConcerts(concerts) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return concerts.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        dateA.setHours(0, 0, 0, 0);
        dateB.setHours(0, 0, 0, 0);
        
        const isPastA = dateA < today;
        const isPastB = dateB < today;
        
        // If one is past and one is upcoming, upcoming comes first
        if (isPastA && !isPastB) return 1;
        if (!isPastA && isPastB) return -1;
        
        // If both are upcoming, sort by closest date (ascending)
        if (!isPastA && !isPastB) {
            return dateA - dateB;
        }
        
        // If both are past, sort by most recent first (descending)
        return dateB - dateA;
    });
}

// Initialize concerts
document.addEventListener('DOMContentLoaded', async function() {
    // Load concerts data
    await loadConcertsData();
    
    const concertsList = document.querySelector('.concerts-list');
    
    if (concertsData.concerts && concertsList) {
        // Sort concerts
        const sortedConcerts = sortConcerts(concertsData.concerts);
        
        // Generate and insert HTML
        concertsList.innerHTML = sortedConcerts.map(concert => generateConcertHTML(concert)).join('');
        
        console.log(`${sortedConcerts.length} concerts loaded and displayed`);
    }
});

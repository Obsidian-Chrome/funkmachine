// FATM Merch Manager
async function loadMerch() {
    try {
        const response = await fetch('../data/merch_fatm.json');
        const data = await response.json();
        displayMerch(data.items);
    } catch (error) {
        console.error('Erreur lors du chargement du merch:', error);
    }
}

function displayMerch(items) {
    const merchGrid = document.getElementById('merchGrid');
    
    if (items.length === 0) {
        merchGrid.innerHTML = '<p class="no-merch">Aucun article disponible pour le moment.</p>';
        return;
    }
    
    let html = '';
    items.forEach(item => {
        html += `
            <div class="merch-item">
                <div class="merch-image">
                    <img src="../${item.image}" alt="${item.title}">
                </div>
                <div class="merch-info">
                    <h3 class="merch-title">${item.title}</h3>
                    ${item.price ? `<p class="merch-price">${item.price}</p>` : ''}
                    ${item.download ? `
                        <a href="../${item.download}" download class="merch-download-btn">
                            <i class="fa-solid fa-download"></i>
                            Télécharger
                        </a>
                    ` : ''}
                </div>
            </div>
        `;
    });
    
    merchGrid.innerHTML = html;
}

document.addEventListener('DOMContentLoaded', loadMerch);

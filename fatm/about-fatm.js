// FATM About Page - Discography Display
async function loadDiscography() {
    try {
        const response = await fetch('../data/albums_fatm.json');
        const albums = await response.json();
        displayDiscography(albums);
    } catch (error) {
        console.error('Erreur lors du chargement de la discographie:', error);
    }
}

function displayDiscography(albums) {
    const discography = document.getElementById('discography');
    
    let html = '';
    let albumNumber = 1;
    
    Object.keys(albums).forEach(albumId => {
        const album = albums[albumId];
        html += `
            <div class="album-info">
                <h4 class="album-name">${album.name}</h4>
                <p class="album-year">${getAlbumLabel(albumNumber)}</p>
                <ul class="tracklist">
                    ${album.tracks.map(track => `<li>${track.name}</li>`).join('')}
                </ul>
            </div>
        `;
        albumNumber++;
    });
    
    discography.innerHTML = html || '<p>Aucun album disponible.</p>';
}

function getAlbumLabel(number) {
    const labels = {
        1: '1er Album',
        2: '2e Album',
        3: '3e Album',
        4: '4e Album',
        5: '5e Album'
    };
    return labels[number] || `${number}e Album`;
}

document.addEventListener('DOMContentLoaded', loadDiscography);

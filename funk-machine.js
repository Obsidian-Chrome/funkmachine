// Albums Database - Will be loaded from JSON
let albumsDatabase = {};
let currentAlbum = 'era';

// Load albums data from JSON
async function loadAlbumsData() {
    try {
        const response = await fetch('data/albums.json');
        albumsDatabase = await response.json();
        console.log('Albums data loaded successfully');
    } catch (error) {
        console.error('Error loading albums data:', error);
    }
}

// Player State
const player = {
    audio: document.getElementById('audioPlayer'),
    currentTrackIndex: -1,
    isPlaying: false,
    isShuffle: false,
    repeatMode: 0, // 0: no repeat, 1: repeat all, 2: repeat one
    volume: 0.7,
    tracks: []
};

// DOM Elements
const playBtn = document.getElementById('playBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const shuffleBtn = document.getElementById('shuffleBtn');
const repeatBtn = document.getElementById('repeatBtn');
const volumeBtn = document.getElementById('volumeBtn');
const volumeSlider = document.getElementById('volumeSlider');
const volumeFill = document.getElementById('volumeFill');
const progressBar = document.getElementById('progressBar');
const progressFill = document.getElementById('progressFill');
const progressHandle = document.getElementById('progressHandle');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');
const currentTrackName = document.getElementById('currentTrackName');
const playlist = document.getElementById('playlist');
const trackItems = document.querySelectorAll('.track-item');

// Initialize
async function init() {
    // Load albums data first
    await loadAlbumsData();
    
    // Get all tracks
    trackItems.forEach((item, index) => {
        player.tracks.push({
            element: item,
            src: item.dataset.src,
            name: item.querySelector('.track-name').textContent,
            duration: item.querySelector('.track-duration').textContent
        });
        
        // Add click event
        item.addEventListener('click', (e) => {
            // Don't load track if clicking on download or YouTube button
            if (e.target.closest('.track-download-btn') || e.target.closest('.track-youtube-btn')) {
                return;
            }
            loadTrack(index);
        });
    });
    
    // Prevent download and YouTube buttons from triggering track load
    document.querySelectorAll('.track-download-btn, .track-youtube-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
    
    // Set initial volume
    player.audio.volume = player.volume;
    updateVolumeUI();
    
    // Event Listeners
    playBtn.addEventListener('click', togglePlay);
    prevBtn.addEventListener('click', playPrevious);
    nextBtn.addEventListener('click', playNext);
    shuffleBtn.addEventListener('click', toggleShuffle);
    repeatBtn.addEventListener('click', toggleRepeat);
    volumeBtn.addEventListener('click', toggleMute);
    volumeSlider.addEventListener('input', changeVolume);
    progressBar.addEventListener('click', seek);
    
    // Audio Events
    player.audio.addEventListener('timeupdate', updateProgress);
    player.audio.addEventListener('loadedmetadata', updateDuration);
    player.audio.addEventListener('ended', handleTrackEnd);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboard);
}

// Load Track
function loadTrack(index) {
    if (index < 0 || index >= player.tracks.length) return;
    
    const track = player.tracks[index];
    player.currentTrackIndex = index;
    
    // Update UI - Get current track items dynamically
    const currentTrackItems = document.querySelectorAll('.track-item');
    currentTrackItems.forEach(item => item.classList.remove('active'));
    track.element.classList.add('active');
    
    currentTrackName.textContent = track.name;
    
    // Load audio
    player.audio.src = track.src;
    player.audio.load();
    
    // Auto play automatically when selecting a track
    player.audio.play().then(() => {
        player.isPlaying = true;
        updatePlayButton();
    }).catch(err => console.log('Playback error:', err));
}


// Toggle Play/Pause
function togglePlay() {
    if (player.currentTrackIndex === -1 && player.tracks.length > 0) {
        loadTrack(0);
    }
    
    if (player.isPlaying) {
        player.audio.pause();
        player.isPlaying = false;
        updatePlayButton();
    } else {
        player.audio.play().then(() => {
            player.isPlaying = true;
            updatePlayButton();
        }).catch(err => {
            console.log('Playback error:', err);
        });
    }
}

// Update Play Button
function updatePlayButton() {
    const playIcon = playBtn.querySelector('.play-icon');
    const pauseIcon = playBtn.querySelector('.pause-icon');
    
    if (player.isPlaying) {
        playIcon.classList.add('hidden');
        pauseIcon.classList.remove('hidden');
    } else {
        playIcon.classList.remove('hidden');
        pauseIcon.classList.add('hidden');
    }
}

// Play Previous
function playPrevious() {
    if (player.currentTrackIndex > 0) {
        loadTrack(player.currentTrackIndex - 1);
        if (player.isPlaying) {
            player.audio.play();
        }
    }
}

// Play Next
function playNext() {
    let nextIndex;
    
    if (player.isShuffle) {
        // Random track (but not current)
        do {
            nextIndex = Math.floor(Math.random() * player.tracks.length);
        } while (nextIndex === player.currentTrackIndex && player.tracks.length > 1);
    } else {
        nextIndex = player.currentTrackIndex + 1;
        if (nextIndex >= player.tracks.length) {
            if (player.repeatMode === 1) {
                nextIndex = 0; // Loop to first track
            } else {
                return; // End of playlist
            }
        }
    }
    
    loadTrack(nextIndex);
    if (player.isPlaying) {
        player.audio.play();
    }
}

// Handle Track End
function handleTrackEnd() {
    if (player.repeatMode === 2) {
        // Repeat current track
        player.audio.currentTime = 0;
        player.audio.play();
    } else {
        playNext();
    }
}

// Toggle Shuffle
function toggleShuffle() {
    player.isShuffle = !player.isShuffle;
    shuffleBtn.classList.toggle('active', player.isShuffle);
}

// Toggle Repeat
function toggleRepeat() {
    player.repeatMode = (player.repeatMode + 1) % 3;
    const repeatOne = repeatBtn.querySelector('.repeat-one');
    
    switch(player.repeatMode) {
        case 0: // No repeat
            repeatBtn.classList.remove('active');
            repeatOne.classList.add('hidden');
            break;
        case 1: // Repeat all
            repeatBtn.classList.add('active');
            repeatOne.classList.add('hidden');
            break;
        case 2: // Repeat one
            repeatBtn.classList.add('active');
            repeatOne.classList.remove('hidden');
            break;
    }
}

// Volume Control
function changeVolume(e) {
    const volume = e.target.value / 100;
    player.audio.volume = volume;
    player.volume = volume;
    updateVolumeUI();
}

function toggleMute() {
    if (player.audio.volume > 0) {
        player.audio.volume = 0;
        updateVolumeUI();
    } else {
        player.audio.volume = player.volume;
        updateVolumeUI();
    }
}

function updateVolumeUI() {
    const volumePercent = player.audio.volume * 100;
    volumeSlider.value = volumePercent;
    volumeFill.style.width = volumePercent + '%';
    
    const volumeIcon = volumeBtn.querySelector('.volume-icon');
    const muteIcon = volumeBtn.querySelector('.mute-icon');
    
    if (player.audio.volume === 0) {
        volumeIcon.classList.add('hidden');
        muteIcon.classList.remove('hidden');
    } else {
        volumeIcon.classList.remove('hidden');
        muteIcon.classList.add('hidden');
    }
}

// Progress Bar
function updateProgress() {
    if (!player.audio.duration) return;
    
    const percent = (player.audio.currentTime / player.audio.duration) * 100;
    progressFill.style.width = percent + '%';
    progressHandle.style.left = percent + '%';
    
    currentTime.textContent = formatTime(player.audio.currentTime);
}

function updateDuration() {
    totalTime.textContent = formatTime(player.audio.duration);
}

function seek(e) {
    if (!player.audio.duration) return;
    
    const rect = progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    player.audio.currentTime = percent * player.audio.duration;
}

// Format Time
function formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Keyboard Shortcuts
function handleKeyboard(e) {
    switch(e.code) {
        case 'Space':
            e.preventDefault();
            togglePlay();
            break;
        case 'ArrowLeft':
            e.preventDefault();
            player.audio.currentTime = Math.max(0, player.audio.currentTime - 5);
            break;
        case 'ArrowRight':
            e.preventDefault();
            player.audio.currentTime = Math.min(player.audio.duration, player.audio.currentTime + 5);
            break;
        case 'ArrowUp':
            e.preventDefault();
            player.audio.volume = Math.min(1, player.audio.volume + 0.1);
            player.volume = player.audio.volume;
            updateVolumeUI();
            break;
        case 'ArrowDown':
            e.preventDefault();
            player.audio.volume = Math.max(0, player.audio.volume - 0.1);
            player.volume = player.audio.volume;
            updateVolumeUI();
            break;
        case 'KeyM':
            e.preventDefault();
            toggleMute();
            break;
        case 'KeyN':
            e.preventDefault();
            playNext();
            break;
        case 'KeyP':
            e.preventDefault();
            playPrevious();
            break;
        case 'KeyS':
            e.preventDefault();
            toggleShuffle();
            break;
        case 'KeyR':
            e.preventDefault();
            toggleRepeat();
            break;
    }
}

// Progress Bar Drag
let isDragging = false;

progressBar.addEventListener('mousedown', (e) => {
    isDragging = true;
    seek(e);
});

document.addEventListener('mousemove', (e) => {
    if (isDragging) {
        seek(e);
    }
});

document.addEventListener('mouseup', () => {
    isDragging = false;
});

// Album Selector
const albumSwitchBtn = document.getElementById('albumSwitchBtn');
const albumDropdown = document.getElementById('albumDropdown');
const albumOptions = document.querySelectorAll('.album-option');
const albumArtContainer = document.getElementById('albumArtContainer');
const albumArtImg = document.getElementById('albumArtImg');
const albumTitle = document.getElementById('albumTitle');
const currentAlbumName = document.getElementById('currentAlbumName');

// Toggle dropdown
if (albumSwitchBtn) {
    albumSwitchBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        albumSwitchBtn.classList.toggle('active');
        albumDropdown.classList.toggle('show');
    });
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (albumDropdown && !albumDropdown.contains(e.target) && e.target !== albumSwitchBtn) {
        albumSwitchBtn.classList.remove('active');
        albumDropdown.classList.remove('show');
    }
});

// Switch album
albumOptions.forEach(option => {
    option.addEventListener('click', () => {
        const albumId = option.dataset.album;
        
        if (albumId === currentAlbum) {
            albumDropdown.classList.remove('show');
            albumSwitchBtn.classList.remove('active');
            return;
        }
        
        // Update active state
        albumOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        
        // Close dropdown
        albumDropdown.classList.remove('show');
        albumSwitchBtn.classList.remove('active');
        
        // Switch album with animation
        switchAlbum(albumId);
    });
});

function switchAlbum(albumId) {
    const album = albumsDatabase[albumId];
    
    if (!album) return;
    
    // Add switching animation
    albumArtContainer.classList.add('switching');
    
    // Stop current playback
    if (player.isPlaying) {
        togglePlay();
    }
    
    setTimeout(() => {
        // Update album info
        currentAlbum = albumId;
        albumArtImg.src = album.image;
        albumArtImg.alt = album.name;
        albumTitle.textContent = album.name.toUpperCase();
        currentAlbumName.textContent = album.name;
        
        // Update playlist
        if (albumId === 'covers' || albumId === 'collabs' || albumId === 'ivory_tower') {
            // Generate playlist HTML dynamically
            let playlistHTML = '';
            album.tracks.forEach((track, index) => {
                playlistHTML += `
                    <div class="track-item" data-src="${track.src}">
                        <div class="track-number">${String(index + 1).padStart(2, '0')}</div>
                        <div class="track-details">
                            <div class="track-name">${track.name}</div>
                            <div class="track-duration">${track.duration}</div>
                        </div>
                        <div class="track-visualizer">
                            <span></span><span></span><span></span><span></span><span></span>
                        </div>
                        ${track.youtube ? `<a href="${track.youtube}" target="_blank" rel="noopener noreferrer" class="track-youtube-btn" title="Écouter sur YouTube">
                            <i class="fa-brands fa-youtube"></i>
                        </a>` : ''}
                        <a href="${track.src}" download class="track-download-btn" title="Télécharger MP3">
                            <i class="fa-solid fa-download"></i>
                        </a>
                    </div>
                `;
            });
            
            playlist.innerHTML = playlistHTML;
            
            currentTrackName.textContent = 'Sélectionnez une piste';
            
            // Reset and reload tracks
            player.tracks = [];
            player.currentTrack = 0;
            
            // Re-initialize tracks
            const newTrackItems = document.querySelectorAll('.track-item');
            newTrackItems.forEach((item, index) => {
                player.tracks.push({
                    element: item,
                    src: item.dataset.src,
                    name: item.querySelector('.track-name').textContent,
                    duration: item.querySelector('.track-duration').textContent
                });
                
                // Add click event
                item.addEventListener('click', (e) => {
                    if (e.target.closest('.track-download-btn') || e.target.closest('.track-youtube-btn')) {
                        return;
                    }
                    loadTrack(index);
                });
            });
            
            // Prevent download buttons from triggering track load
            document.querySelectorAll('.track-download-btn, .track-youtube-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                });
            });
        } else {
            // Reload era tracks (refresh page)
            location.reload();
        }
        
        // Remove animation class
        albumArtContainer.classList.remove('switching');
    }, 300);
}

// Initialize on load
document.addEventListener('DOMContentLoaded', init);

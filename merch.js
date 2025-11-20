// Merch Image Lightbox
document.addEventListener('DOMContentLoaded', function() {
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = document.querySelector('.lightbox-close');
    const zoomImages = document.querySelectorAll('.merch-image-zoom');

    // Open lightbox when clicking on an image
    zoomImages.forEach(img => {
        img.addEventListener('click', function() {
            const imgSrc = this.dataset.img;
            lightboxImg.src = imgSrc;
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        });
    });

    // Close lightbox when clicking the X button
    closeBtn.addEventListener('click', closeLightbox);

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Close lightbox with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && lightbox.style.display === 'flex') {
            closeLightbox();
        }
    });

    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto'; // Restore scrolling
    }

    // T-shirt F Version Switch
    const switchBtn = document.getElementById('tshirt-f-switch');
    const tshirtImg = document.getElementById('tshirt-f-img');
    const tshirtTitle = document.getElementById('tshirt-f-title');
    const tshirtInfo = document.getElementById('tshirt-f-info');
    const tshirtCompatibility = document.getElementById('tshirt-f-compatibility');
    const tshirtDownload = document.getElementById('tshirt-f-download');
    const tshirtZoomContainer = tshirtImg.closest('.merch-image-zoom');

    let isAltVersion = false;

    const versions = {
        standard: {
            image: 'Media/FunkMachine_F.png',
            title: 'T-shirt [F]',
            size: '19 MO',
            download: 'Media/Funk Machine t-shirt [F].pmp',
            compatibility: ['Bibo', 'Rue', 'Bimbo', 'Uranus', 'YAB', 'Lavabod & Larue', 'RUEXB+']
        },
        alt: {
            image: 'Media/FunkMachine_FAlt.png',
            title: 'T-shirt [F-Alt]',
            size: '20 MO',
            download: 'Media/Funk Machine t-shirt [F-Alt].pmp',
            compatibility: ['Rue', 'YAB', 'Lavabod & Larue']
        }
    };

    switchBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        isAltVersion = !isAltVersion;
        const currentVersion = isAltVersion ? versions.alt : versions.standard;

        // Update image
        tshirtImg.src = currentVersion.image;
        tshirtZoomContainer.dataset.img = currentVersion.image;

        // Update title
        tshirtTitle.textContent = currentVersion.title;

        // Update info
        tshirtInfo.innerHTML = `
            <span class="merch-size">${currentVersion.size}</span>
            <span class="merch-format">PMP</span>
        `;

        // Update compatibility
        const compatibilityList = currentVersion.compatibility.map(item => `<li>${item}</li>`).join('');
        tshirtCompatibility.innerHTML = `
            <h4 class="compatibility-title">Compatibilité :</h4>
            <ul class="compatibility-list">
                ${compatibilityList}
            </ul>
        `;

        // Update download link
        tshirtDownload.href = currentVersion.download;

        // Add animation effect
        switchBtn.querySelector('i').style.transform = 'rotate(180deg)';
        setTimeout(() => {
            switchBtn.querySelector('i').style.transform = 'rotate(0deg)';
        }, 300);
    });

    // Community Carousel
    const carouselTrack = document.getElementById('carouselTrack');
    const carouselItems = document.querySelectorAll('.carousel-item');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const indicators = document.querySelectorAll('.indicator');
    
    let currentIndex = 0;
    const totalItems = carouselItems.length;

    function updateCarousel() {
        // Remove active class from all items and indicators
        carouselItems.forEach(item => item.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Add active class to current item and indicator
        carouselItems[currentIndex].classList.add('active');
        indicators[currentIndex].classList.add('active');
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalItems;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalItems) % totalItems;
        updateCarousel();
    }

    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });

    // Auto-play carousel (optional)
    let autoplayInterval = setInterval(nextSlide, 5000);

    // Pause autoplay on hover
    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', () => {
            clearInterval(autoplayInterval);
        });

        carouselContainer.addEventListener('mouseleave', () => {
            autoplayInterval = setInterval(nextSlide, 5000);
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
});

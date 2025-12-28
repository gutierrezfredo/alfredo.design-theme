// Lightbox for post content images with navigation
(function() {
    // Get all post content images
    const images = Array.from(document.querySelectorAll('.post-content img'));
    if (images.length === 0) return;

    let currentIndex = 0;

    // Create lightbox elements
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.innerHTML = `
        <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
        <button class="lightbox-prev" aria-label="Previous image"><i class="fas fa-chevron-left"></i></button>
        <img class="lightbox-image" src="" alt="">
        <button class="lightbox-next" aria-label="Next image"><i class="fas fa-chevron-right"></i></button>
        <div class="lightbox-counter"></div>
    `;
    document.body.appendChild(overlay);

    const lightboxImage = overlay.querySelector('.lightbox-image');
    const closeBtn = overlay.querySelector('.lightbox-close');
    const prevBtn = overlay.querySelector('.lightbox-prev');
    const nextBtn = overlay.querySelector('.lightbox-next');
    const counter = overlay.querySelector('.lightbox-counter');

    // Update lightbox image and counter
    function updateLightbox(animate) {
        const img = images[currentIndex];

        if (animate) {
            // Fade out, change image, fade in
            lightboxImage.style.opacity = '0';
            setTimeout(function() {
                lightboxImage.src = img.src;
                lightboxImage.alt = img.alt;
                lightboxImage.style.opacity = '1';
            }, 150);
        } else {
            lightboxImage.src = img.src;
            lightboxImage.alt = img.alt;
        }

        counter.textContent = (currentIndex + 1) + ' / ' + images.length;

        // Hide/show arrows based on position
        prevBtn.style.visibility = currentIndex > 0 ? 'visible' : 'hidden';
        nextBtn.style.visibility = currentIndex < images.length - 1 ? 'visible' : 'hidden';

        // Hide counter if only one image
        counter.style.display = images.length > 1 ? 'block' : 'none';
    }

    // Navigate to previous image
    function showPrev() {
        if (currentIndex > 0) {
            currentIndex--;
            updateLightbox(true);
        }
    }

    // Navigate to next image
    function showNext() {
        if (currentIndex < images.length - 1) {
            currentIndex++;
            updateLightbox(true);
        }
    }

    // Add click handlers to post content images
    images.forEach(function(img, index) {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', function(e) {
            e.preventDefault();
            currentIndex = index;
            updateLightbox(false);
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close lightbox
    function closeLightbox() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showPrev();
    });
    nextBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        showNext();
    });

    overlay.addEventListener('click', function(e) {
        // Close if clicking anywhere except the image or nav buttons
        if (e.target === overlay || e.target === lightboxImage) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!overlay.classList.contains('active')) return;

        switch(e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                showPrev();
                break;
            case 'ArrowRight':
                showNext();
                break;
        }
    });

    // Touch/swipe navigation for mobile
    let touchStartX = 0;
    let touchEndX = 0;
    const minSwipeDistance = 50;

    overlay.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    overlay.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) > minSwipeDistance) {
            if (swipeDistance > 0) {
                // Swiped right - show previous
                showPrev();
            } else {
                // Swiped left - show next
                showNext();
            }
        }
    }, { passive: true });
})();

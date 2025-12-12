/**
 * Image Gallery Example
 * Demonstrates: Carousel, Modal, Grid, DOM manipulation, Storage
 */

// Sample gallery data (In production, load from API or database)
const galleryData = [
    {
        id: 1,
        title: 'Mountain Sunset',
        category: 'nature',
        description: 'Beautiful sunset over mountain peaks',
        image: 'https://picsum.photos/800/600?random=1'
    },
    {
        id: 2,
        title: 'City Lights',
        category: 'city',
        description: 'Urban skyline at night',
        image: 'https://picsum.photos/800/600?random=2'
    },
    {
        id: 3,
        title: 'Portrait',
        category: 'people',
        description: 'Professional portrait photography',
        image: 'https://picsum.photos/800/600?random=3'
    },
    {
        id: 4,
        title: 'Abstract Art',
        category: 'abstract',
        description: 'Modern abstract composition',
        image: 'https://picsum.photos/800/600?random=4'
    },
    {
        id: 5,
        title: 'Forest Path',
        category: 'nature',
        description: 'Winding path through autumn forest',
        image: 'https://picsum.photos/800/600?random=5'
    },
    {
        id: 6,
        title: 'Downtown',
        category: 'city',
        description: 'Busy downtown intersection',
        image: 'https://picsum.photos/800/600?random=6'
    },
    {
        id: 7,
        title: 'Street Portrait',
        category: 'people',
        description: 'Candid street photography',
        image: 'https://picsum.photos/800/600?random=7'
    },
    {
        id: 8,
        title: 'Color Burst',
        category: 'abstract',
        description: 'Vibrant color explosion',
        image: 'https://picsum.photos/800/600?random=8'
    },
    {
        id: 9,
        title: 'Ocean Waves',
        category: 'nature',
        description: 'Crashing waves on rocky shore',
        image: 'https://picsum.photos/800/600?random=9'
    },
    {
        id: 10,
        title: 'Architecture',
        category: 'city',
        description: 'Modern architectural design',
        image: 'https://picsum.photos/800/600?random=10'
    },
    {
        id: 11,
        title: 'Family',
        category: 'people',
        description: 'Happy family moment',
        image: 'https://picsum.photos/800/600?random=11'
    },
    {
        id: 12,
        title: 'Geometric',
        category: 'abstract',
        description: 'Geometric patterns and shapes',
        image: 'https://picsum.photos/800/600?random=12'
    },
    {
        id: 13,
        title: 'Waterfall',
        category: 'nature',
        description: 'Powerful waterfall cascade',
        image: 'https://picsum.photos/800/600?random=13'
    },
    {
        id: 14,
        title: 'Bridge',
        category: 'city',
        description: 'Iconic city bridge at dusk',
        image: 'https://picsum.photos/800/600?random=14'
    },
    {
        id: 15,
        title: 'Musician',
        category: 'people',
        description: 'Street musician performing',
        image: 'https://picsum.photos/800/600?random=15'
    },
    {
        id: 16,
        title: 'Fluid Motion',
        category: 'abstract',
        description: 'Flowing abstract patterns',
        image: 'https://picsum.photos/800/600?random=16'
    },
    {
        id: 17,
        title: 'Wildflowers',
        category: 'nature',
        description: 'Field of colorful wildflowers',
        image: 'https://picsum.photos/800/600?random=17'
    },
    {
        id: 18,
        title: 'Skyscraper',
        category: 'city',
        description: 'Looking up at tall building',
        image: 'https://picsum.photos/800/600?random=18'
    },
    {
        id: 19,
        title: 'Dancer',
        category: 'people',
        description: 'Graceful dance movement',
        image: 'https://picsum.photos/800/600?random=19'
    },
    {
        id: 20,
        title: 'Texture',
        category: 'abstract',
        description: 'Interesting texture closeup',
        image: 'https://picsum.photos/800/600?random=20'
    },
    {
        id: 21,
        title: 'Lake Reflection',
        category: 'nature',
        description: 'Mountains reflected in calm lake',
        image: 'https://picsum.photos/800/600?random=21'
    },
    {
        id: 22,
        title: 'Street Scene',
        category: 'city',
        description: 'Vibrant street life',
        image: 'https://picsum.photos/800/600?random=22'
    },
    {
        id: 23,
        title: 'Silhouette',
        category: 'people',
        description: 'Person silhouette at sunset',
        image: 'https://picsum.photos/800/600?random=23'
    },
    {
        id: 24,
        title: 'Light Trails',
        category: 'abstract',
        description: 'Long exposure light trails',
        image: 'https://picsum.photos/800/600?random=24'
    }
];

// State
let currentCategory = 'all';
let currentImageIndex = 0;
let filteredImages = [...galleryData];
let viewCount = S.get('gallery-views', 0);

// Update view count
$('#views-count').text(viewCount);

// Initialize featured carousel with first 6 images
const featuredImages = galleryData.slice(0, 6);
const carouselHTML = featuredImages.map(img => `
    <div class="carousel-slide">
        <img src="${img.image}" alt="${img.title}">
        <div class="carousel-slide-content">
            <h3>${img.title}</h3>
            <p>${img.description}</p>
        </div>
    </div>
`).join('');

$('#featured-carousel').html(carouselHTML);

// Initialize carousel component
const carousel = Domma.elements.carousel('#featured-carousel', {
    autoplay: true,
    interval: 4000,
    loop: true,
    animation: 'slide',
    showArrows: true,
    showIndicators: true
});

// Render gallery grid
function renderGallery(images) {
    const grid = $('#gallery-grid');

    if (images.length === 0) {
        grid.html('<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: var(--dm-text-muted);">No images found in this category.</div>');
        return;
    }

    const html = images.map((img, index) => `
        <div class="gallery-item" data-image-id="${img.id}" data-index="${index}">
            <img src="${img.image}" alt="${img.title}" loading="lazy">
            <div class="gallery-item-overlay">
                <div class="gallery-item-title">${img.title}</div>
                <div class="gallery-item-desc">${img.description}</div>
            </div>
        </div>
    `).join('');

    grid.html(html);

    // Add click handlers for lightbox
    $('.gallery-item').on('click', function () {
        const index = parseInt($(this).attr('data-index'));
        openLightbox(index);
    });
}

// Initial render
renderGallery(filteredImages);

// Category filter
$('.category-filter button').on('click', function () {
    const category = $(this).attr('data-category');
    currentCategory = category;

    // Update button states
    $('.category-filter button').removeClass('active').removeClass('btn-primary').addClass('btn-outline');
    $(this).addClass('active').addClass('btn-primary').removeClass('btn-outline');

    // Filter images
    if (category === 'all') {
        filteredImages = [...galleryData];
    } else {
        filteredImages = galleryData.filter(img => img.category === category);
    }

    // Re-render gallery
    renderGallery(filteredImages);
});

// Lightbox modal
const lightbox = Domma.elements.modal('#lightbox', {
    backdrop: true,
    backdropClose: true,
    keyboard: true,
    animation: true,
    onOpen: () => {
        // Increment view count
        viewCount++;
        S.set('gallery-views', viewCount);
        $('#views-count').text(viewCount);
    }
});

function openLightbox(index) {
    currentImageIndex = index;
    const image = filteredImages[index];

    $('#lightbox-title').text(image.title);
    $('#lightbox-description').text(image.description);
    $('#lightbox-image').attr('src', image.image).attr('alt', image.title);

    // Update navigation button states
    $('#prev-image').prop('disabled', index === 0);
    $('#next-image').prop('disabled', index === filteredImages.length - 1);

    lightbox.open();
}

// Lightbox navigation
$('#prev-image').on('click', () => {
    if (currentImageIndex > 0) {
        openLightbox(currentImageIndex - 1);
    }
});

$('#next-image').on('click', () => {
    if (currentImageIndex < filteredImages.length - 1) {
        openLightbox(currentImageIndex + 1);
    }
});

// Keyboard navigation in lightbox
$(document).on('keydown', (e) => {
    if (lightbox.isOpen()) {
        if (e.key === 'ArrowLeft' && currentImageIndex > 0) {
            openLightbox(currentImageIndex - 1);
        } else if (e.key === 'ArrowRight' && currentImageIndex < filteredImages.length - 1) {
            openLightbox(currentImageIndex + 1);
        }
    }
});

// Scan icons on load
Domma.icons.scan();

console.log('Image Gallery initialized with', galleryData.length, 'images');

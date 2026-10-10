/**
 * Real-World Example: Image Gallery Loader - from public/showcase/elements/loader.
 */
export function mount(root) {
        // Example 8: Gallery Loader
    const galleryLoader = E.loader(root.querySelector('#gallery-container'), {
            type: 'pulse',
            size: 'large',
            color: 'primary',
            overlay: true,
            text: 'Loading gallery...'
        });
    $(root).find('#gallery-load-btn').on('click', async () => {
            $(root).find('#gallery-container').html('');
            galleryLoader.show();

            galleryLoader.setText('Fetching images...');
            await new Promise(resolve => setTimeout(resolve, 1000));

            galleryLoader.setText('Loading 6 images...');
            await new Promise(resolve => setTimeout(resolve, 1500));

            galleryLoader.hide();

            // Display placeholder images
            const placeholderImages = [
              'https://via.placeholder.com/200x150/2563eb/ffffff?text=Image+1',
              'https://via.placeholder.com/200x150/16a34a/ffffff?text=Image+2',
              'https://via.placeholder.com/200x150/dc2626/ffffff?text=Image+3',
              'https://via.placeholder.com/200x150/f59e0b/1e293b?text=Image+4',
              'https://via.placeholder.com/200x150/0ea5e9/ffffff?text=Image+5',
              'https://via.placeholder.com/200x150/475569/ffffff?text=Image+6'
            ];

            $(root).find('#gallery-container').html(placeholderImages.map(url =>
                `<img src="${url}" class="w-full h-auto rounded border" alt="Gallery image">`
            ).join(''));
        });
}

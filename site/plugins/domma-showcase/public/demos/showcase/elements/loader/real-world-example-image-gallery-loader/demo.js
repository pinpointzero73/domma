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
              '/plugins/domma-showcase/public/assets/placeholders/200x150-2563eb-ffffff-image-1.svg',
              '/plugins/domma-showcase/public/assets/placeholders/200x150-16a34a-ffffff-image-2.svg',
              '/plugins/domma-showcase/public/assets/placeholders/200x150-dc2626-ffffff-image-3.svg',
              '/plugins/domma-showcase/public/assets/placeholders/200x150-f59e0b-1e293b-image-4.svg',
              '/plugins/domma-showcase/public/assets/placeholders/200x150-0ea5e9-ffffff-image-5.svg',
              '/plugins/domma-showcase/public/assets/placeholders/200x150-475569-ffffff-image-6.svg'
            ];

            $(root).find('#gallery-container').html(placeholderImages.map(url =>
                `<img src="${url}" class="w-full h-auto rounded border" alt="Gallery image">`
            ).join(''));
        });
}

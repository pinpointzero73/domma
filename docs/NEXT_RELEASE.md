# Consistent carousel image heights

Image carousels now use one viewport for every slide and crop images from the top. The default uses the shortest image after scaling to the carousel width; `heightMode: 'average'` uses the midpoint of the shortest and tallest scaled images, and `height` sets a fixed pixel height.

Sizing updates when images load and the container resizes, works with slide, fade and crossfade, and leaves text-only carousels in flow. Carousel teardown removes resize observers and image listeners.

<!-- website -->
<p>Carousel images fill one consistent viewport from the top. Choose the shortest scaled image, the midpoint of the shortest and tallest, or a fixed height.</p>


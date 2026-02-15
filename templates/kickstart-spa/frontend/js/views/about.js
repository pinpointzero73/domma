/**
 * About View
 * Information about the application
 */
export const aboutView = {
    templateUrl: 'js/views/templates/about.html',

    onMount($container) {
        // Scan for icons
        Domma.icons.scan($container[0]);
        console.log('About view mounted');
    }
};

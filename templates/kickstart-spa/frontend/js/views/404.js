/**
 * 404 Not Found View
 */
export const notFoundView = {
    templateUrl: 'js/views/templates/404.html',

    onMount($container) {
        // Scan for icons
        Domma.icons.scan($container[0]);
        console.log('404 view mounted');
    }
};

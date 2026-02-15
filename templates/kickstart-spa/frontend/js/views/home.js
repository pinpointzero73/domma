/**
 * Home View
 * Welcome page showcasing Domma features
 */
export const homeView = {
    templateUrl: 'js/views/templates/home.html',

    onMount($container) {
        // Scan for icons in the newly mounted view
        Domma.icons.scan($container[0]);
        console.log('Home view mounted');
    }
};

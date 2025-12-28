/**
 * Domma Kickstart - JavaScript Initialisation
 *
 * This file demonstrates Domma's core features and best practices.
 * It's designed to be educational and easy to customise.
 *
 * Sections:
 * 1. Navbar Initialisation
 * 2. Basic Setup & Config Examples
 * 3. Grid Layout Logic
 * 4. Example Interactions
 *
 * Domma Namespaces Available:
 * - Domma or $ : DOM manipulation (jQuery-compatible)
 * - _          : Utility functions (Lodash-compatible)
 * - M          : Reactive models and pub/sub
 * - D          : Date manipulation (Moment-style)
 * - S          : LocalStorage wrapper
 *
 * Documentation: https://domma.dev
 */

(function () {
    'use strict';

    // ==============================================
    // 1. NAVBAR INITIALIZATION
    // ==============================================
    // Creates a functional, responsive navigation bar with dropdown support
    //
    // Features:
    // - Mobile hamburger menu (auto-collapses at 768px)
    // - Dropdown navigation support
    // - Active state tracking
    // - Smooth animations
    //
    // Customise:
    // - Change brand text/logo
    // - Add/remove menu items
    // - Adjust breakpoint (collapseAt)
    // - Change variant: 'light', 'dark', or 'transparent'
    //
    // Docs: Check showcase/elements/navbar for more options
    // ==============================================

    Domma.elements.navbar('#main-nav', {
        brand: {
            text: 'Domma Kickstart',
            logo: 'assets/logo/domma-icon.svg',
            url: './'
        },
        items: [
            {text: 'Home', url: '/kickstart/', active: true},
            {text: 'Documentation', url: 'https://domma.dcbw-it.co.uk/showcase/index.html'},
            {text: 'Examples', url: 'https://domma.dcbw-it.co.uk/examples/index.html'},
            {
                text: 'More',
                items: [  // Dropdown example
                    {text: 'GitHub', url: 'https://github.com/'},
                    {text: 'NPM', url: 'https://npmjs.com/'},
                  {text: 'Download', url: 'https://domma.dcbw-it.co.uk/download/index.html'}
                ]
            }
        ],
        variant: 'dark',     // Try 'light' or 'transparent'
        collapsible: true,   // Enable mobile menu
        collapseAt: 768      // Breakpoint in pixels
    });

    console.log('[Kickstart] Navbar initialized');


    // ==============================================
    // 2. BASIC SETUP & CONFIG EXAMPLES
    // ==============================================
    // Demonstrates Domma's core APIs and common patterns
    //
    // This section shows how to:
    // - Manipulate the DOM ($ namespace)
    // - Use utility functions (_ namespace)
    // - Store data locally (S namespace)
    // - Work with dates (D namespace)
    //
    // These are working examples - check your browser console
    // to see the results!
    // ==============================================

    console.log('\n[Kickstart] Running setup examples...\n');

    // ------------------------------------------
    // Example 1: DOM Manipulation (jQuery-compatible)
    // ------------------------------------------
    // The $ namespace provides jQuery-like DOM manipulation
    // Supports method chaining, event handling, animations, etc.

    // Add click handlers to buttons
    $('.btn-primary').on('click', function () {
        console.log('Button clicked!', this);

        // You can chain methods just like jQuery
        $(this)
            .addClass('active')
            .fadeOut(200)
            .fadeIn(200);
    });

    // Example of finding and manipulating elements
    const $stepCards = $('.step-card');
    console.log('DOM: Found', $stepCards.length, 'step cards');


    // ------------------------------------------
    // Example 2: Utility Functions (Lodash-compatible)
    // ------------------------------------------
    // The _ namespace provides 120+ utility functions
    // Great for data manipulation, functional programming

    // Array manipulation
    const numbers = [1, 2, 3, 4, 5];
    const doubled = _.map(numbers, n => n * 2);
    console.log('Utils: Doubled numbers:', doubled);  // [2, 4, 6, 8, 10]

    // Object manipulation
    const user = {name: 'Alice', age: 30, role: 'developer'};
    const picked = _.pick(user, ['name', 'role']);
    console.log('Utils: Picked properties:', picked);  // { name: 'Alice', role: 'developer' }

    // Collection operations
    const users = [
        {name: 'Rita', age: 19},
        {name: 'Sue', age: 20},
        {name: 'Bob', age: 38}
    ];
    const sorted = _.sortBy(users, 'age');
    console.log('Utils: Sorted by age:', sorted);


    // ------------------------------------------
    // Example 3: Storage API
    // ------------------------------------------
    // The S namespace provides a clean localStorage wrapper
    // Automatically serializes/deserializes JSON

    // Store complex objects
    S.set('user-preferences', {
        notifications: true,
        language: 'en'
    });

    // Retrieve with defaults
    const prefs = S.get('user-preferences');
    console.log('Storage: User preferences:', prefs);

    // Check if key exists
    if (S.has('user-preferences')) {
        console.log('Storage: Preferences are saved');
    }

    // Get all stored keys
    const keys = S.keys();
    console.log('Storage: All Domma keys:', keys);


    // ------------------------------------------
    // Example 4: Date Manipulation
    // ------------------------------------------
    // The D namespace provides Moment-style date handling
    // Parse, format, manipulate dates easily

    const now = D();
    console.log('Dates: Current time:', now.format('MMMM D, YYYY [at] h:mm A'));
    console.log('Dates: ISO format:', now.toISOString());

    // Date arithmetic
    const nextWeek = D().add(7, 'days');
    console.log('Dates: One week from now:', nextWeek.format('MMM D, YYYY'));

    // Relative time
    const yesterday = D().subtract(1, 'day');
    console.log('Dates: Yesterday was:', yesterday.fromNow());

    // Date comparison
    const isFuture = nextWeek.isAfter(now);
    console.log('Dates: Next week is in the future:', isFuture);


    console.log('\n[Kickstart] Setup examples complete!\n');


    // ==============================================
    // 3. GRID LAYOUT LOGIC
    // ==============================================
    // Demonstrates dynamic content generation and icon system
    //
    // This section shows how to:
    // - Select and manipulate multiple elements
    // - Work with data attributes
    // - Use Domma's icon system
    // - Initialise components on page load
    //
    // Icons are rendered from data-icon attributes
    // using Domma's built-in SVG icon library
    // ==============================================

    /**
     * Initialise step cards with icons
     * This function demonstrates:
     * - jQuery-style iteration with .each()
     * - Setting multiple attributes at once
     * - Using Domma's icon system
     */
    function initializeStepCards() {
        // Icons for each step
        const steps = [
            {number: 1, icon: 'document', description: 'Setup'},
            {number: 2, icon: 'edit', description: 'Development'},
            {number: 3, icon: 'zap', description: 'Deployment'}
        ];

        // Iterate through each step card
        $('.step-card').each(function (index) {
            const step = steps[index];

            if (step) {
                // Add icon using Domma's icon system
                // Icons are specified via data-icon attribute
                $(this).find('.step-icon').attr({
                    'data-icon': step.icon,
                    'data-icon-size': '48'
                });

                // Log for debugging
                console.log(`Grid: Initialized step ${step.number} (${step.description})`);
            }
        });

        // Scan for all icons in the document and render them
        // This converts data-icon attributes to actual SVG elements
        Domma.icons.scan();

        console.log('[Kickstart] Icons scanned and rendered');
    }


    // ==============================================
    // 4. EXAMPLE INTERACTIONS
    // ==============================================
    // Simple interactive examples users can customise
    //
    // These demonstrate common UI patterns:
    // - Smooth scrolling
    // - Theme switching
    // - Event handling
    // - DOM manipulation
    // ==============================================

    /**
     * Smooth scroll to content when CTA button is clicked
     * This provides a better user experience than jumping
     */
    function initializeSmoothScroll() {
        $('.jumbotron .btn').on('click', function (e) {
            e.preventDefault();

            // Scroll to main content smoothly
            $('main').get(0).scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            console.log('[Kickstart] Scrolled to main content');
        });
    }

    /**
     * Theme selection functionality
     * Shows how to work with Domma's ThemeEngine API
     *
     * NOTE: With Domma v0.5.0a+, themes are now unified (e.g., 'ocean-dark', 'forest-light')
     * The ThemeEngine handles storage and CSS class management automatically
     */
    function setTheme(themeName) {
        if (typeof Domma !== 'undefined' && Domma.theme) {
            Domma.theme.set(themeName);
            console.log('[Kickstart] Theme changed to:', themeName);
        } else {
            console.warn('[Kickstart] ThemeEngine not available');
        }
    }

    /**
     * Create a floating theme dropdown
     * Uncomment this code to add a theme selector to your page
     */
    function createThemeSelector() {
        const dropdown = $('<select>')
          .addClass('form-select')
            .css({
                position: 'fixed',
                top: '1rem',
                right: '1rem',
                zIndex: 1000,
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                maxWidth: '200px'
            })
          .html(`
                <optgroup label="Charcoal">
                    <option value="charcoal-light">Charcoal Light</option>
                    <option value="charcoal-dark" selected>Charcoal Dark</option>
                </optgroup>
                <optgroup label="Ocean">
                    <option value="ocean-light">Ocean Light</option>
                    <option value="ocean-dark">Ocean Dark</option>
                </optgroup>
                <optgroup label="Forest">
                    <option value="forest-light">Forest Light</option>
                    <option value="forest-dark">Forest Dark</option>
                </optgroup>
            `)
          .on('change', function () {
              setTheme($(this).val());
          })
            .appendTo('body');

        console.log('[Kickstart] Theme selector added');
    }

    /**
     * Load saved theme preference
     * The ThemeEngine automatically loads saved themes, but you can
     * initialise it manually if needed
     */
    function loadThemePreference() {
        if (typeof Domma !== 'undefined' && Domma.theme) {
            // ThemeEngine auto-loads from localStorage during init
            // This is just for demonstration - usually not needed
            const currentTheme = Domma.theme.get();
            console.log('[Kickstart] Current theme:', currentTheme);
        }
    }


    // ==============================================
    // INITIALIZATION
    // ==============================================
    // Initialize all components when DOM is ready
    //
    // This pattern ensures all HTML elements exist
    // before JavaScript tries to interact with them
    // ==============================================

    document.addEventListener('DOMContentLoaded', function () {
        console.log('[Kickstart] DOM ready, initializing...');

        // Initialise step cards with icons
        initializeStepCards();

        // Set up smooth scrolling
        initializeSmoothScroll();

        // Load saved theme preference
        loadThemePreference();

        // Optional: Uncomment to add theme selector dropdown
        // createThemeSelector();

        console.log('[Kickstart] Initialization complete!');
        console.log('\n═══════════════════════════════════════');
        console.log('   Domma Kickstart is ready to use!');
        console.log('   Check the console for example output');
        console.log('═══════════════════════════════════════\n');
    });


    // ==============================================
    // NEXT STEPS
    // ==============================================
    // Now that you have a working template, here are some ideas:
    //
    // 1. Add more pages
    //    - Create about.html, contact.html, etc.
    //    - Link them in the navbar
    //
    // 2. Experiment with components
    //    - Add modals for login/signup
    //    - Use tabs for content organisation
    //    - Add a carousel for images
    //
    // 3. Build features
    //    - Create a contact form with validation
    //    - Add a search functionality
    //    - Implement a data table
    //
    // 4. Customise styling
    //    - Try different theme variants (ocean, forest, sunset)
    //    - Modify colours in CSS variables
    //    - Add your own components
    //
    // 5. Learn more
    //    - Check ../showcase/index.html for all components
    //    - See ../examples/index.html for complete apps
    //    - Read CLAUDE.md in the repo root for full API docs
    //
    // ==============================================

})();

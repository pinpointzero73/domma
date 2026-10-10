/**
 * Step 6: Complete Working Demo - from public/showcase/elements/breadcrumbs.
 */
export function mount(root) {
        // Tutorial Demo
    const tutorialSubcategories = {
            electronics: ['Phones', 'Laptops', 'Tablets'],
            clothing: ['Shirts', 'Trousers', 'Shoes'],
            books: ['Fiction', 'Non-Fiction', 'Comics']
        };
    const tutorialBreadcrumbs = E.breadcrumbs(root.querySelector('#tutorial-breadcrumbs'), {
            items: [{text: 'Home', url: '#'}],
            separator: 'chevron',
            homeIcon: true,
            onChange: (item, index) => {
                const items = tutorialBreadcrumbs.getItems();
                const newItems = items.slice(0, index + 1);
                newItems[newItems.length - 1].active = true;
                tutorialBreadcrumbs.setItems(newItems);
                $(root).find('#tutorial-subcategories').hide();
            }
        });
    $('[data-tutorial-category]').on('click', function () {
            const category = $(this).data('tutorial-category');
            const categoryName = $(this).text();

            tutorialBreadcrumbs.addItem({text: categoryName, active: true});

            const subs = tutorialSubcategories[category];
            const html = subs.map(sub =>
                `<button class="btn btn-sm btn-secondary" data-tutorial-sub="${sub}">${sub}</button>`
            ).join('');

            $(root).find('#tutorial-subcategory-list').html(html);
            $(root).find('#tutorial-subcategories').show();

            $('[data-tutorial-sub]').on('click', function () {
                tutorialBreadcrumbs.addItem({text: $(this).text(), active: true});
            });
        });
}

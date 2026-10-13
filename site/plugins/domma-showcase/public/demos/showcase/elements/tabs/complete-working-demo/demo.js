/**
 * Step 6: Complete Working Demo - from public/showcase/elements/tabs.
 */
export function mount(root) {
        // Tutorial
    const tutorialTabs = E.tabs(root.querySelector('#tutorial-tabs'), {
            activeIndex: 0,
            animation: true,
            onChange: ({index}) => {
                const tabs = ['Overview', 'Features', 'Reviews'];
                $(root).find('#tutorial-result').text(`Now viewing: ${tabs[index]}`);
            }
        });
    $(root).find('#tutorial-prev').on('click', () => tutorialTabs.prev());
    $(root).find('#tutorial-next').on('click', () => tutorialTabs.next());
}

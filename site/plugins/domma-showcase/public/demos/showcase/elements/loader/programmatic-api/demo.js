/**
 * Programmatic API - from public/showcase/elements/loader.
 */
export function mount(root) {
        // Web Components Section JavaScript
    const loaderTypes = ['spinner', 'dots', 'pulse', 'bars'];
    let currentTypeIndex = 0;
    function showProgrammableLoader() {
            const loader = $(root).find('#programmable-loader')[0];
            loader.show();
        };
    function hideProgrammableLoader() {
            const loader = $(root).find('#programmable-loader')[0];
            loader.hide();
        };
    function toggleProgrammableLoader() {
            const loader = $(root).find('#programmable-loader')[0];
            loader.toggle();
        };
    function changeLoaderType() {
            const loader = $(root).find('#programmable-loader')[0];
            currentTypeIndex = (currentTypeIndex + 1) % loaderTypes.length;
            const newType = loaderTypes[currentTypeIndex];
            loader.setType(newType);
            loader.setText(`Type: ${newType}`);
            loader.show();
        };

    // Handlers the old page had inline (onclick=…), wired here.
    $(root).find('[data-action="1"]').on('click', function (event) {
        showProgrammableLoader();
    });
    $(root).find('[data-action="2"]').on('click', function (event) {
        hideProgrammableLoader();
    });
    $(root).find('[data-action="3"]').on('click', function (event) {
        toggleProgrammableLoader();
    });
    $(root).find('[data-action="4"]').on('click', function (event) {
        changeLoaderType();
    });
}

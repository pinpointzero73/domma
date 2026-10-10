/**
 * Basic Print Example - from public/showcase/print-to-pdf.
 */
export function mount(root) {
        // Setup print buttons using Config Engine
    $.setup({
            '#print-default': {
                events: {
                    click: () => {
                        const printer = E.printToPDF(root.querySelector('#print-content'), {
                            pageSize: 'A4',
                            orientation: 'portrait',
                            margins: 'normal',
                            title: 'Sample Document - A4',
                            onBeforePrint: () => console.log('Printing...'),
                            onAfterPrint: () => console.log('Print completed or cancelled')
                        });
                        printer.print();
                    }
                }
            },
            '#print-letter': {
                events: {
                    click: () => {
                        const printer = E.printToPDF(root.querySelector('#print-content'), {
                            pageSize: 'Letter',
                            orientation: 'portrait',
                            margins: 'normal',
                            title: 'Sample Document - Letter'
                        });
                        printer.print();
                    }
                }
            },
            '#print-landscape': {
                events: {
                    click: () => {
                        const printer = E.printToPDF(root.querySelector('#print-content'), {
                            pageSize: 'A4',
                            orientation: 'landscape',
                            margins: 'wide',
                            title: 'Sample Document - Landscape'
                        });
                        printer.print();
                    }
                }
            },
            '#print-no-bg': {
                events: {
                    click: () => {
                        const printer = E.printToPDF(root.querySelector('#print-content'), {
                            pageSize: 'A4',
                            orientation: 'portrait',
                            margins: 'normal',
                            removeBackgrounds: true,
                            title: 'Sample Document - No Backgrounds'
                        });
                        printer.print();
                    }
                }
            }
        });
}

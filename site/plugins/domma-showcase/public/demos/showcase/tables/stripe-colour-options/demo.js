/**
 * Stripe Colour Options - from public/showcase/tables.
 */
export function mount(root) {
    const sampleData = [
            {
                id: 1,
                name: 'Alice Johnson',
                email: 'alice@example.com',
                role: 'Admin',
                status: 'Active',
                joined: '2024-01-15'
            },
            {id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Developer', status: 'Active', joined: '2024-02-20'},
            {
                id: 3,
                name: 'Carol White',
                email: 'carol@example.com',
                role: 'Designer',
                status: 'Active',
                joined: '2024-03-10'
            },
            {
                id: 4,
                name: 'David Brown',
                email: 'david@example.com',
                role: 'Manager',
                status: 'Inactive',
                joined: '2024-01-05'
            },
            {
                id: 5,
                name: 'Eva Martinez',
                email: 'eva@example.com',
                role: 'Developer',
                status: 'Active',
                joined: '2024-04-01'
            },
            {
                id: 6,
                name: 'Frank Wilson',
                email: 'frank@example.com',
                role: 'Admin',
                status: 'Active',
                joined: '2024-02-14'
            },
            {
                id: 7,
                name: 'Grace Lee',
                email: 'grace@example.com',
                role: 'Designer',
                status: 'Active',
                joined: '2024-05-22'
            },
            {
                id: 8,
                name: 'Henry Davis',
                email: 'henry@example.com',
                role: 'Developer',
                status: 'Inactive',
                joined: '2024-03-30'
            },
            {id: 9, name: 'Ivy Chen', email: 'ivy@example.com', role: 'Manager', status: 'Active', joined: '2024-06-15'},
            {
                id: 10,
                name: 'Jack Taylor',
                email: 'jack@example.com',
                role: 'Developer',
                status: 'Active',
                joined: '2024-04-18'
            },
            {
                id: 11,
                name: 'Kate Anderson',
                email: 'kate@example.com',
                role: 'Designer',
                status: 'Active',
                joined: '2024-07-01'
            },
            {id: 12, name: 'Leo Thomas', email: 'leo@example.com', role: 'Admin', status: 'Inactive', joined: '2024-01-28'},
            {
                id: 13,
                name: 'Mia Jackson',
                email: 'mia@example.com',
                role: 'Developer',
                status: 'Active',
                joined: '2024-08-10'
            },
            {
                id: 14,
                name: 'Noah Garcia',
                email: 'noah@example.com',
                role: 'Manager',
                status: 'Active',
                joined: '2024-05-05'
            },
            {
                id: 15,
                name: 'Olivia Moore',
                email: 'olivia@example.com',
                role: 'Designer',
                status: 'Active',
                joined: '2024-09-20'
            }
        ];
        // ============================================
        // Stripe Styling Demo
        // ============================================
        // Sample data for stripe demo
    const stripeData = sampleData.slice(0, 6);
        // Create initial stripe demo table
    let stripeTable = Domma.tables.create('#stripe-demo-table', {
            data: stripeData,
            columns: [
                {key: 'name', title: 'Name'},
                {key: 'email', title: 'Email'},
                {key: 'role', title: 'Role'}
            ],
            pagination: false,
            striped: true
        });
        // Helper to recreate table with new stripe config
    function updateStripeDemo(config) {
            const buttons = ['stripe-default', 'stripe-light', 'stripe-medium', 'stripe-primary', 'stripe-success', 'stripe-custom'];
            buttons.forEach(id => {
                $('#' + id).removeClass('btn-primary').addClass('btn-outline');
            });
            $('#' + config.activeButton).removeClass('btn-outline').addClass('btn-primary');

            stripeTable = Domma.tables.create('#stripe-demo-table', {
                data: stripeData,
                columns: [
                    {key: 'name', title: 'Name'},
                    {key: 'email', title: 'Email'},
                    {key: 'role', title: 'Role'}
                ],
                pagination: false,
                striped: true,
                evenRowColor: config.evenRowColor,
                oddRowColor: config.oddRowColor,
                hoverColor: config.hoverColor
            });
        }
        // Stripe style buttons
    $(root).find('#stripe-default').on('click', () => {
            updateStripeDemo({
                activeButton: 'stripe-default',
                evenRowColor: null,
                oddRowColor: null,
                hoverColor: null
            });
        });
    $(root).find('#stripe-light').on('click', () => {
            updateStripeDemo({
                activeButton: 'stripe-light',
                evenRowColor: 'lighter',
                oddRowColor: 'light',
                hoverColor: 'medium'
            });
        });
    $(root).find('#stripe-medium').on('click', () => {
            updateStripeDemo({
                activeButton: 'stripe-medium',
                evenRowColor: 'light',
                oddRowColor: 'medium',
                hoverColor: 'dark'
            });
        });
    $(root).find('#stripe-primary').on('click', () => {
            updateStripeDemo({
                activeButton: 'stripe-primary',
                evenRowColor: 'none',
                oddRowColor: 'primary-tint',
                hoverColor: 'light'
            });
        });
    $(root).find('#stripe-success').on('click', () => {
            updateStripeDemo({
                activeButton: 'stripe-success',
                evenRowColor: 'none',
                oddRowColor: 'success-tint',
                hoverColor: 'light'
            });
        });
    $(root).find('#stripe-custom').on('click', () => {
            updateStripeDemo({
                activeButton: 'stripe-custom',
                evenRowColor: '#ffffff',
                oddRowColor: '#e8f4f8',
                hoverColor: '#d4e9f2'
            });
        });
}

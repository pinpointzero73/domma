/**
 * 9. Tables - from public/showcase/themes.
 */
export function mount(root) {
    if (window.T && T.create) {
      const data = [
        { id: 'INV-0001', customer: 'Acme Ltd',     status: 'Paid',    total: 4250.00 },
        { id: 'INV-0002', customer: 'Globex',       status: 'Pending', total: 1180.00 },
        { id: 'INV-0003', customer: 'Initech',      status: 'Overdue', total:  760.00 },
        { id: 'INV-0004', customer: 'Soylent Corp', status: 'Paid',    total: 12500.00 },
        { id: 'INV-0005', customer: 'Stark Inds.',  status: 'Paid',    total: 8700.50 },
        { id: 'INV-0006', customer: 'Wayne Ent.',   status: 'Pending', total: 3200.00 },
        { id: 'INV-0007', customer: 'Oscorp',       status: 'Overdue', total: 1900.00 },
        { id: 'INV-0008', customer: 'Tyrell Corp',  status: 'Paid',    total: 5450.75 }
      ];
      T.create('#audit-table-host', {
        data,
        columns: [
          { key: 'id', label: 'Invoice' },
          { key: 'customer', label: 'Customer' },
          { key: 'status', label: 'Status' },
          { key: 'total', label: 'Total', format: v => '£' + v.toLocaleString('en-GB', { minimumFractionDigits: 2 }) }
        ],
        pagination: true,
        pageSize: 5,
        striped: true
      });
    }
}

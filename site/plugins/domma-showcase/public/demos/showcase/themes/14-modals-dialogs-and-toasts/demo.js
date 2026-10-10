/**
 * 14. Modals, Dialogs & Toasts - from public/showcase/themes.
 */
export function mount(root) {
      // Modal trigger
    function buildPopupModal() {
        const m = document.createElement('div');
        m.id = 'audit-popup-modal';
        m.className = 'modal';

        const header = document.createElement('div');
        header.className = 'modal-header';
        const title = document.createElement('h5');
        title.className = 'modal-title';
        title.textContent = 'Modal popup';
        const closeX = document.createElement('button');
        closeX.className = 'modal-close';
        closeX.setAttribute('aria-label', 'Close');
        closeX.textContent = '×';
        header.appendChild(title);
        header.appendChild(closeX);

        const body = document.createElement('div');
        body.className = 'modal-body';
        const p = document.createElement('p');
        p.textContent = 'This is a popup modal. Inspect the header, body, footer and close-button contrast.';
        body.appendChild(p);

        const footer = document.createElement('div');
        footer.className = 'modal-footer';
        const btnCancel = document.createElement('button');
        btnCancel.className = 'btn btn-secondary modal-close';
        btnCancel.textContent = 'Cancel';
        const btnConfirm = document.createElement('button');
        btnConfirm.className = 'btn btn-primary modal-close';
        btnConfirm.textContent = 'Confirm';
        footer.appendChild(btnCancel);
        footer.appendChild(btnConfirm);

        m.appendChild(header);
        m.appendChild(body);
        m.appendChild(footer);
        document.body.appendChild(m);
        return m;
      }
    $(root).find('#audit-open-modal').on('click', () => {
        if (!$(root).find('#audit-popup-modal').length) buildPopupModal();
        E.modal(root.querySelector('#audit-popup-modal')).open();
      });
    $(root).find('#audit-open-alert').on('click', () => {
        E.alert('Alert dialog content', { title: 'Notice' });
      });
    $(root).find('#audit-open-confirm').on('click', () => {
        E.confirm('Are you sure you want to proceed with this action?', { title: 'Confirm action' });
      });
    $(root).find('#audit-open-prompt').on('click', () => {
        E.prompt('Enter your name:', { title: 'Identify yourself', inputValue: 'Darryl' });
      });
    $(root).find('#audit-toast-success').on('click', () => {
        E.toast('Operation completed successfully', { type: 'success' });
      });
    $(root).find('#audit-toast-error').on('click', () => {
        E.toast('Something went wrong - please try again', { type: 'error' });
      });
}

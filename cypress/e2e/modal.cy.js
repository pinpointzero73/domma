// cypress/e2e/modal.cy.js

describe('Elements - Modal E2E Tests', () => {
  beforeEach(() => {
    // Visit the dedicated test page for modals
    cy.visit('/test-modal.html');
  });

  it('createModal() should open and be visible in the DOM', () => {
    cy.window().then((win) => {
      const {Domma} = win;

      const modal = Domma.elements.createModal({
        title: 'My Programmatic Modal',
        content: '<p>This was created by Cypress!</p>',
        buttons: [{id: 'close-btn', text: 'Close'}],
      });

      modal.open();
    });

    // Assertions
    cy.get('.dm-dialog').should('be.visible');
    cy.contains('.dm-dialog-title', 'My Programmatic Modal').should('be.visible');
    cy.contains('.dm-dialog-body', 'This was created by Cypress!').should('be.visible');
    cy.get('[data-button-id="close-btn"]').should('be.visible').and('contain', 'Close');
  });

  it('showModal() should open and resolve the promise on button click', () => {
    cy.window().then((win) => {
      const {Domma} = win;
      // We can use cy.spy to watch for the promise resolution if needed,
      // but for now, we'll just test the interaction.
      win.Domma.elements.showModal({
        title: 'Promise Modal',
        content: 'Click OK to resolve.',
        buttons: [{id: 'ok', text: 'OK'}]
      });
    });

    cy.get('.dm-dialog').should('be.visible');
    cy.get('[data-button-id="ok"]').click();

    // After clicking, the modal should disappear
    cy.get('.dm-dialog').should('not.exist');
  });

  it('should close when the backdrop is clicked', () => {
    cy.window().then((win) => {
      win.Domma.elements.createModal({title: 'Backdrop Test'}).open();
    });

    cy.get('.dm-dialog').should('be.visible');

    // Click on the overlay (backdrop) itself
    // force:true is needed because the overlay might have pointer-events: none,
    // but its children do. We are certain we want to click the overlay.
    cy.get('.dm-dialog-overlay').click({force: true});

    cy.get('.dm-dialog').should('not.exist');
  });
});

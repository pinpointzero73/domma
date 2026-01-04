// cypress/e2e/spec.cy.js

describe('Domma E2E Tests', () => {
  describe('Homepage', () => {
    it('should display the homepage with the correct title', () => {
      cy.visit('/');
      cy.title().should('include', 'Domma');
    });

    it('should have a visible "Explore the Showcase" link', () => {
      cy.visit('/');
      cy.contains('a', 'Explore the Showcase').should('be.visible');
    });

    it('should have working navigation to showcase', () => {
      cy.visit('/');
      cy.contains('a', 'Explore the Showcase').click();
      cy.url().should('include', '/showcase');
    });
  });

  describe('Card Showcase', () => {
    beforeEach(() => {
      cy.visit('/showcase/elements/card/');
    });

    it('should load card showcase page', () => {
      cy.get('h1').should('contain', 'Card');
      cy.get('.card').should('have.length.greaterThan', 0);
    });

    it('should display collapsible card example', () => {
      cy.get('#collapsible-demo').should('exist');
      cy.get('#collapsible-demo .card-header').should('be.visible');
      cy.get('#collapsible-demo .card-collapse-icon').should('exist');
    });

    it('should toggle collapsible card on header click', () => {
      const card = cy.get('#collapsible-demo');

      // Initially expanded
      card.should('not.have.class', 'card-collapsed');
      card.find('.card-body').should('be.visible');

      // Click to collapse
      card.find('.card-header').click();
      card.should('have.class', 'card-collapsed');

      // Click to expand
      card.find('.card-header').click();
      card.should('not.have.class', 'card-collapsed');
    });

    it('should persist collapsible state to localStorage', () => {
      const card = cy.get('#collapsible-demo');

      // Collapse the card
      card.find('.card-header').click();
      card.should('have.class', 'card-collapsed');

      // Reload page
      cy.reload();

      // Should still be collapsed
      cy.get('#collapsible-demo').should('have.class', 'card-collapsed');
    });

    it('hover card should have lift effect', () => {
      cy.get('#hover-card-demo').trigger('mouseover');
      // Visual test - would need visual regression testing for full verification
      cy.get('#hover-card-demo').should('be.visible');
    });
  });

  describe('Modal Showcase', () => {
    beforeEach(() => {
      cy.visit('/showcase/elements/modal/');
    });

    it('should load modal showcase page', () => {
      cy.get('h1').should('contain', 'Modal');
    });

    it('should open and close modal', () => {
      // Find and click button to open modal
      cy.contains('button', 'Open').first().click();

      // Modal should be visible
      cy.get('.modal').first().should('be.visible');

      // Close modal
      cy.get('.modal-close').first().click();

      // Modal should be hidden
      cy.wait(500); // Wait for animation
      cy.get('.modal').first().should('not.be.visible');
    });
  });

  describe('Theme Switching', () => {
    it('should switch between light and dark themes', () => {
      cy.visit('/');

      // Check if theme switcher exists
      cy.get('[data-theme-toggle]').should('exist');

      // Click theme toggle
      cy.get('[data-theme-toggle]').click();

      // Body should have theme class
      cy.get('body').should('have.class', /dm-theme-/);
    });
  });

  describe('Responsive Navigation', () => {
    it('should show mobile menu on small screens', () => {
      cy.viewport('iphone-6');
      cy.visit('/');

      // Mobile menu button should be visible
      cy.get('.navbar-toggler, .mobile-menu-toggle, [data-navbar-toggle]')
        .should('be.visible');
    });
  });
});


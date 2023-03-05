/**
 * This file is meant to hold all custom commands created to extend
 * cypress configuration.
 *
 * @see CustomCommands guide {@link https://docs.cypress.io/api/cypress-api/custom-commands} for further info.
 */

/**
 * Gets an element by it's data-testid attribute.
 */
Cypress.Commands.add("getByTestId", (selector) => {
  return cy.get(`[data-testid="${selector}"]`);
});

/**
 * Adds items to the cart programmatically.
 */
Cypress.Commands.add("addToCart", (mode) => {
  cy.getByTestId("product-card").as("productCard");

  const click = (index) => {
    cy.get("@productCard")
      .eq(index)
      .find('[data-testid="add-to-cart-button"]')
      .click({ force: true });
  };

  const addByIndex = () => {
    click(mode.index);
  };

  const addByIndexes = () => {
    for (const index of mode.indexes) {
      click(index);
    }
  };

  const addAll = () => {
    cy.get("@productCard").then(($elements) => {
      let el = 0;

      while (el < $elements.length) {
        click(el);
        el++;
      }
    });
  };

  if (typeof mode.index === "number") {
    addByIndex();
  } else if (!!mode.indexes && Array.isArray(mode.indexes)) {
    addByIndexes();
  } else if (!!mode.indexes && mode.indexes === "all") {
    addAll();
  } else {
    throw new Error(
      'Please provide a valid input for "addToCart()" command.\r\nPossible values are "Array", "number" or "all".'
    );
  }
});

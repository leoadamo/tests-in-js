context("The Lunch", () => {
  it("Should display the home page.", () => {
    cy.visit("http://localhost:3000");
    cy.get("body").contains("Brand");
    cy.get("body").contains("The lunch");
  });
});

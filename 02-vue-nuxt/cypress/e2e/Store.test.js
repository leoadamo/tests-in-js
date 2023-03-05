// DEPENDENCIES
import { makeServer } from "../../miragejs/server";

context("The Lunch", () => {
  let Server;

  beforeEach(() => {
    Server = makeServer({ environment: "test" });
  });

  afterEach(() => {
    Server.shutdown();
  });

  it("Should display the home page.", () => {
    cy.visit("http://localhost:3000");
    cy.get("body").contains("Brand");
    cy.get("body").contains("The lunch");
  });

  context("The Lunch > Searching for a product", () => {
    it("Should type in the search field.", () => {
      cy.visit("http://localhost:3000");
      cy.get("input[type='search']")
        .type("Some text here")
        .should("have.value", "Some text here");
    });

    it("Should type in the search field and should have some product returned.", () => {
      Server.createList("product", 10);
      Server.create("product", {
        title: "Hamburger Cia 09",
      });

      cy.visit("http://localhost:3000");
      cy.get("input[type='search']").type("Hamburger Cia 09");
      cy.get('[data-testid="search-form"]').submit();
      cy.get('[data-testid="product-card"]').should("have.length", 1);
    });

    it("Should type in the search field and shouldn't have any product returned.", () => {
      Server.createList("product", 10);

      cy.visit("http://localhost:3000");
      cy.get("input[type='search']").type("Hamburger Cia 09");
      cy.get('[data-testid="search-form"]').submit();
      cy.get('[data-testid="product-card"]').should("have.length", 0);
      cy.get("body").contains("0 items found");
    });
  });
});

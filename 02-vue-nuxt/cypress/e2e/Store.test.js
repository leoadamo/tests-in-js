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
    cy.visit("/");
    cy.get("body").contains("Brand");
    cy.get("body").contains("The lunch");
  });

  context("The Lunch > Searching for a food", () => {
    it("Should type in the search field.", () => {
      cy.visit("/");
      cy.get("input[type='search']")
        .type("Some text here")
        .should("have.value", "Some text here");
    });

    it("Should type in the search field and should have some product returned.", () => {
      Server.createList("product", 10);
      Server.create("product", {
        title: "Hamburger Cia 09",
      });

      cy.visit("/");
      cy.get("input[type='search']").type("Hamburger Cia 09");
      cy.get('[data-testid="search-form"]').submit();
      cy.get('[data-testid="product-card"]').should("have.length", 1);
    });

    it("Should type in the search field and shouldn't have any product returned.", () => {
      Server.createList("product", 10);

      cy.visit("/");
      cy.get("input[type='search']").type("Hamburger Cia 09");
      cy.get('[data-testid="search-form"]').submit();
      cy.get('[data-testid="product-card"]').should("have.length", 0);
      cy.get("body").contains("0 items found");
    });
  });

  context("The Lunch > Rendering the list of foods", () => {
    it('Should display "0 items found when no items is returned."', () => {
      cy.visit("/");
      cy.get('[data-testid="product-card"]').should("have.length", 0);
      cy.get("body").contains("0 items found");
    });

    it('Should display "1 item found" when 1 item is returned.', () => {
      Server.create("product");

      cy.visit("/");
      cy.get('[data-testid="product-card"]').should("have.length", 1);
      cy.get("body").contains("1 item found");
    });

    it('Should display "10 items found when 10 items are returned."', () => {
      Server.createList("product", 10);

      cy.visit("/");
      cy.get('[data-testid="product-card"]').should("have.length", 10);
      cy.get("body").contains("10 items found");
    });
  });
});

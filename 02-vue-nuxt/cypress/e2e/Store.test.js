// DEPENDENCIES
import { makeServer } from "../../miragejs/server";

context("The Lunch", () => {
  let Server;
  const g = cy.get;
  const gid = cy.getByTestId;
  const quantity = 8;

  beforeEach(() => {
    Server = makeServer({ environment: "test" });
  });

  afterEach(() => {
    Server.shutdown();
  });

  it("Should display the home page.", () => {
    cy.visit("/");
    g("body").contains("Brand");
    g("body").contains("The lunch");
  });

  context("The Lunch > Searching for a food", () => {
    it("Should type in the search field.", () => {
      cy.visit("/");
      g("input[type='search']")
        .type("Some text here")
        .should("have.value", "Some text here");
    });

    it("Should type in the search field and should have some product returned.", () => {
      Server.createList("product", quantity);
      Server.create("product", {
        title: "Hamburger Cia 09",
      });

      cy.visit("/");
      g("input[type='search']").type("Hamburger Cia 09");
      gid("search-form").submit();
      gid("product-card").should("have.length", 1);
    });

    it("Should type in the search field and shouldn't have any product returned.", () => {
      Server.createList("product", quantity);

      cy.visit("/");
      g("input[type='search']").type("Hamburger Cia 09");
      gid("search-form").submit();
      gid("product-card").should("have.length", 0);
      g("body").contains("0 items found");
    });
  });

  context("The Lunch > Rendering the list of foods", () => {
    it('Should display "0 items found" when no items is returned.', () => {
      cy.visit("/");
      gid("product-card").should("have.length", 0);
      g("body").contains("0 items found");
    });

    it('Should display "1 item found" when 1 item is returned.', () => {
      Server.create("product");

      cy.visit("/");
      gid("product-card").should("have.length", 1);
      g("body").contains("1 item found");
    });

    it(`Should display "${quantity} items found" when ${quantity} items are returned.`, () => {
      Server.createList("product", quantity);

      cy.visit("/");
      gid("product-card").should("have.length", quantity);
      g("body").contains(`${quantity} items found`);
    });
  });

  context("The Lunch > Shopping Cart", () => {
    beforeEach(() => {
      Server.createList("product", quantity);
      cy.visit("/");
    });

    it("Shouldn't display the shopping cart when page first loads.", () => {
      gid("shopping-cart").should("have.class", "hidden");
    });

    it("Should toggle shopping cart visibility when the button is clicked.", () => {
      gid("toggle-button").as("toggleButton");
      g("@toggleButton").click();
      gid("shopping-cart")
        .as("shoppingCart")
        .should("not.have.class", "hidden");
      g("@toggleButton").click({ force: true });
      g("@shoppingCart").should("have.class", "hidden");
    });

    it("Should open shopping cart when a product is added.", () => {
      gid("product-card")
        .first()
        .find('[data-testid="add-to-cart-button"]')
        .click();
      gid("shopping-cart").should("not.have.class", "hidden");
    });

    it("Shouldn't display the 'Clear cart' button when there are no products.", () => {
      gid("toggle-button").as("toggleButton");
      g("@toggleButton").click();
      gid("clear-cart-button").should("not.exist");
    });

    it("Should display a 'Cart is empty' message when there are no products.", () => {
      gid("toggle-button").as("toggleButton");
      g("@toggleButton").click();
      gid("shopping-cart").as("shoppingCart");
      g("@shoppingCart").should("contain.text", "Cart is empty");
    });

    it("Should add first product to the cart.", () => {
      gid("product-card")
        .first()
        .find('[data-testid="add-to-cart-button"]')
        .click();
      gid("cart-item").should("have.length", 1);
    });

    it("Should add 1 product to the cart.", () => {
      cy.addToCart({ index: 0 });

      gid("cart-item").should("have.length", 1);
    });

    it("Should add 3 products to the cart.", () => {
      cy.addToCart({ indexes: [1, 3, 5] });

      gid("cart-item").should("have.length", 3);
    });

    it("Should add all products to the cart.", () => {
      cy.addToCart({ indexes: "all" });

      gid("cart-item").should("have.length", quantity);
    });

    it("Should remove a product from the cart.", () => {
      cy.addToCart({ index: 0 });

      gid("cart-item").as("cartItems");
      g("@cartItems").should("have.length", 1);
      g("@cartItems").first().find("[data-testid='remove-button']").click();
      g("@cartItems").should("have.length", 0);
    });

    it("Should clear cart when 'Clear cart' button is clicked.", () => {
      cy.addToCart({ indexes: [0, 1, 2] });

      gid("cart-item").as("cartItems");
      g("@cartItems").should("have.length", 3);
      gid("clear-cart-button").click();
      g("@cartItems").should("have.length", 0);
    });

    it("should display quantity 1 when product is added to cart.", () => {
      cy.addToCart({ index: 1 });

      gid("quantity").contains(1);
    });

    it('should increase quantity when button "+" gets clicked.', () => {
      cy.addToCart({ index: 1 });

      gid("increase").as("increaseButton").click();
      gid("quantity").as("quantityWrapper").contains(2);
      g("@increaseButton").click();
      g("@quantityWrapper").contains(3);
    });

    it('should decrease quantity when button "-" gets clicked.', () => {
      cy.addToCart({ index: 1 });

      gid("increase").as("increaseButton").click();
      g("@increaseButton").click();
      gid("quantity").as("quantityWrapper").contains(3);
      gid("decrease").as("decreaseButton").click();
      g("@quantityWrapper").contains(2);
      g("@decreaseButton").click();
      g("@quantityWrapper").contains(1);
    });

    it('should not decrease below zero when button "-" gets clicked.', () => {
      cy.addToCart({ index: 1 });

      gid("decrease").as("decreaseButton").click();
      g("@decreaseButton").click();
      gid("quantity").contains(0);
    });
  });
});

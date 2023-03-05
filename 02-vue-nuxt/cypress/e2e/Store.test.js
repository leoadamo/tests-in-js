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
});

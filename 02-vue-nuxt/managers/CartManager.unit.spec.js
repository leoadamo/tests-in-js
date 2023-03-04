// UTILS
import { makeServer } from "@/miragejs/server";
import CartManager from "@/managers/CartManager";

describe("CartManager - Unit", () => {
  let cartManager;
  let server;

  beforeEach(() => {
    cartManager = new CartManager();
    server = makeServer({ environment: "test" });
  });

  afterEach(() => {
    server.shutdown();
  });

  it("Should return the state.", () => {
    const product = server.create("product");

    cartManager.addProducts([product]);
    cartManager.open();

    expect(cartManager.getState()).toEqual({
      items: [product],
      isOpen: true,
    });
  });

  it("Should set cart to open.", () => {
    const state = cartManager.open();

    expect(state.isOpen).toBe(true);
  });

  it("Should set cart to closed.", () => {
    const state = cartManager.close();

    expect(state.isOpen).toBe(false);
  });

  it("Should add a product to the cart only once.", () => {
    const product = server.create("product");

    const state = cartManager.addProducts([product, product]);

    expect(state.items).toHaveLength(1);
  });

  it("Should remove product from the cart.", () => {
    const product = server.create("product");

    const state = cartManager.removeProducts([product.id]);

    expect(state.items).toHaveLength(0);
  });

  it("Should clear products.", () => {
    const state = cartManager.clearProducts();

    expect(state.items).toHaveLength(0);
  });

  it("Should clear cart.", () => {
    const state = cartManager.clearCart();

    expect(state.items).toHaveLength(0);
    expect(state.isOpen).toBe(false);
  });

  it("Should return true if cart is not empty.", () => {
    const product1 = server.create("product");
    const product2 = server.create("product");

    cartManager.addProducts([product1, product2]);

    expect(cartManager.hasAnyProduct()).toBe(true);
  });

  it("Should return true if a product is already in the cart.", () => {
    const product = server.create("product");

    cartManager.addProducts([product]);

    expect(cartManager.alreadyExists(product)).toBe(true);
  });
});

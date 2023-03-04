// UTILS
import { makeServer } from "@/miragejs/server";
import CartManager from "@/managers/CartManager";

describe("CartManager - Unit", () => {
  let Cart;
  let Server;

  beforeEach(() => {
    Cart = new CartManager();
    Server = makeServer({ environment: "test" });
  });

  afterEach(() => {
    Server.shutdown();
  });

  it("Should return the state.", () => {
    const product = Server.create("product");

    Cart.addProducts([product]);
    Cart.open();

    expect(Cart.getState()).toEqual({
      items: [product],
      isOpen: true,
    });
  });

  it("Should set cart to open.", () => {
    const state = Cart.open();

    expect(state.isOpen).toBe(true);
  });

  it("Should set cart to closed.", () => {
    const state = Cart.close();

    expect(state.isOpen).toBe(false);
  });

  it("Should add a product to the cart only once.", () => {
    const product = Server.create("product");

    const state = Cart.addProducts([product, product]);

    expect(state.items).toHaveLength(1);
  });

  it("Should remove product from the cart.", () => {
    const product = Server.create("product");

    const state = Cart.removeProducts([product.id]);

    expect(state.items).toHaveLength(0);
  });

  it("Should clear products.", () => {
    const state = Cart.clearProducts();

    expect(state.items).toHaveLength(0);
  });

  it("Should clear cart.", () => {
    const state = Cart.clearCart();

    expect(state.items).toHaveLength(0);
    expect(state.isOpen).toBe(false);
  });

  it("Should return true if cart is not empty.", () => {
    const product1 = Server.create("product");
    const product2 = Server.create("product");

    Cart.addProducts([product1, product2]);

    expect(Cart.hasAnyProduct()).toBe(true);
  });

  it("Should return true if a product is already in the cart.", () => {
    const product = Server.create("product");

    Cart.addProducts([product]);

    expect(Cart.alreadyExists(product)).toBe(true);
  });
});

// DEPENDENCIES
import { mount } from "@vue/test-utils";
import { makeServer } from "@/miragejs/server";
import CartManager from "@/managers/CartManager";

// COMPONENTS
import TheCart from "@/components/TheCart";
import CartItem from "@/components/CartItem";

describe("TheCart - Unit", () => {
  let Server;

  beforeEach(() => {
    Server = makeServer({ environment: "test" });
  });

  afterEach(() => {
    Server.shutdown();
  });

  /**
   * It mounts the Cart component.
   *
   * @param {object} props The component props.
   *
   * @returns {object} The wrapper component.
   */
  function mountTheCart() {
    const Cart = new CartManager();

    const wrapper = mount(TheCart, {
      mocks: {
        $cart: Cart,
      },
    });

    return { wrapper, Cart };
  }

  it("Should mount the component.", () => {
    const { wrapper } = mountTheCart();

    expect(wrapper.vm).toBeDefined();
  });

  it('Should hide the cart when the prop "isOpen" is false or isn\'t given.', () => {
    const { wrapper } = mountTheCart();

    expect(wrapper.classes()).toContain("hidden");
  });

  it('Should display the cart when the prop "isOpen" is true.', async () => {
    const { wrapper } = mountTheCart();

    await wrapper.setProps({ isOpen: true });

    expect(wrapper.classes()).not.toContain("hidden");
  });

  it('Should emit a "closeCart" event when the close button gets clicked.', async () => {
    const { wrapper } = mountTheCart();

    const closeButton = wrapper.find('[data-testid="close-button"]');
    await closeButton.trigger("click");

    expect(wrapper.emitted().closeCart).toBeTruthy();
    expect(wrapper.emitted().closeCart).toHaveLength(1);
    expect(wrapper.emitted().closeCart[0]).toEqual([]);
  });

  it('Should display a "Cart is empty" message when there are no products.', () => {
    const { wrapper } = mountTheCart();

    expect(wrapper.text()).toContain("Cart is empty");
  });

  it("Should display 2 instances of CartItem component when 2 products are given to TheCart as prop.", async () => {
    const products = Server.createList("product", 2);

    const { wrapper } = mountTheCart();

    await wrapper.setProps({ products, hasAnyProduct: true });

    expect(wrapper.findAllComponents(CartItem)).toHaveLength(2);
    expect(wrapper.text()).not.toContain("Cart is empty");
  });

  it("Shouldn't display a button to clear the cart when there are not any products.", () => {
    const { wrapper } = mountTheCart();

    const clearCartButton = wrapper.find('[data-testid="clear-cart-button"]');

    expect(clearCartButton.exists()).toBe(false);
  });

  it("Should display a button to clear the cart when there are any products.", async () => {
    const product = Server.create("product");

    const { wrapper } = mountTheCart();

    await wrapper.setProps({ products: [product], hasAnyProduct: true });

    const clearCartButton = wrapper.find('[data-testid="clear-cart-button"]');

    expect(clearCartButton.exists()).toBe(true);
  });

  it("Should call CartManager clearProducts() when the button gets clicked.", async () => {
    const products = Server.createList("product", 2);

    const { wrapper, Cart } = mountTheCart();

    await wrapper.setProps({ products, hasAnyProduct: true });

    const clearCartButton = wrapper.find('[data-testid="clear-cart-button"]');

    const clearProducts = jest.spyOn(Cart, "clearProducts");

    await clearCartButton.trigger("click");

    expect(clearProducts).toHaveBeenCalledTimes(1);
  });
});

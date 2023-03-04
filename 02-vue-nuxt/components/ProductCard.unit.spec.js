// DEPENDENCIES
import { mount } from "@vue/test-utils";
import { makeServer } from "@/miragejs/server";

// UTILS
import CartManager from "@/managers/CartManager";

// COMPONENTS
import ProductCard from "@/components/ProductCard";

/**
 * Creates a fresh instance of a ProductCard component.
 *
 * @param {object} server The miragejs server instance.
 *
 * @returns {object} The ProductCard instance.
 */
function mountProductCard(server, options = {}) {
  const product = server.create("product", {
    title: "Dummy test",
    price: "23.00",
    image: "https://loremflickr.com/640/480/food?lock=96682",
  });

  const Cart = new CartManager();

  const wrapper = mount(ProductCard, {
    ...options,
    propsData: {
      product,
    },
    mocks: {
      $cart: Cart,
    },
  });

  return {
    wrapper,
    product,
    Cart,
  };
}

describe("ProductCard - Unit", () => {
  let Server;

  beforeEach(() => {
    Server = makeServer({ environment: "test" });
  });

  afterEach(() => {
    Server.shutdown();
  });

  it("Should mount the component", () => {
    const { wrapper } = mountProductCard(Server);

    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.text()).toContain("Dummy test");
    expect(wrapper.text()).toContain("23.00");
  });

  it("Should match snapshot", () => {
    const { wrapper } = mountProductCard(Server);

    expect(wrapper.element).toMatchSnapshot();
  });

  it("Should add an item to the cart when the button gets clicked.", async () => {
    const { wrapper, product, Cart } = mountProductCard(Server);

    const open = jest.spyOn(Cart, "open");

    const addProducts = jest.spyOn(Cart, "addProducts");

    await wrapper.find("button").trigger("click");

    expect(open).toHaveBeenCalledTimes(1);
    expect(addProducts).toHaveBeenCalledTimes(1);
    expect(addProducts).toHaveBeenCalledWith([product]);
    expect(Cart.getState().items).toHaveLength(1);
  });
});

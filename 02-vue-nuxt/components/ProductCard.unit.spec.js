// DEPENDENCIES
import { mount } from "@vue/test-utils";
import { makeServer } from "@/miragejs/server";

// UTILS
import { Cart } from "@/observables/Cart";

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

  const wrapper = mount(ProductCard, {
    ...options,
    propsData: {
      product,
    },
  });

  return {
    wrapper,
    product,
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

  xit("Should add an item to the cart when the button gets clicked.", async () => {
    const { wrapper } = mountProductCard(Server);

    await wrapper.find("button").trigger("click");

    expect(Cart.items).toHaveLength(1);
  });
});

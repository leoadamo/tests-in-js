// DEPENDENCIES
import { mount } from "@vue/test-utils";
import { makeServer } from "@/miragejs/server";

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
  let server;

  beforeEach(() => {
    server = makeServer({ environment: "test" });
  });

  afterEach(() => {
    server.shutdown();
  });

  it("Should mount the component", () => {
    const { wrapper } = mountProductCard(server);

    expect(wrapper.vm).toBeTruthy();
    expect(wrapper.text()).toContain("Dummy test");
    expect(wrapper.text()).toContain("23.00");
  });

  it("Should match snapshot", () => {
    const { wrapper } = mountProductCard(server);

    expect(wrapper.element).toMatchSnapshot();
  });

  it("Should emit the event addToCart with the product object when button gets clicked.", async () => {
    const { wrapper, product } = mountProductCard(server);

    await wrapper.find("button").trigger("click");

    expect(wrapper.emitted().addToCart).toBeTruthy();
    expect(wrapper.emitted().addToCart.length).toBe(1);
    expect(wrapper.emitted().addToCart[0]).toEqual([{ product }]);
  });
});

// DEPENDENCIES
import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import { makeServer } from "@/miragejs/server";
import axios from "axios";

// COMPONENTS
import SearchBar from "@/components/SearchBar";
import ProductCard from "@/components/ProductCard";
import ProductsList from "./index";

// Mocking 'axios.get' function inside Jest
jest.mock("axios", () => ({
  get: jest.fn(),
}));

describe("ProductsList - Integration", () => {
  let server;

  beforeEach(() => {
    server = makeServer({ environment: "test" });
  });

  afterEach(() => {
    server.shutdown();
    jest.clearAllMocks();
  });

  /**
   * Creates a product list in the server and allows to pass
   * an overrides collection in order to customize the list.
   *
   * @param {number} [quantity] The amount of items to create.
   * @param {array} [overrides] The items to customize the list when necessary.
   *
   * @returns {array} An array containing the products created in the server.
   */
  function getProducts(quantity = 25, overrides = []) {
    const overridesList = overrides.map((override) =>
      server.create("product", override)
    );

    const products = [
      ...server.createList("product", quantity),
      ...overridesList,
    ];

    return products;
  }

  /**
   * Mounts a product list to be used within tests.
   *
   * @param {number} [quantity] The amount of items to create.
   * @param {array} [overrides] The items to customize the list when necessary.
   * @param {boolean} [shouldReject] A boolean flag to define wether the promise should be resolved or rejected.
   *
   * @returns {object} An object containing the rendered wrapper and the list of products.
   */
  async function mountProductsList(
    quantity = 25,
    overrides = [],
    shouldReject = false
  ) {
    const products = getProducts(quantity, overrides);

    if (shouldReject) {
      axios.get.mockReturnValue(Promise.reject(new Error("Unexpected error.")));
    } else {
      axios.get.mockReturnValue(Promise.resolve({ data: { products } }));
    }

    const wrapper = mount(ProductsList, {
      mocks: {
        $axios: axios,
      },
    });

    await nextTick();

    return {
      wrapper,
      products,
    };
  }

  it("Should mount the component.", async () => {
    const { wrapper } = await mountProductsList();

    expect(wrapper.vm).toBeTruthy();
  });

  it("Should mount the SearchBar component.", async () => {
    const { wrapper } = await mountProductsList();

    const search = wrapper.findComponent(SearchBar);

    expect(search).toBeDefined();
  });

  it("Should call axios.get on component mount.", async () => {
    await mountProductsList();

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith("/api/products");
  });

  it("Should mount the ProductCard component 25 times.", async () => {
    const { wrapper } = await mountProductsList();

    const productCards = wrapper.findAllComponents(ProductCard);

    expect(productCards).toHaveLength(25);
  });

  it("Should show an error message when the Promise rejects.", async () => {
    const { wrapper } = await mountProductsList(25, [], true);

    expect(wrapper.text()).toContain("Sorry, we had an unexpected error.");
  });

  it("Should filter the products list when a search is performed.", async () => {
    // Arrange
    const overrides = [
      {
        title: "Hamburger de costela",
      },
      {
        title: "Fritas acompanhadas de um delicioso hamburger de costela",
      },
    ];

    const { wrapper } = await mountProductsList(23, overrides);

    // Act
    const searchBar = wrapper.findComponent(SearchBar);

    searchBar.find('input[type="search"').setValue("COSTELA");
    await searchBar.find("form").trigger("submit");

    // Assert
    const productCards = wrapper.findAllComponents(ProductCard);

    expect(wrapper.vm.searchTerm).toBe("costela");
    expect(productCards).toHaveLength(2);
  });

  it("Should return the full products list when the search is cleared.", async () => {
    // Arrange
    const overrides = [
      {
        title: "Hamburger de costela",
      },
    ];

    const { wrapper } = await mountProductsList(24, overrides);

    // Act
    const searchBar = wrapper.findComponent(SearchBar);

    searchBar.find('input[type="search"').setValue("COSTELA");
    await searchBar.find("form").trigger("submit");
    searchBar.find('input[type="search"').setValue("");
    await searchBar.find("form").trigger("submit");

    // Assert
    const productCards = wrapper.findAllComponents(ProductCard);

    expect(wrapper.vm.searchTerm).toBe("");
    expect(productCards).toHaveLength(25);
  });
});

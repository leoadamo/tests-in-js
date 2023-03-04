// DEPENDENCIES
import Vue from "vue";

const initialState = {
  isOpen: false,
  items: [],
};

/**
 * This class is intended to manage all Cart operations and state.
 */
export default class CartManager {
  state;

  constructor() {
    this.state = Vue.observable(initialState);
  }

  /**
   * Opens the cart.
   *
   * @returns {object} The updated state.
   */
  open() {
    this.state.isOpen = true;

    return this.state;
  }

  /**
   * Closes the cart.
   *
   * @returns {object} The updated state.
   */
  close() {
    this.state.isOpen = false;

    return this.state;
  }

  /**
   * Checks if a product already exists in the cart or not.
   *
   * @param {object} product The product data.
   *
   * @returns {boolean} A boolean flag to indicate if the given product already exists in the cart or not.
   */
  alreadyExists(product) {
    return !!this.state.items.find((item) => item.id === product.id);
  }

  /**
   * Checks if the cart contains any product or not.
   *
   * @returns {boolean} A boolean flag to indicate if the cart is empty.
   */
  hasAnyProduct() {
    return this.state.items.length > 0;
  }

  /**
   * Adds a product into the cart if it doesn't already exists.
   *
   * @returns {object} The updated state.
   */
  addProducts(products) {
    products.forEach((product) => {
      if (!this.alreadyExists(product)) {
        this.state.items.push(product);
      }
    });

    return this.state;
  }

  /**
   * Removes products from the cart.
   *
   * @param {string} productsIds The ID of the products to be removed.
   *
   * @returns {object} The updated state.
   */
  removeProducts(productsIds) {
    productsIds.forEach((id) => {
      this.state.items = [...this.state.items.filter((item) => item.id !== id)];
    });

    return this.state;
  }

  /**
   * It clears the cart.
   *
   * @returns {object} The updated state.
   */
  clearProducts() {
    this.state.items = [];

    return this.state;
  }

  /**
   * Resets the cart to it's original state.
   *
   * @returns {object} The updated state.
   */
  clearCart() {
    this.clearProducts();
    this.close();

    return this.state;
  }
}

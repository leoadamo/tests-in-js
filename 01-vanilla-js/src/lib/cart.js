// DEPENDENCIES
import find from 'lodash/find';
import remove from 'lodash/remove';

/**
 * Cart.js - Creates a Cart instance containing all it's
 * methods.
 */
export default class Cart {
	items = [];

	/**
	 * Adds an item into the cart.
	 *
	 * @param {object} item The item data.
	 * @returns {void}
	 */
	add(item) {
		const itemToFind = { product: item.product };

		if (find(this.items, itemToFind)) {
			remove(this.items, itemToFind);
		}

		this.items.push(item);
	}

	/**
	 * Removes an item from the cart.
	 *
	 * @param {object} item The item data.
	 */
	remove(item) {
		remove(this.items, { product: item.product });
	}

	/**
	 * Gets the cart total amount.
	 *
	 * @returns {void}
	 */
	getTotal() {
		return this.items.reduce(
			(acc, item) => acc + item.quantity * item.product.price,
			0
		);
	}
}

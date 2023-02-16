// DEPENDENCIES
import find from 'lodash/find';
import remove from 'lodash/remove';

// CONFIG
import Dinero from '@config/dinero';

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
	 * @returns {number} The cart total amount.
	 */
	getTotal() {
		const total = this.items.reduce((acc, item) => {
			const amount = Dinero({ amount: item.quantity * item.product.price });
			let discount = Dinero({ amount: 0 });

			if (
				item.conditions &&
				item.conditions.percentage &&
				item.conditions.minimum &&
				item.conditions.minimum <= item.quantity
			) {
				discount = amount.percentage(item.conditions.percentage);
			}

			return acc.add(amount).subtract(discount);
		}, Dinero({ amount: 0 }));

		return total.getAmount();
	}

	/**
	 * Gets the order summary.
	 *
	 * @returns {object} The order summary.
	 */
	getSummary() {
		const items = this.items;
		const total = this.getTotal();

		return {
			items,
			total,
		};
	}

	/**
	 * Returns the checkout data.
	 *
	 * @returns {object} The checkout payload.
	 */
	checkout() {
		const { items, total } = this.getSummary();

		this.items = [];

		return {
			items,
			total,
		};
	}
}

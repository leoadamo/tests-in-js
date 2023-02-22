// DEPENDENCIES
import find from 'lodash/find';
import remove from 'lodash/remove';

// CONFIG
import Dinero from '@config/dinero';

// UTILS
import getDiscount from '@utils/discount';

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
		const total = this.items.reduce(
			(acc, { quantity, product, conditions }) => {
				const amount = Dinero({ amount: quantity * product.price });

				const discount = conditions
					? getDiscount(amount, quantity, conditions)
					: Dinero({ amount: 0 });

				return acc.add(amount).subtract(discount);
			},
			Dinero({ amount: 0 })
		);

		return total.getAmount();
	}

	/**
	 * Gets the order summary.
	 *
	 * @returns {object} The order summary.
	 */
	getSummary() {
		const { items } = this;
		const total = this.getTotal();
		const formattedTotal = Dinero({ amount: total }).toFormat('$0,0.00');

		return {
			items,
			total,
			formattedTotal,
		};
	}

	/**
	 * Returns the checkout data.
	 *
	 * @returns {object} The checkout payload.
	 */
	checkout() {
		const { items, formattedTotal } = this.getSummary();

		this.items = [];

		return {
			items,
			formattedTotal,
		};
	}
}

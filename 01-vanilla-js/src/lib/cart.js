// DEPENDENCIES
import find from 'lodash/find';
import remove from 'lodash/remove';

// CONFIG
import Dinero from '@config/dinero';

/**
 * Gets a discount percentage to be applied to an
 * item.
 *
 * @param {number} amount The total amount.
 * @param {object} item The item data.
 * @returns {number} The properly percentage of discount to be applied.
 */
function getPercentageDiscount(amount, item) {
	if (item.conditions?.minimum < item.quantity) {
		return amount.percentage(item.conditions.percentage);
	}

	return Dinero({ amount: 0 });
}

/**
 * Gets a discount based on a quantity of items being bought.
 *
 * @param {number} amount The total amount.
 * @param {object} item The item data.
 * @returns {number} The properly discount based on the quantity of items being bought.
 */
function getQuantityDiscount(amount, item) {
	const isEven = item.quantity % 2 === 0;
	const percentage = isEven ? 50 : 40;

	if (item.conditions.quantity < item.quantity) {
		return amount.percentage(percentage);
	}

	return Dinero({ amount: 0 });
}
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
			let discount;

			if (item.conditions?.percentage) {
				discount = getPercentageDiscount(amount, item);
			} else if (item.conditions?.quantity) {
				discount = getQuantityDiscount(amount, item);
			} else {
				discount = Dinero({ amount: 0 });
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

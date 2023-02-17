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
function getPercentageDiscount(amount, { conditions, quantity }) {
	if (conditions?.minimum < quantity) {
		return amount.percentage(conditions.percentage);
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
function getQuantityDiscount(amount, { conditions, quantity }) {
	const isEven = quantity % 2 === 0;
	const percentage = isEven ? 50 : 40;

	if (conditions.quantity < quantity) {
		return amount.percentage(percentage);
	}

	return Dinero({ amount: 0 });
}

/**
 * Applies a higher discount based on the given conditions.
 *
 * @param {number} amount The total amount.
 * @param {number} quantity The item quantity.
 * @param {array|object} conditions The special conditions.
 * @returns {Dinero.Dinero} A Dinero instance containing the discount amount.
 */
export function getDiscount(amount, quantity, conditions) {
	const conditionsList = Array.isArray(conditions) ? conditions : [conditions];

	const [higherDiscount] = conditionsList
		.map((cond) => {
			if (cond.percentage) {
				return getPercentageDiscount(amount, {
					conditions: cond,
					quantity,
				}).getAmount();
			} else if (cond.quantity) {
				return getQuantityDiscount(amount, {
					conditions: cond,
					quantity,
				}).getAmount();
			} else {
				return 0;
			}
		})
		.sort((a, b) => b - a);

	return Dinero({ amount: higherDiscount });
}

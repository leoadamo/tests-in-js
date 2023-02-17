// DEPENDENCIES
import Cart from '@lib/cart';

describe('cart.js: Handling products addition, exclusion and order details.', () => {
	const product = {
		title: 'Nike SB Run',
		price: 35388, // 353.88 || R$ 353.88
	};

	const secondaryProduct = {
		title: 'Adidas AdiPower - Women',
		price: 50000, // 500.00 || R$ 500.00
	};

	let cart;

	// Creating a global cart instance before each test to run.
	beforeEach(() => {
		cart = new Cart();
	});

	describe('getTotal()', () => {
		it('Should return 0 when getTotal() is called in a newly created cart instance.', () => {
			expect(cart.getTotal()).toEqual(0);
		});

		it('Should multiply the price and quantity and return the amount.', () => {
			cart.add({
				product,
				quantity: 2, // 70776
			});

			expect(cart.getTotal()).toEqual(70776);
		});

		it('Should ensure that only one item exists at a time.', () => {
			cart.add({
				product,
				quantity: 2,
			});

			cart.add({
				product,
				quantity: 1,
			});

			// The total in the cart, should be based on the last added item quantity.
			expect(cart.getTotal()).toEqual(35388);
		});

		it('Should update the total amount when a product is added and then removed from the cart.', () => {
			cart.add({
				product,
				quantity: 2,
			});

			cart.add({
				product: secondaryProduct,
				quantity: 1,
			});

			cart.remove({ product });

			expect(cart.getTotal()).toEqual(50000);
		});
	});

	describe('checkout()', () => {
		it('Should return an object containing the formatted total and the list of items in the order.', () => {
			cart.add({
				product,
				quantity: 2,
			});

			cart.add({
				product: secondaryProduct,
				quantity: 4,
			});

			expect(cart.checkout()).toMatchSnapshot();
		});

		it('Should return an object containing the total, formatted total and the list of items in the order when getSummary() is called. Also, the total in the cart should be greater than zero.', () => {
			cart.add({
				product,
				quantity: 1,
			});

			cart.add({
				product: secondaryProduct,
				quantity: 1,
			});

			expect(cart.getSummary()).toMatchSnapshot();
			expect(cart.getTotal()).toBeGreaterThan(0);
		});

		it('Should include the formatted total in the summary.', () => {
			cart.add({
				product,
				quantity: 1,
			});

			cart.add({
				product: secondaryProduct,
				quantity: 1,
			});

			expect(cart.getSummary().formattedTotal).toEqual('R$853.88');
		});

		it('Should clean the cart when checkout() is called.', () => {
			cart.add({
				product,
				quantity: 3,
			});

			cart.add({
				product: secondaryProduct,
				quantity: 3,
			});

			cart.checkout();

			expect(cart.getTotal()).toEqual(0);
		});
	});

	describe('Receiving special conditions', () => {
		it("Shouldn't apply any discount when having invalid special conditions", () => {
			cart.add({
				product,
				quantity: 1,
				conditions: {
					invalid: true,
				},
			});

			expect(cart.getTotal()).toEqual(35388);
		});

		it("Shouldn't apply a percentage discount when the quantity of products is lower then or equals to a minimum condition.", () => {
			const conditions = {
				minimum: 2,
				percentage: 30,
			};

			cart.add({
				product,
				quantity: 1,
				conditions,
			});

			expect(cart.getTotal()).toEqual(35388);
		});

		it("Shouldn't apply a quantity-based discount when the quantity of products is lower then or equals to a quantity condition.", () => {
			const conditions = {
				quantity: 2,
			};

			cart.add({
				product,
				quantity: 1,
				conditions,
			});

			expect(cart.getTotal()).toEqual(35388);
		});

		it('Should apply a percentage discount when the quantity of products satisfies a minimum condition.', () => {
			const conditions = {
				minimum: 2,
				percentage: 30,
			};

			cart.add({
				product,
				quantity: 3,
				conditions,
			});

			expect(cart.getTotal()).toEqual(74315);
		});

		it('Should apply a quantity-based discount for EVEN quantities (50% off).', () => {
			const conditions = {
				quantity: 2,
			};

			cart.add({
				product,
				quantity: 4,
				conditions,
			});

			// Should be a half of the total amount (50% off).
			expect(cart.getTotal()).toEqual(70776);
		});

		it('Should apply a quantity-based discount for ODD quantities (40% off).', () => {
			const conditions = {
				quantity: 2,
			};

			cart.add({
				product,
				quantity: 5,
				conditions,
			});

			// Should be 40% off the total amount.
			expect(cart.getTotal()).toEqual(106164);
		});

		it('Should apply the best discount for two different given conditions (Case 01 - Quantity is better).', () => {
			const conditions1 = {
				percentage: 30,
				minimum: 2,
			};

			const conditions2 = {
				quantity: 2,
			};

			cart.add({
				product,
				quantity: 5,
				conditions: [conditions1, conditions2],
			});

			expect(cart.getTotal()).toBe(106164);
		});

		it('Should apply the best discount for two different given conditions (Case 02 - Percentage is better).', () => {
			const conditions1 = {
				percentage: 80,
				minimum: 2,
			};

			const conditions2 = {
				quantity: 2,
			};

			cart.add({
				product,
				quantity: 5,
				conditions: [conditions1, conditions2],
			});

			expect(cart.getTotal()).toBe(35388);
		});
	});
});

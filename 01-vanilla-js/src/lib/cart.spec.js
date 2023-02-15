// DEPENDENCIES
import Cart from './cart';

describe('cart.js: Handling products addition, exclusion and order details.', () => {
	const product = {
		title: 'Nike SB Run',
		price: 35388, // 353.88 || R$ 353.88
	};

	const secondaryProduct = {
		title: 'Adidas AdiPower - Women',
		price: 50000,
	};

	let cart;

	// Creating a global cart instance before each test to run.
	beforeEach(() => {
		cart = new Cart();
	});

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

	it('Should ensure that only one product exists at a time.', () => {
		cart.add({
			product,
			quantity: 2,
		});

		cart.add({
			product,
			quantity: 1,
		});

		// The total in the cart, should be based on the last added product quantity.
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
// DEPENDENCIES
import Cart from './cart';

describe('cart.js: Handling products addition, exclusion and order details.', () => {
	let cart;

	// Creating a global cart instance before each test to run.
	beforeEach(() => {
		cart = new Cart();
	});

	it('Should return 0 when getTotal() is called in a newly created cart instance.', () => {
		expect(cart.getTotal()).toEqual(0);
	});

	it('Should multiply the price and quantity and return the amount.', () => {
		const item = {
			product: {
				title: 'Nike SB Run',
				price: 35388, // 353.88 || R$ 353.88
			},
			quantity: 2, // 70776
		};

		cart.add(item);

		expect(cart.getTotal()).toEqual(70776);
	});
});

// DEPENDENCIES
import { mount } from '@vue/test-utils';
import { makeServer } from '@/miragejs/server';

// COMPONENTS
import CartItem from '@/components/CartItem';

describe('CartItem - Unit', () => {
	let server;

	beforeEach(() => {
		server = makeServer({ environment: 'test' });
	});

	afterEach(() => {
		server.shutdown();
	});

	// CONSTANTS
	const product = {
		title: 'Hamburger CIA 09',
		price: '30.00',
	};

	/**
	 * Creates a brand new product item and mounts the component with it.
	 *
	 * @param {object} productData The product data.
	 * @returns {object} The wrapper element and the created product data.
	 */
	function mountCartItem(productData = product) {
		const product = server.create('product', productData);

		const wrapper = mount(CartItem, {
			propsData: {
				product,
			},
		});

		return { wrapper, product };
	}

	it('Should mount the component.', async () => {
		const { wrapper } = await mountCartItem();

		expect(wrapper.vm).toBeDefined();
	});

	it('Should display product info.', () => {
		const {
			wrapper,
			product: { title, price },
		} = mountCartItem();

		const content = wrapper.text();

		expect(content).toContain(title);
		expect(content).toContain(price);
	});

	it('Should display quantity 1 when product is first displayed.', () => {
		const { wrapper } = mountCartItem();

		const quantity = wrapper.find('[data-testid="quantity"]');

		expect(quantity.text()).toContain('1');
	});

	it('Should increase quantity when the "+" button gets clicked.', async () => {
		const { wrapper } = mountCartItem();

		const quantity = wrapper.find('[data-testid="quantity"]');

		const increaseButton = wrapper.find('[data-testid="increase"');

		await increaseButton.trigger('click');
		expect(quantity.text()).toContain('2');

		await increaseButton.trigger('click');
		expect(quantity.text()).toContain('3');

		await increaseButton.trigger('click');
		expect(quantity.text()).toContain('4');
	});

	it('Should decrease quantity when the "-" button gets clicked.', async () => {
		const { wrapper } = mountCartItem();

		const quantity = wrapper.find('[data-testid="quantity"]');

		const decreaseButton = wrapper.find('[data-testid="decrease"');

		await decreaseButton.trigger('click');

		expect(quantity.text()).toContain('0');
	});

	it('Should not allow to decrease below 0 unities when the "-" button gets repeatedly clicked.', async () => {
		const { wrapper } = mountCartItem();

		const quantity = wrapper.find('[data-testid="quantity"]');

		const decreaseButton = wrapper.find('[data-testid="decrease"');

		await decreaseButton.trigger('click');
		await decreaseButton.trigger('click');
		await decreaseButton.trigger('click');

		expect(quantity.text()).toContain('0');
	});
});

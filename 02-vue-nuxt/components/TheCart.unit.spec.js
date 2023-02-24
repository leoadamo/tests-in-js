// DEPENDENCIES
import { mount } from '@vue/test-utils';
import { makeServer } from '@/miragejs/server';

// COMPONENTS
import TheCart from '@/components/TheCart';
import CartItem from '@/components/CartItem';

describe('TheCart - Unit', () => {
	let server;

	beforeEach(() => {
		server = makeServer({ environment: 'test' });
	});

	afterEach(() => {
		server.shutdown();
	});

	it('Should mount the component.', () => {
		const wrapper = mount(TheCart);

		expect(wrapper.vm).toBeDefined();
	});

	it('Should hide the cart when the prop "isOpen" is false or isn\'t given.', () => {
		const wrapper = mount(TheCart);

		expect(wrapper.classes()).toContain('hidden');
	});

	it('Should display the cart when the prop "isOpen" is true.', () => {
		const wrapper = mount(TheCart, {
			propsData: {
				isOpen: true,
			},
		});

		expect(wrapper.classes()).not.toContain('hidden');
	});

	it('Should emit a "closeCart" event when the close button gets clicked.', async () => {
		const wrapper = mount(TheCart);

		const closeButton = wrapper.find('[data-testid="close-button"]');
		await closeButton.trigger('click');

		expect(wrapper.emitted().closeCart).toBeTruthy();
		expect(wrapper.emitted().closeCart).toHaveLength(1);
		expect(wrapper.emitted().closeCart[0]).toEqual([]);
	});

	it('Should display a "Cart is empty" message when there are no products.', () => {
		const wrapper = mount(TheCart);

		expect(wrapper.text()).toContain('Cart is empty');
	});

	it('Should display 2 instances of CartItem component when 2 products are given to TheCart as prop.', () => {
		const products = server.createList('product', 2);

		const wrapper = mount(TheCart, {
			propsData: {
				products,
			},
		});

		expect(wrapper.findAllComponents(CartItem)).toHaveLength(2);
		expect(wrapper.text()).not.toContain('Cart is empty');
	});
});

// DEPENDENCIES
import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { makeServer } from '@/miragejs/server';
import axios from 'axios';

// COMPONENTS
import SearchBar from '@/components/SearchBar';
import ProductCard from '@/components/ProductCard';
import ProductsList from './index';

jest.mock('axios', () => ({
	get: jest.fn(),
}));

describe('ProductsList - Integration', () => {
	let server;

	beforeEach(() => {
		server = makeServer();
	});

	afterEach(() => {
		server.shutdown();
	});

	it('Should mount the component.', () => {
		const wrapper = mount(ProductsList);

		expect(wrapper.vm).toBeTruthy();
	});

	it('Should mount the SearchBar component.', () => {
		const wrapper = mount(ProductsList);

		const search = wrapper.findComponent(SearchBar);

		expect(search).toBeDefined();
	});

	it('Should call axios.get on component mount.', () => {
		mount(ProductsList, {
			mocks: {
				$axios: axios,
			},
		});

		expect(axios.get).toHaveBeenCalledTimes(1);
		expect(axios.get).toHaveBeenCalledWith('/api/products');
	});

	it('Should mount the ProductCard component 10 times.', async () => {
		const products = server.createList('product', 10);

		axios.get.mockReturnValue(Promise.resolve({ data: { products } }));

		const wrapper = mount(ProductsList, {
			mocks: {
				$axios: axios,
			},
		});

		await nextTick();

		const productCards = wrapper.findAllComponents(ProductCard);

		expect(productCards).toHaveLength(10);
	});

	it('Should show an error message when the Promise rejects.', async () => {
		axios.get.mockReturnValue(Promise.reject(new Error('Unexpected error.')));

		const wrapper = mount(ProductsList, {
			mocks: {
				$axios: axios,
			},
		});

		await nextTick();

		expect(wrapper.text()).toContain('Sorry, we had an unexpected error.');
	});

	it('Should filter the product list when a search is performed.', async () => {
		// Arrange
		const products = [
			...server.createList('product', 10),
			server.create('product', {
				title: 'Hamburger de costela',
			}),
			server.create('product', {
				title: 'Fritas acompanhadas de um delicioso hamburger de costela',
			}),
		];

		axios.get.mockReturnValue(Promise.resolve({ data: { products } }));

		await nextTick();

		const wrapper = mount(ProductsList, {
			mocks: {
				$axios: axios,
			},
		});

		// Act
		const searchBar = wrapper.findComponent(SearchBar);

		searchBar.find('input[type="search"').setValue('costela');
		await searchBar.find('form').trigger('submit');

		// Assert
		const productCards = wrapper.findAllComponents(ProductCard);

		expect(wrapper.vm.searchTerm).toBe('costela');
		expect(productCards).toHaveLength(2);
	});
});

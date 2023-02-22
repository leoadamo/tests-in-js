// DEPENDENCIES
import { createServer } from 'miragejs';

// MOCKS
import products from '@/mocks/products.json';

export function makeServer({ environment = 'development' } = {}) {
	return createServer({
		environment,

		routes() {
			this.namespace = 'api';
			this.get('products', () => ({
				products,
			}));
		},
	});
}

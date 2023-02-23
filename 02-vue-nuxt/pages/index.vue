<template>
	<main class="my-8">
		<search-bar />

		<h3 v-if="errorMessage" class="my-4 text-center text-2xl">
			{{ errorMessage }}
		</h3>

		<div v-else class="container mx-auto px-6">
			<h3 class="text-gray-700 text-2xl font-medium">The lunch</h3>
			<span
				data-testid="total-quantity-label"
				class="mt-3 text-sm text-gray-500"
			>
				{{ products.length }} items found
			</span>
			<div
				class="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mt-6"
			>
				<product-card
					v-for="product in products"
					:key="product.id"
					:product="product"
					data-testid="product-card"
				/>
			</div>
		</div>
	</main>
</template>

<script>
import ProductCard from '@/components/ProductCard';
import SearchBar from '@/components/SearchBar';

export default {
	components: {
		ProductCard,
		SearchBar,
	},

	data() {
		return {
			products: [],
			errorMessage: null,
		};
	},

	async created() {
		try {
			const { data } = await this.$axios.get('/api/products');

			this.products = data.products;
		} catch (error) {
			this.errorMessage = 'Sorry, we had an unexpected error.';
		}
	},
};
</script>

<template>
	<div class="flex justify-between mt-6">
		<div class="flex">
			<img
				class="h-20 w-20 object-cover rounded"
				src="https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-1.2.1&auto=format&fit=crop&w=689&q=80"
				alt="Wrist watch classic"
			/>
			<div class="mx-3">
				<h3 class="text-sm text-gray-600">Wrist watch classic</h3>
				<button data-testid="remove-button">remover</button>
				<div class="flex items-center mt-2">
					<button
						data-testid="-"
						class="text-gray-500 focus:outline-none focus:text-gray-600"
					>
						<svg
							class="h-5 w-5"
							fill="none"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg>
					</button>
					<span data-testid="quantity" class="text-gray-700 mx-2"> 1 </span>
					<button
						data-testid="+"
						class="text-gray-500 focus:outline-none focus:text-gray-600"
					>
						<svg
							class="h-5 w-5"
							fill="none"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
							></path>
						</svg>
					</button>
				</div>
			</div>
		</div>
		<span class="text-gray-600">$120.00</span>
	</div>
</template>

<script>
export default {
	name: 'CartItem',

	props: {
		product: {
			type: Object,
			required: true,
		},
	},
};
</script>

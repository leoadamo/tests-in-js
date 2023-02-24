// DEPENDENCIES
import Vue from 'vue';

/**
 * Creates a global reactive object to be used within components.
 */
export const Cart = Vue.observable({
	isOpen: false,
	items: [],
});

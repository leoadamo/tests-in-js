// DEPENDENCIES
import { mount } from '@vue/test-utils';

// COMPONENTS
import app from './app.vue';

describe('App.vue', () => {
	it('Should be a Vue instance.', () => {
		const wrapper = mount(app);

		expect(wrapper.vm).toBeTruthy();
	});
});

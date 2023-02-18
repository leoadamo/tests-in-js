// DEPENDENCIES
import { mount } from '@vue/test-utils';

// COMPONENTS
import app from './app.vue';

describe('App.vue', () => {
	const wrapper = mount(app);

	it('Should be a Vue instance.', () => {
		expect(wrapper.vm).toBeTruthy();
	});

	it('Should contain a "<p>" tag within the text "Hello from Vue!".', () => {
		const paragraph = wrapper.get('p');

		expect(paragraph).toBeTruthy();
		expect(paragraph.text()).toBe('Hello from Vue!');
	});
});

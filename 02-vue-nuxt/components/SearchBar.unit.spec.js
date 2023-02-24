// DEPENDENCIES
import { mount } from '@vue/test-utils';

// COMPONENTS
import SearchBar from '@/components/SearchBar';

describe('SearchBar - Unit', () => {
	it('Should mount the component.', () => {
		const wrapper = mount(SearchBar);

		expect(wrapper.vm).toBeTruthy();
	});

	it('Should emit a "doSearch" event, containing a search term as payload when the form is submitted.', async () => {
		const wrapper = mount(SearchBar);

		const searchTerm = 'Este é o termo de busca';

		await wrapper.find('input[type="search"]').setValue(searchTerm);
		await wrapper.find('form').trigger('submit');

		expect(wrapper.emitted().doSearch).toBeTruthy();
		expect(wrapper.emitted().doSearch.length).toBe(1);
		expect(wrapper.emitted().doSearch[0]).toEqual([
			{ searchTerm: searchTerm.toLowerCase() },
		]);
	});

	it('Should emit a "doSearch" event, containing an empty search term as payload when the input field is cleared.', async () => {
		const wrapper = mount(SearchBar);

		const input = wrapper.find('input[type="search"]');

		const searchTerm = 'Este é o termo de busca';

		await input.setValue(searchTerm);
		await input.setValue('');

		expect(wrapper.emitted().doSearch).toBeTruthy();
		expect(wrapper.emitted().doSearch.length).toBe(1);
		expect(wrapper.emitted().doSearch[0]).toEqual([{ searchTerm: '' }]);
	});
});

module.exports = {
	preset: './jest.preset.js',
	testEnvironment: 'jsdom',
	testEnvironmentOptions: {
		customExportConditions: ['node', 'node-addons'],
	},
	moduleFileExtensions: ['js', 'vue'],
	moduleNameMapper: {
		'^@/(.*)': '<rootDir>/$1',
	},
	transform: {
		'^.+\\.(js)$': 'babel-jest',
		'.*\\.(vue)$': '@vue/vue3-jest',
		'.+\\.(css|scss|png|jpg|svg)$': 'jest-transform-stub',
	},
	transformIgnorePatterns: ['node_modules/(?!(nuxt3|unenv))'],
};

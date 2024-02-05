module.exports = {
	moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
	moduleNameMapper: {
		'\\.scss$': 'identity-obj-proxy',
		'\\.(css|less)$': 'identity-obj-proxy',
		'^@components/(.*)$': '<rootDir>/src/components/$1',
		'^@pages/(.*)$': '<rootDir>/src/pages/$1',
		'^@models/(.*)$': '<rootDir>/src/models/$1',
		'^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
	},
	collectCoverageFrom: ['<rootDir>/**/*.{ts, tsx}'],
	roots: ['<rootDir>'],
	testRegex: 'src/.*.spec.(ts|tsx)$',
	transform: {
		'^.+\\.(ts|tsx)$': 'ts-jest',
		'^.+\\.svg$': '<rootDir>/utils/svgTransform.js',
	},
	testEnvironment: 'jsdom',
	setupFilesAfterEnv: ['<rootDir>/utils/setupTests.ts'],
};

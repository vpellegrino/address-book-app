import '@testing-library/jest-dom';

(global.console as Console) = {
	...global.console,
	warn: jest.fn(),
	error: jest.fn(),
};

# Address Book App 🚀

This Address Book application is a front-end pet project designed to showcase React, TypeScript,
and CSS preprocessor proficiency. The goal is to create an interactive and functional address book that allows the end
user to browse a list of users (through an infinite scroll mechanism), filter them by nationality, perform a client-side
search, and view detailed information for each selected user.

## Installation

Ensure you have Node.js installed (currently tested with version `18.13.0`). Clone the repository and run:

```
npm install
```

## Usage

To start the development server, run the following:

```
npm start
```

The application will start at `http://localhost:8080`.

## Scripts

- `npm start`: Start the development server
- `npm run build`: Build the production-ready application
- `npm run lint`: Run linting for code and styles
- `npm run test:jest`: Run Jest tests
- `npm run test:jest:watch`: Run Jest tests in watch mode
- `npm run test:jest:coverage`: Run Jest tests and generate coverage reports

## Linting

Linting is performed using ESLint for TypeScript files and Stylelint for stylesheets. Run `npm run lint`
to check for linting errors.

## Testing

Testing is done using Jest and React Testing Library. Run `npm run test:jest` to execute tests.

## Folder Structure

The folder structure follows the principle of proximity, or code colocation, where code is placed close to where it is
used. This
means that hooks and test files must be placed close to the actual components where they are being used. The same
concept can be applied also to models, services, utils, etc.

- `src/`: Contains source code
    - `components/`: Specialized components
    - `hooks/`: Custom hooks, general purpose, sharable across multiple components/pages
    - `models/`: Data models/interfaces, general purpose
    - `pages/`: Macro-components corresponding to the application Routes

## Assumptions and possible improvements

- I made a deliberate choice to leverage a robust Design System library ([Patternfly](https://www.patternfly.org/)) rather than reinventing the wheel. By
  adopting Patternfly, I avoided spending time on styling layouts, ensuring consistency, or defining color schemes. This
  decision allowed me to focus more on enhancing user experience, improving functionalities, and bolstering test
  coverage.
  Prioritizing the utilization of established tools aimed at maximizing efficiency, enabling a stronger emphasis on
  delivering a robust and feature-rich application.
- About the testing strategy, based on the current project setting, to improve the confidence level, I would
  adopt e2e tests (with Cypress or Playwright) for pages and keep unit/integration tests (with RTL) for
  components/hooks/etc.
- There is room for improvement on the infinite scroll mechanism. To optimize client performances, remove users not
  currently visible from the DOM. For instance, we could remove and re-fetch the previously displayed pages when the
  user scrolls up.

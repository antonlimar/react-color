# Contributing

Fork and then clone the repo

    git clone git@github.com:your-username/react-color.git

Install all npm scripts:

    npm install

Make Changes. If you want to contribute check out the [help wanted](https://github.com/casesandberg/react-color/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) issues for things that need fixing.

To run the documentation site locally run `npm run site:dev` and open http://localhost:4173/. If you end up making any changes to the documentation or documentation site make sure to run `npm run typecheck` and `npm run site:verify` when creating a pull request.

Before submitting a pull request run `npm run test` to run the unit-tests and `npm run eslint` to check for linting errors in your changes.

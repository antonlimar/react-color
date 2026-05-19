# Contributing

Fork and then clone the repo

    git clone git@github.com:your-username/react-color-x.git

Install dependencies:

    npm install

Make Changes. If you want to contribute check out the [help wanted](https://github.com/antonlimar/react-color-x/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) issues for things that need fixing.

To run the documentation site locally run `npm run site:dev` and open http://localhost:4173/. If you end up making any changes to the documentation or documentation site make sure to run `npm run typecheck` and `npm run site:verify` when creating a pull request.

Before submitting a pull request, run the relevant checks for your change. At minimum, run `npm run test:unit` for unit tests and `npm run eslint` for linting; for package, type, Storybook, or documentation changes, also run the matching commands from `AGENTS.md` and the CI workflow.

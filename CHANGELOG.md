# Changelog

## Unreleased

### Compatibility and migration notes

- Published package output is now ESM-only: `main` and `module` point at `es/index.js`, `lib/` CommonJS artifacts are no longer built or published, and `react-color/lib/*` deep imports are no longer supported.
- The package now publishes an `exports` map for the root entry, documented `react-color/es/*` deep imports, and CSS entrypoints.
- Library peer compatibility is now explicitly documented and enforced as `react >=16.8.0`.
- Root development dependencies for the documentation site and Storybook intentionally stay on a newer React major than the package peer baseline. This is a repository-development constraint, not a published runtime requirement for consumers.
- The styling system now publishes aggregate and granular CSS entrypoints in `es/styles`; consumers should explicitly import either `react-color/es/styles/index.css` or only the picker/common CSS files they use.
- `theme` and `classNames` are now the preferred public styling API, while `styles` remains available only as a deprecated compatibility layer for legacy inline overrides.

### User-visible DX changes

- Runtime `propTypes` were removed after the TypeScript migration. This does not change the published component API, but JavaScript consumers no longer get development-time prop validation warnings from `prop-types`.
- Storybook prop metadata is generated again through `react-docgen`.
- The legacy `docs/` app and standalone `examples/` apps were removed; current documentation lives in the Vite-powered `site/` app.
- Public documentation now describes the `rc-*` BEM hooks, `theme="light" | "dark" | "auto"`, slot-level `classNames`, CSS custom properties, and migration guidance away from `styles` as the primary styling mechanism.

### Internal strictness and tooling

- `noImplicitAny` and `strictNullChecks` are enabled in the repository TypeScript config.
- Local declarations for legacy modules (`reactcss`, `tinycolor2`, selected `lodash/*` imports, icons, `material-colors`) were tightened to match actual usage without narrowing the public package API.

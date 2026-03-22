# Changelog

## Unreleased

### Compatibility and migration notes

- Published package compatibility remains drop-in for the upstream `react-color` entrypoints: `main`, `module`, root `index.d.ts`, and deep imports from `lib/` and `es/` are preserved.
- Library peer compatibility is now explicitly documented and enforced as `react >=16.8.0`.
- Root development dependencies for docs and Storybook intentionally stay on a newer React major than the package peer baseline. This is a repository-development constraint, not a published runtime requirement for consumers.

### User-visible DX changes

- Runtime `propTypes` were removed after the TypeScript migration. This does not change the published component API, but JavaScript consumers no longer get development-time prop validation warnings from `prop-types`.
- Storybook prop metadata is generated again through `react-docgen`.
- The docs toolchain no longer depends on the old `remarkable` runtime and now uses `markdown-it` with an updated `highlight.js`.

### Internal strictness and tooling

- `noImplicitAny` and `strictNullChecks` are enabled in the repository TypeScript config.
- Local declarations for legacy modules (`reactcss`, `tinycolor2`, selected `lodash/*` imports, icons, `material-colors`) were tightened to match actual usage without narrowing the public package API.

# Changelog

## Unreleased

### Compatibility and migration notes

- Published package compatibility remains drop-in for the upstream `react-color` entrypoints: `main`, `module`, root `index.d.ts`, and deep imports from `lib/` and `es/` are preserved.
- Library peer compatibility is now explicitly documented and enforced as `react >=16.8.0`.
- Root development dependencies for docs and Storybook intentionally stay on a newer React major than the package peer baseline. This is a repository-development constraint, not a published runtime requirement for consumers.
- The styling system now publishes aggregate and granular CSS entrypoints in both `lib/styles` and `es/styles`; consumers should explicitly import either `react-color/es/styles/index.css` or only the picker/common CSS files they use.
- `theme` and `classNames` are now the preferred public styling API, while `styles` remains available only as a deprecated compatibility layer for legacy inline overrides.

### User-visible DX changes

- Runtime `propTypes` were removed after the TypeScript migration. This does not change the published component API, but JavaScript consumers no longer get development-time prop validation warnings from `prop-types`.
- Storybook prop metadata is generated again through `react-docgen`.
- The docs toolchain no longer depends on the old `remarkable` runtime and now uses `markdown-it` with an updated `highlight.js`.
- Public docs now describe the `rc-*` BEM hooks, `theme="light" | "dark" | "auto"`, slot-level `classNames`, CSS custom properties, and migration guidance away from `styles` as the primary styling mechanism.

### Internal strictness and tooling

- `noImplicitAny` and `strictNullChecks` are enabled in the repository TypeScript config.
- Local declarations for legacy modules (`reactcss`, `tinycolor2`, selected `lodash/*` imports, icons, `material-colors`) were tightened to match actual usage without narrowing the public package API.

# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Initial CLI setup with commands for adding hooks, listing available hooks, and updating the library.
- Command to add new React hook(s) to the project.
- Command to list all available hooks.
- Command to update the @gibsonmurray/react-hooks library to the latest version.
- Command to display a message indicating successful installation of the CLI.
- Functionality to create a 'hooks' directory if it doesn't exist.
- Support for adding multiple hooks at once with dependency resolution.
- Interactive hook selection using inquirer when no specific hook is provided.
- Special handling for useFlipGSAP hook, warning about required libraries.
- Colorful console output using chalk for better user experience.

### Changed
- Updated the way hooks are imported and added to the project.
- Improved error handling and logging throughout the CLI.

### Fixed
- Ensured proper handling of hook dependencies when adding multiple hooks.

### Security

## [1.0.3] - 2024-07-24

-   Added warning for useFlipGSAP hook
-   Updated README.md
-   Added CHANGELOG.md

## [1.0.0] - 2024-07-24

-   Initial release of @gibsonmurray/ghooks-cli

# GHooks

GHooks is a command-line tool and React hooks library that allows you to easily add pre-built React hooks to your project.

## Table of Contents

- [GHooks](#ghooks)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
  - [Command-Line Usage](#command-line-usage)
    - [Add Hooks](#add-hooks)
    - [List Available Hooks](#list-available-hooks)
  - [Update Library \& CLI](#update-library--cli)
  - [Hooks Library](#hooks-library)
  - [Library Usage](#library-usage)
  - [CLI Implementation](#cli-implementation)
  - [Contributing](#contributing)
  - [License](#license)

## Installation

Install GHooks globally using your preferred package manager:

```bash
npm install -g @gibsonmurray/ghooks-cli
```

## Command-Line Usage

After installation, you can use the `ghooks` command in your terminal:

### Add Hooks

To add hooks interactively:

```bash
ghooks add
```

To add a specific hook by name:

```bash
ghooks add <hook-name>
```

### List Available Hooks

To list all available hooks:

```bash
ghooks list
```

## Update Library & CLI

To update the hooks in the project:

```bash
ghooks update
```

To upgrade the CLI to the latest version:

```bash
ghooks upgrade
```

## Hooks Library

The GHooks library provides the following hooks:

-   `useArray`
-   `useAsync`
-   `useClickOutside`
-   `useClipboard`
-   `useCookie`
-   `useDarkMode`
-   `useDebounce`
-   `useDebug`
-   `useDeepEffect`
-   `useDocumentTitle`
-   `useDragDrop`
-   `useEventListener`
-   `useFetch`
-   `useFlipGSAP`
-   `useForm`
-   `useGeolocation`
-   `useGlobalState`
-   `useHover`
-   `useIdle`
-   `useImageLoad`
-   `useKeyPress`
-   `useLockScroll`
-   `useLongPress`
-   `useMediaDevices`
-   `useMediaQuery`
-   `useMounted`
-   `useMouse`
-   `useOnlineStatus`
-   `useOnScreen`
-   `useOrientation`
-   `usePermission`
-   `usePrevious`
-   `useRenderCount`
-   `useScript`
-   `useSize`
-   `useStateHistory`
-   `useStateValidation`
-   `useLocalStorage`
-   `useSessionStorage`
-   `useTimeout`
-   `useToggle`
-   `useUnmounted`
-   `useUpdated`
-   `useWindowSize`

## Library Usage

You can also use the hooks directly in your React projects:

1. Install the library:

```bash
npm install @gibsonmurray/react-hooks
```

2. Import the hook you need:

```jsx
import { useDebounce } from "@gibsonmurray/react-hooks"
const MyComponent = () => {
    const [value, setValue] = useState("")
    const debouncedValue = useDebounce(value, 500)
    // ... rest of your component
}
```

## CLI Implementation

The GHooks CLI is implemented in the `index.ts` file, which provides the following functionality:

- **Adding Hooks**: Users can add hooks interactively or by specifying a hook name.
- **Listing Hooks**: Displays all available hooks from the repository.
- **Updating Hooks**: Updates existing hooks in the project to their latest versions.
- **Upgrading CLI**: Upgrades the GHooks CLI to the latest version.
- **Version Information**: Displays the current version of the CLI.

The CLI uses several dependencies:

- `commander`: For parsing command-line arguments and defining commands.
- `inquirer`: For interactive command-line user interfaces.
- `axios`: For making HTTP requests to fetch hook data.
- `chalk`: For colorful console output.
- `semver`: For semantic versioning comparisons.

The main commands implemented in `index.ts` are:

1. `ghooks add [hookName]`: Adds one or more hooks to the project.
2. `ghooks list`: Lists all available hooks.
3. `ghooks update`: Updates existing hooks in the project.
4. `ghooks upgrade`: Upgrades the GHooks CLI to the latest version.
5. `ghooks version`: Displays the current version of the CLI.

The CLI fetches hook data from the GitHub repository, ensuring that users always have access to the latest versions of the hooks.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

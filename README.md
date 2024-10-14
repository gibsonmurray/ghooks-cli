# GHooks

GHooks is a command-line tool and React hooks library that allows you to easily add pre-built React hooks to your project.

## Installation

Install GHooks globally using your preferred package manager:

```bash
npm install -g ghooks-cli
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

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

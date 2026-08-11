# Telegram Clone: Theme System (Light & Dark Mode)

This project uses a custom theme system built on top of Tailwind CSS and Redux Toolkit, providing a seamless Light and Dark mode experience.

## How it works

### 1. CSS Variables (`index.html`)
Instead of hardcoding hex colors directly into the Tailwind configuration, we use CSS variables (custom properties) in the `@layer base` of `index.html`. 

- `:root` contains the light mode colors.
- `.dark` contains the dark mode colors.

Tailwind is configured to read these variables using the `rgba(var(--color), <alpha-value>)` format, which allows us to use Tailwind's built-in opacity utilities (e.g., `bg-tg-900/50`).

### 2. Redux State (`themeSlice.ts`)
The `themeSlice` manages the current theme mode (`light` or `dark`). 
- On initial load, it checks `localStorage` for a saved preference.
- If no preference exists, it falls back to the user's system OS preference using `window.matchMedia`.
- Changing the theme dispatches `toggleTheme()`, which updates Redux state and `localStorage`.

### 3. Theme Application (`App.tsx`)
In the root `App.tsx` component, a `useEffect` hook listens to `mode` from the Redux store.
When `mode` changes, it adds or removes the `.dark` class from `document.documentElement` (`<html>` tag). This triggers the CSS variables to switch values instantly across the entire DOM tree.

### 4. UI Implementation
Components use classes like `bg-tg-800` and `text-tg-text-1`. Because these map to CSS variables in Tailwind, you do not need to write `dark:bg-tg-800`. The colors automatically shift!

## Adding new colors
1. Add the CSS variable to `:root` (Light) and `.dark` (Dark) in `index.html`. Provide the RGB comma-separated values (e.g., `255, 255, 255`).
2. Add the variable to `tailwind.config` in `index.html`.
3. Use the class in your React components!

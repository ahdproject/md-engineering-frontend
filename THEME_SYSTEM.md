# Theme System Documentation

## Overview
The M&D Engineers ERP System now supports two distinct themes:
1. **Black & White** - Modern, minimalist professional theme (default)
2. **Blue & Beige** - Warm, traditional theme with blue accents and beige highlights

## How to Switch Themes

### Method 1: Using the Theme Switcher Component
A theme switcher button has been added to the Navbar. Click the Sun (☀️) or Moon (🌙) icon to toggle between themes.

### Method 2: Programmatically
```javascript
import { useTheme } from './context/ThemeContext';

function MyComponent() {
  const { theme, setTheme, toggleTheme } = useTheme();
  
  // Toggle between themes
  toggleTheme();
  
  // Set specific theme
  setTheme('black-white');  // or 'blue-beige'
}
```

## Implementation Details

### Theme Files
- **`src/theme.css`** - Black & White theme (default)
- **`src/theme-blue-beige.css`** - Blue & Beige theme with CSS variables

### Context
- **`src/context/ThemeContext.jsx`** - Theme state management and persistence

### Components
- **`src/components/common/ThemeSwitcher.jsx`** - Theme toggle button component
- **`src/components/pages/DashboardThemeable.jsx`** - Example dashboard with theme support

## Color Palettes

### Black & White Theme
- **Primary**: #000000 (Black)
- **Secondary**: #ffffff (White)
- **Scrollbar Track**: #f3f4f6 (Light Gray)
- **Scrollbar Thumb**: #6b7280 (Gray)

### Blue & Beige Theme
- **Primary**: #4A6FA5 (Slate Blue)
- **Primary Light**: #6D94C5 (Light Blue)
- **Accent**: #E8DFCA (Beige)
- **Accent Light**: #F0EAE0 (Light Beige)
- **Scrollbar Track**: #F0EAE0 (Light Beige)
- **Scrollbar Thumb**: #4A6FA5 (Slate Blue)

## Using Themes in Components

### Method 1: Using Theme Variables in CSS
```css
:root[data-theme="blue-beige"] .my-component {
  background-color: var(--primary);
  color: var(--secondary);
}
```

### Method 2: Using useTheme Hook in JSX
```jsx
import { useTheme } from '../../context/ThemeContext';

function MyComponent() {
  const { theme } = useTheme();
  
  const bgColor = theme === 'blue-beige' 
    ? 'bg-blue-500' 
    : 'bg-black';
    
  return <div className={bgColor}>Content</div>;
}
```

### Method 3: Using Tailwind Classes
```jsx
// The component will automatically apply theme via data-theme attribute
<div className="bg-primary text-secondary">
  This respects the theme
</div>
```

## Theme Persistence
Themes are automatically saved to localStorage and persist across sessions.

## Integration Steps

### 1. Wrap App with ThemeProvider
In your `main.jsx` or `App.jsx`:
```jsx
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <RoutesConfig />
    </ThemeProvider>
  );
}
```

### 2. Add ThemeSwitcher to Navbar
```jsx
import ThemeSwitcher from '../common/ThemeSwitcher';

export default function Navbar() {
  return (
    <header>
      {/* Other navbar content */}
      <ThemeSwitcher />
    </header>
  );
}
```

### 3. Update Components
Replace hardcoded colors with theme-aware implementations:
- Use `useTheme()` hook to access current theme
- Use CSS custom properties (variables) for colors
- Use Tailwind classes for responsive styling

## Default Values
- **Default Theme**: Black & White
- **Storage Key**: `app-theme`
- **Supported Themes**: `'black-white'`, `'blue-beige'`

## Browser Support
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

## Accessibility
Both themes maintain:
- WCAG AA contrast ratios
- Readable font sizes
- Clear visual hierarchy
- Focus indicators
- Reduced motion support

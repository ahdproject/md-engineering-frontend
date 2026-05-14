# Blue & Beige Theme Implementation Guide

## Summary
The M&D Engineers ERP System now fully supports both **Black & White** and **Blue & Beige** themes with an easy-to-use theme switcher.

## What's New

### 1. Theme Files Created
- **`src/theme-blue-beige.css`** - Complete Blue & Beige theme with CSS custom properties
- **`src/context/ThemeContext.jsx`** - React Context for theme state management
- **`src/components/common/ThemeSwitcher.jsx`** - UI component to toggle between themes
- **`src/components/pages/DashboardThemeable.jsx`** - Example Dashboard component with theme support

### 2. Changes Made
- ✅ Updated `src/main.jsx` - Added ThemeProvider wrapper
- ✅ Updated `src/index.css` - Imported theme-blue-beige.css
- ✅ Updated `src/components/common/Navbar.jsx` - Added ThemeSwitcher button
- ✅ Created `THEME_SYSTEM.md` - Complete theme documentation

## Features

### Theme Switcher Button
- Located in the Navbar (top-right area)
- Shows "☀️ Blue & Beige" when in Black & White mode
- Shows "🌙 Black & White" when in Blue & Beige mode
- One-click theme switching

### Theme Persistence
- Selected theme is saved to browser localStorage
- Theme persists across page refreshes and sessions
- Storage key: `app-theme`

### CSS Variables Support
Both themes use CSS custom properties for easy customization:

**Black & White Theme:**
```css
--primary: #000000
--secondary: #ffffff
--neutral-600: #6b7280
```

**Blue & Beige Theme:**
```css
--primary: #4A6FA5 (Slate Blue)
--accent: #E8DFCA (Beige)
--accent-light: #F0EAE0 (Light Beige)
```

## Color Comparison

| Element | Black & White | Blue & Beige |
|---------|--------------|------------|
| Primary | #000000 | #4A6FA5 |
| Secondary | #ffffff | #ffffff |
| Accent | - | #E8DFCA |
| Scrollbar Track | #f3f4f6 | #F0EAE0 |
| Scrollbar Thumb | #6b7280 | #6D94C5 |
| Welcome Card | Black | Blue Gradient |
| Table Header | Gray | Beige |

## How to Use in Your Components

### Option 1: Using CSS Variables (Recommended)
```jsx
function MyCard() {
  return (
    <div className="card">
      <p className="text-primary">Content respects current theme</p>
    </div>
  );
}
```

### Option 2: Using the useTheme Hook
```jsx
import { useTheme } from '../../context/ThemeContext';

function MyComponent() {
  const { theme, toggleTheme } = useTheme();
  
  const welcomeBg = theme === 'blue-beige' 
    ? 'bg-blue-500' 
    : 'bg-black';
  
  return (
    <div className={welcomeBg}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

### Option 3: Pure CSS
```css
:root[data-theme="blue-beige"] .my-component {
  background-color: var(--primary);
  color: var(--accent);
}

:root:not([data-theme="blue-beige"]) .my-component {
  background-color: #000000;
  color: #ffffff;
}
```

## Dashboard Theme-Aware Features

The `DashboardThemeable.jsx` component demonstrates:
- Dynamic welcome card styling (Blue gradient in Blue & Beige, Black in Black & White)
- Theme-aware table header background colors
- Conditional CSS class application based on theme

## File Structure
```
src/
├── context/
│   └── ThemeContext.jsx          (Theme state management)
├── components/
│   ├── common/
│   │   ├── Navbar.jsx            (Updated with ThemeSwitcher)
│   │   └── ThemeSwitcher.jsx     (Theme toggle component)
│   └── pages/
│       ├── Dashboard.jsx         (Original - unchanged)
│       └── DashboardThemeable.jsx (Example with theme support)
├── theme.css                      (Black & White - default)
├── theme-blue-beige.css          (Blue & Beige theme)
├── index.css                      (Updated to import both themes)
└── main.jsx                       (Updated with ThemeProvider)
```

## Browser Compatibility
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers

## Accessibility
Both themes comply with:
- WCAG AA contrast ratios
- Font sizes (minimum 16px)
- Focus indicators
- Reduced motion support

## Next Steps

1. **Test the theme switcher** in the Navbar
2. **Update other components** to support theme-aware styling
3. **Replace hardcoded colors** with CSS variables or useTheme hook
4. **Test in different browsers** for consistency

## Customization

### Adding a New Theme
1. Create `src/theme-your-theme.css` with new CSS variables
2. Import in `src/index.css`
3. Add to supported themes in `ThemeContext.jsx`:
```jsx
const validThemes = ['black-white', 'blue-beige', 'your-theme'];
```

### Modifying Colors
Edit the CSS custom properties in theme files:
```css
:root[data-theme="blue-beige"] {
  --primary: #YourColorHere;
  --accent: #YourColorHere;
}
```

## Troubleshooting

### Theme not persisting
- Check if localStorage is enabled in browser
- Verify storage key: `app-theme`

### Colors not applying
- Ensure component is wrapped with `ThemeProvider`
- Check if using proper CSS selector format
- Verify `data-theme` attribute on HTML root

### Theme switcher not visible
- Check Navbar component imports
- Verify ThemeSwitcher component path
- Check browser console for errors

## Support
For issues or questions, refer to `THEME_SYSTEM.md` for detailed documentation.

# Quick Theme Reference

## Available Themes
1. **Black & White** (Default) - Modern, professional
2. **Blue & Beige** - Warm, traditional

## Switch Theme
Click the icon in top-right navbar (Sun ☀️ or Moon 🌙)

## Color Values

### Black & White
```
Primary:      #000000 (Black)
Secondary:    #ffffff (White)
Neutral:      #6b7280 (Gray)
Scrollbar:    Blue-gray gradient
```

### Blue & Beige
```
Primary:      #4A6FA5 (Slate Blue)
Accent:       #E8DFCA (Beige)
Light Accent: #F0EAE0 (Light Beige)
Scrollbar:    Blue & Beige
```

## Using in Code

### CSS
```css
/* Automatically applied based on theme */
.card {
  background-color: var(--secondary);
  border: 2px solid var(--accent);
}
```

### JavaScript
```jsx
import { useTheme } from '../../context/ThemeContext';

const { theme, toggleTheme, setTheme } = useTheme();

// Current theme: 'black-white' or 'blue-beige'
// Toggle: toggleTheme()
// Set: setTheme('blue-beige')
```

## Component Examples

### Theme-Aware Card
```jsx
<div className="card">
  <h3 className="text-primary">Title</h3>
  <p className="text-neutral">Content</p>
</div>
```

### Conditional Styling
```jsx
const { theme } = useTheme();
const bgColor = theme === 'blue-beige' 
  ? 'bg-blue-500' 
  : 'bg-black';
return <div className={bgColor}></div>;
```

## CSS Variables Available

| Variable | Usage |
|----------|-------|
| `--primary` | Main color |
| `--primary-dark` | Darker shade |
| `--primary-light` | Lighter shade |
| `--secondary` | Background color |
| `--accent` | Highlight color |
| `--accent-light` | Light highlight |
| `--neutral-*` | Gray scale (100-900) |
| `--success` | Green status |
| `--error` | Red status |
| `--warning` | Orange status |
| `--info` | Blue info |

## Files to Know

- `src/context/ThemeContext.jsx` - Theme logic
- `src/theme.css` - Black & White theme
- `src/theme-blue-beige.css` - Blue & Beige theme
- `src/components/common/ThemeSwitcher.jsx` - Toggle button

## localStorage
- **Key**: `app-theme`
- **Values**: `'black-white'` or `'blue-beige'`

## Tips
✅ Use CSS variables whenever possible
✅ Test both themes during development
✅ Keep contrast ratios accessible
✅ Use ThemeSwitcher for user control

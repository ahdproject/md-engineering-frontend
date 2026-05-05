# 🖤 Black & White Theme - Quick Reference

## Theme Colors

| Variable | Hex | Usage |
|----------|-----|-------|
| `--primary` | `#000000` | Buttons, headers, text |
| `--secondary` | `#ffffff` | Backgrounds, cards |
| `--neutral-100` | `#f9fafb` | Light backgrounds |
| `--neutral-200` | `#f3f4f6` | Table headers |
| `--neutral-300` | `#e5e7eb` | Borders, dividers |
| `--neutral-600` | `#6b7280` | Secondary text |
| `--neutral-900` | `#1f2937` | Dark text |

## Component Styles

### Sidebar
- Background: Black (`#000000`)
- Text: White (`#ffffff`)
- Active Item: White bg on black
- Border: Dark gray

### Navbar
- Background: White (`#ffffff`)
- Text: Black (`#000000`)
- Badge: Black bg, white text
- Border: Light gray

### Buttons
- Primary: Black bg, white text
- Secondary: Gray bg, black text
- Hover: Darker shade
- Disabled: 60% opacity

### Cards
- Background: White
- Border: 2px gray
- Shadow: Light
- Hover: Enhanced shadow

### Tables
- Header: Gray bg (`#f3f4f6`)
- Text: Black
- Border: Light gray
- Row Hover: Very light gray

### Forms
- Input: White bg, black text
- Border: Gray
- Focus: Black border + shadow
- Placeholder: Gray text

## CSS Usage

```css
/* Using Variables */
color: var(--primary);
background-color: var(--secondary);
border-color: var(--neutral-300);

/* Using Tailwind Classes */
className="bg-black text-white"
className="border-gray-200"
className="hover:bg-gray-100"
```

## Tailwind Equivalents

| Variable | Tailwind |
|----------|----------|
| `--primary` | `black` |
| `--secondary` | `white` |
| `--neutral-100` | `gray-50` |
| `--neutral-200` | `gray-100` |
| `--neutral-300` | `gray-200` |
| `--neutral-600` | `gray-600` |
| `--neutral-900` | `gray-900` |

## Files to Reference

- `src/theme.css` - All color variables
- `src/index.css` - Main styles
- `src/components/common/` - Component styling
- `src/components/pages/Dashboard.jsx` - Page example

## Deployment

```bash
# Local
npm run dev

# Production
git push
# Vercel auto-deploys
```

**Theme Complete! 🖤**

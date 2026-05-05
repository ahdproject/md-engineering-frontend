# 🎨 Black & White Theme - Visual Guide

## Color Palette

```
PRIMARY                    SECONDARY                  NEUTRALS
┌─────────────────┐       ┌─────────────────┐       ┌──────────────────┐
│                 │       │                 │       │                  │
│   BLACK         │       │   WHITE         │       │   GRAYS          │
│                 │       │                 │       │                  │
│  #000000        │       │  #FFFFFF        │       │  F9FAFB (50)    │
│                 │       │                 │       │  F3F4F6 (100)   │
│                 │       │                 │       │  E5E7EB (200)   │
│                 │       │                 │       │  D1D5DB (300)   │
│                 │       │                 │       │  9CA3AF (500)   │
│                 │       │                 │       │  6B7280 (600)   │
│                 │       │                 │       │  1F2937 (900)   │
└─────────────────┘       └─────────────────┘       └──────────────────┘
```

## Component Examples

### 1. Login Page

```
┌──────────────────────────────────────────────┐
│  ┌──────────────────────────────────────┐   │
│  │ ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■  │   │
│  │ ■  M&D ENGINEERS ERP            ■  │   │
│  │ ■  Sign in to your account      ■  │   │
│  │ ├──────────────────────────────────┤   │
│  │ │ Email Address                    │   │
│  │ │ ┌──────────────────────────────┐ │   │
│  │ │ │ admin@mdengineers.com     [i]│ │   │
│  │ │ └──────────────────────────────┘ │   │
│  │ │                                  │   │
│  │ │ Password                         │   │
│  │ │ ┌──────────────────────────────┐ │   │
│  │ │ │ •••••••••              [👁]  │ │   │
│  │ │ └──────────────────────────────┘ │   │
│  │ │                                  │   │
│  │ │ ┌──────────────────────────────┐ │   │
│  │ │ │ ► SIGN IN                    │ │   │
│  │ │ └──────────────────────────────┘ │   │
│  │ └──────────────────────────────────┘   │
│  │ © 2026 M&D Engineers Private Limited    │
│  └──────────────────────────────────────┘   │
└──────────────────────────────────────────────┘
```

### 2. Dashboard Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ ■ M&D ERP    │ Dashboard                    Tuesday... [Admin]  │
│ ■ System     └─────────────────────────────────────────────────┘
│ ─────────────┌────────────────────────────────────────────────┐
│ • Dashboard  │ ║ Welcome back, Admin ║  (Black Header)         │
│ • Users      │ ║ Admin · M&D Engineers ║                       │
│ • Chemicals  ├────────────────────────────────────────────────┤
│ • Stock      │ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────┐
│ • Employees  │ │  Total   │ │  Stock   │ │  Monthly │ │Total │
│ • Attendance │ │Chemicals │ │ Entries  │ │  Sales   │ │ GST  │
│ • Salary     │ │   27  [⚗] │ │   1   [📦]│ │ ₹28K [📈] │ │₹5K [👤]
│ • Loans      │ └──────────┘ └──────────┘ └──────────┘ └──────┘
│ • Expenses   ├────────────────────────────────────────────────┤
│ ─────────────│ May 2026 — Chemical Summary                    │
│ [A] Admin    │ ┌───────┬──────┬────────┬───────┬─────┬───┬──┐
│ [Logout]     │ │Chem   │Unit  │Purchas │Used   │Sale │GST│Tot│
│              │ ├───────┼──────┼────────┼───────┼─────┼───┼──┤
│              │ │BK67 A │ltr   │100.00  │0.00   │₹228K│₹5K│33K
│              │ ├───────┼──────┼────────┼───────┼─────┼───┼──┤
│              │ │...    │...   │...     │...    │...  │...│...
│              │ └───────┴──────┴────────┴───────┴─────┴───┴──┘
│              └────────────────────────────────────────────────┘
└─────────────────────────────────────────────────────────────────┘
```

### 3. Color Usage by Component

```
SIDEBAR COLORS                NAVBAR COLORS
┌──────────────────────┐      ┌──────────────────────┐
│ ■ M&D ERP            │      │ Dashboard [● ADMIN]  │
│ ■ System             │      │ Tuesday, 5 May 2026  │
│                      │      └──────────────────────┘
│ ○ Dashboard ○        │      
│   (White on Black)   │      STAT CARDS
│                      │      ┌──────────────┐
│ ○ Users              │      │ Total (27) ⚗ │ (White Card)
│ ○ Chemicals          │      └──────────────┘
│ ○ Stock Entry        │      
│ ○ Employees          │      TABLE HEADERS
│ ○ Attendance         │      ┌──────────────┐
│ ○ Salary             │      │ Column Names │ (Gray)
│ ○ Loans              │      ├──────────────┤
│ ○ Expenses           │      │ Data Row 1   │ (White)
│                      │      ├──────────────┤
│ [A] Admin            │      │ Data row 2   │ (White)
│ Admin                │      └──────────────┘
│ 
│ [Logout]             │      BUTTONS
│ (Red text)           │      ┌──────────────┐
│                      │      │ ■ SIGN IN    │ (Black bg)
└──────────────────────┘      └──────────────┘
```

## Text Colors Usage

```
HIERARCHY EXAMPLE:

┌─────────────────────────────┐
│                             │
│ MAIN HEADING (Black)        │ ← #000000
│ Main page heading           │
│                             │
│ Secondary Text (Black)      │ ← #000000 (slightly smaller)
│ Important information       │
│                             │
│ Secondary Text (Gray)       │ ← #6B7280
│ Less important information  │
│                             │
│ Placeholder Text (Gray)     │ ← #9CA3AF
│ Input field placeholders    │
│                             │
│ Caption (Dark Gray)         │ ← #4B5563
│ Image captions, hints       │
│                             │
└─────────────────────────────┘
```

## Interactive States

```
BUTTON STATES:

Normal State:                 Hover State:
┌─────────────────┐          ┌─────────────────┐
│ SIGN IN         │          │ SIGN IN         │
│ (Black #000000) │          │ (Darker #1a1a1a)│
│ White text      │          │ White text      │
└─────────────────┘          └─────────────────┘
   ↓                            ↓
Disabled State:               Focus State:
┌─────────────────┐          ┌─────────────────┐
│ SIGNING IN...   │          │ SIGN IN         │
│ (Gray 60%       │          │ (Black #000000) │
│  opacity)       │          │ ◆ Black outline │
└─────────────────┘          └─────────────────┘


INPUT FIELD STATES:

Normal:                      Focused:
┌─────────────────┐          ┌─────────────────┐
│ [             ] │          │ [             ] │
│ Border: #e5e7eb │          │ Border: #000000 │
│ Background: ▪ ▪▪│          │ Ring: Black     │
└─────────────────┘          └─────────────────┘

Error:
┌─────────────────┐
│ [             ] │
│ Border: #ef4444 │ (Red)
│ Background: ▪ ▪▪│
└─────────────────┘
```

## Responsive Preview

```
DESKTOP (1920px)          TABLET (768px)         MOBILE (375px)
┌──────────────────┐     ┌────────────┐         ┌─────────┐
│ SIDE NAV │ MAIN  │     │ SIDE│ MAIN │         │ ≡ MAIN  │
│ 240px   │       │     │NAV │       │         │ 56px    │
│         │ 1440px       │ 150│ 618px │         │ 319px   │
│         │              │px  │       │         │         │
│ Black   │ White        │ Black     White      │ Mobile  │
│ Theme   │ Content      │ Theme on  Content    │ First   │
│ Shows   │ Full Width   │ Collapse  Visible    │ Design  │
└──────────────────┘     └────────────┘         └─────────┘
```

## Theme Consistency Checklist

```
✅ COLORS
   ✓ Black (#000000) for primary actions
   ✓ White (#ffffff) for backgrounds
   ✓ Grays (#f3f4f6-#1f2937) for variations
   ✓ Red (#ef4444) for errors only

✅ TYPOGRAPHY
   ✓ Poppins font family
   ✓ Font weights: 300-800
   ✓ Line height: 1.6

✅ SPACING
   ✓ Consistent padding
   ✓ Grid-based layout
   ✓ Responsive gaps

✅ COMPONENTS
   ✓ Rounded corners (0.75rem typical)
   ✓ Border widths (2px standard)
   ✓ Shadow: Light to medium
   ✓ Transitions: 0.3s ease

✅ ACCESSIBILITY
   ✓ Contrast ratio: 7:1 (AAA)
   ✓ Focus states visible
   ✓ Error messages clear
   ✓ Print styles optimized
```

---

**Your M&D Engineers ERP has a professional, consistent black and white theme!** 🖤

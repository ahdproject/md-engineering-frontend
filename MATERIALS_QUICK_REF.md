# Materials Masters - Quick Reference

## 🗂️ File Location
```
src/components/pages/Materials.jsx
```

## 🔗 Routes & Navigation

### URL Path
```
/materials
```

### Sidebar Link
```
Materials (Package Icon 📦)
→ Located at position 4 in navigation menu
→ Between Chemicals and Stock Entry
```

### Access
- Sidebar navigation: Click "Materials"
- Direct URL: `http://localhost:5173/materials`
- Requires login and authentication

## 🎯 What It Does

| Action | How To | API Call |
|--------|--------|----------|
| View All | Page loads automatically | `getMaterialsApi()` |
| Add New | Click "Add Material" button | `createMaterialApi(data)` |
| Edit | Click blue Edit icon (✏️) | `updateMaterialApi(id, data)` |
| Delete | Click red Delete icon (🗑️) | `deleteMaterialApi(id)` |

## 📋 Form Fields

```
Material Name     → Text field (Required)
Unit              → Dropdown (kgs, nos, ltrs, mtrs, pcs)
Default Rate      → Number with decimals (Required)
HSN Code          → Text field (Optional)
GST Rate          → Number in percent (Default: 18%)
```

## 📊 Table Display

| Column | Shows | Format |
|--------|-------|--------|
| Name | Material name | Text |
| Unit | Measurement unit | kgs, nos, ltrs, etc. |
| Default Rate | Price | ₹XX.XX |
| HSN Code | Tax code | Code or - |
| GST Rate | Tax percentage | XX% |
| Status | Active/Inactive | Badge with icon |
| Actions | Edit/Delete | Button icons |

## 🎨 Visual Elements

### Colors
- **Sidebar**: Black background, white text
- **Table Header**: Gray background (#f3f4f6)
- **Buttons**: 
  - Add/Create/Update: Black (#000000)
  - Edit: Blue (#3b82f6)
  - Delete: Red (#ef4444)
  - Cancel: Gray (#d1d5db)

### Icons
- Package: Materials in navigation
- Edit (✏️): Modify material
- Delete (🗑️): Remove material
- Eye: Material is active
- EyeOff: Material is inactive

## 💾 Data Storage

| Field | Type | Size | Notes |
|-------|------|------|-------|
| id | Integer | - | Auto-generated |
| name | String | 100 chars | Unique, required |
| unit | String | - | Enum: kgs, nos, ltrs, mtrs, pcs |
| default_rate | Decimal | 12,2 | Currency format |
| hsn_code | String | 8 chars | Optional |
| gst_rate | Decimal | 5,2 | Percentage |
| is_active | Boolean | - | True/False |

## 🔄 Workflow

```
1. Open Materials page
   ↓
2. View existing materials in table
   ↓
3. Choose action:
   → Add Material    → Click "Add Material" button
   → Edit Material   → Click Edit icon
   → Delete Material → Click Delete icon
   ↓
4. Fill form (for Add/Edit)
   ↓
5. Submit form
   ↓
6. API processes request
   ↓
7. Success message shown
   ↓
8. Table refreshes automatically
```

## ⚙️ Component Imports

```javascript
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { 
  getMaterialsApi, 
  createMaterialApi, 
  updateMaterialApi, 
  deleteMaterialApi 
} from '../../services/repository/masterRepository';
```

## 🚨 Error Handling

| Error | Cause | Solution |
|-------|-------|----------|
| Failed to fetch materials | API error | Check backend connection |
| Failed to save material | Validation error | Check all required fields |
| Failed to delete material | API error | Try again or contact admin |
| No materials found | Empty database | Create first material |

## ✅ Status Messages

```
✓ Material updated successfully     (Green alert)
✓ Material added successfully       (Green alert)
✓ Material deleted successfully     (Green alert)
✗ Failed to fetch materials         (Red alert)
✗ Failed to save material           (Red alert)
✗ Failed to delete material         (Red alert)
```

## 📱 Responsive Breakpoints

| Size | Behavior |
|------|----------|
| Desktop (1024px+) | Full table, side-by-side form |
| Tablet (768px-1024px) | Scrollable table, stacked form |
| Mobile (<768px) | Scrollable table, stacked form |

## 🔐 Security

- Requires authentication (JWT token)
- Protected route - automatic redirect if not logged in
- CSRF protection via backend
- Input validation on frontend and backend

## 📊 Uses In System

Materials are used by:
- Stock Entry module (selecting materials for stock)
- Inventory management
- Cost calculations
- GST tax computation
- Billing and invoicing

## 🔗 Related Pages

- **Dashboard**: Summary of all materials
- **Stock Entry**: Select from materials for inventory
- **Users**: Manage who can access materials
- **Chemicals**: Similar master data management

## 💡 Tips

- Always add materials before creating stock entries
- GST rates affect final cost calculations
- Keep HSN codes updated for tax compliance
- Use consistent units for same material type
- Mark materials as inactive instead of deleting for history

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Page not loading | Check internet connection |
| Form won't submit | Verify all required fields filled |
| Material doesn't delete | Check if used in other modules |
| Table empty | No materials created yet, click Add |
| Buttons not responding | Check browser console for errors |

---

**Status**: ✅ Fully Functional
**Last Updated**: 14 May 2026

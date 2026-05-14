# Materials Masters - Complete Overview

## 📍 WHERE IS IT?

### File Location
```
M and D Engineering Frontend/
└── md-engineers-frontend/
    └── src/
        └── components/
            └── pages/
                └── Materials.jsx  ← HERE!
```

### How to Access
1. **Via Sidebar**: Click "Materials" (📦 Package icon) in left navigation
2. **Via URL**: `http://localhost:5173/materials` (after login)
3. **Via Code**: Import from `./components/pages/Materials`

### Navigation Path
```
Sidebar Menu Order:
1. Dashboard
2. User Management
3. Chemicals
4. Materials          ← 4TH ITEM
5. Stock Entry
6. Employees
7. Attendance
8. Salary
9. Loans
10. Expenses
```

## 🎯 What is it?

A complete **Material Master Data Management** page for the ERP system that allows:
- ✅ View all materials in a table
- ✅ Create new materials with a form
- ✅ Edit existing materials
- ✅ Delete materials
- ✅ Filter by active/inactive status
- ✅ Real-time form validation
- ✅ Error and success notifications

## 📊 Key Information

### Form Fields
```
Material Name       → Required, Text
Unit                → Required, Select (kgs/nos/ltrs/mtrs/pcs)
Default Rate        → Required, Decimal (₹ currency)
HSN Code            → Optional, Text (up to 8 chars)
GST Rate            → Default 18%, Decimal (%)
```

### Table Columns
```
Name | Unit | Default Rate | HSN Code | GST Rate | Status | Actions
```

### Status Indicators
- 🟢 **Active** - Material in use (green badge with eye icon)
- ⚪ **Inactive** - Material not in use (gray badge with eye-off icon)

## 🔧 Technical Details

### Component Type
- **React Functional Component** with Hooks
- **State Management**: React useState
- **Side Effects**: useEffect for data fetching
- **Styling**: Tailwind CSS + Lucide React Icons

### API Integration
```javascript
getMaterialsApi()           // Fetch all materials
createMaterialApi(data)     // Create new material
updateMaterialApi(id, data) // Update material
deleteMaterialApi(id)       // Delete material
```

### Libraries Used
- `lucide-react` - For icons (Edit2, Trash2, Eye, EyeOff, Plus)
- `react` - Core framework
- Tailwind CSS - Styling

## 🔄 How It Works

```
Step 1: Page Loads
        ↓
Step 2: useEffect triggers fetchMaterials()
        ↓
Step 3: API call gets all materials
        ↓
Step 4: Materials displayed in table
        ↓
Step 5: User interaction (click Add/Edit/Delete)
        ↓
Step 6: Form shows or API call executes
        ↓
Step 7: Success/Error message displayed
        ↓
Step 8: Table refreshes automatically
```

## 🎨 Styling Characteristics

### Theme
- **Default**: Black & White professional theme
- **Responsive**: Supports Blue & Beige theme (via theme switcher)
- **Layout**: Clean, modern table-based interface

### Colors (Black & White Theme)
- **Primary**: Black (#000000)
- **Background**: White (#ffffff)
- **Borders**: Light Gray (#e5e7eb)
- **Edit Button**: Blue (#3b82f6)
- **Delete Button**: Red (#ef4444)
- **Active Status**: Green (#10b981)
- **Inactive Status**: Gray (#6b7280)

### Responsive Design
- **Desktop**: Full width table with all columns
- **Tablet**: Scrollable table, compact spacing
- **Mobile**: Scrollable table, stacked form fields

## 📋 Form Actions

### Add Material
1. Click "Add Material" button
2. Form appears below header
3. Fill in all required fields
4. Click "Create" button
5. Form closes, table refreshes

### Edit Material
1. Click blue Edit icon (✏️) in table row
2. Form shows with material data pre-filled
3. Modify any fields
4. Click "Update" button
5. Form closes, table refreshes

### Delete Material
1. Click red Delete icon (🗑️) in table row
2. Confirmation dialog appears
3. Click "OK" to confirm
4. Material deleted, table refreshes

## 🔐 Access Control

| Requirement | Details |
|------------|---------|
| Authentication | Required (JWT token) |
| Protected Route | Yes (redirects to login if not authenticated) |
| Role-based | Yes (admin/authorized users only) |
| Session | Persistent across page navigation |

## 💾 Data Persistence

- **Backend**: PostgreSQL database (materials_master table)
- **Frontend**: React state (resets on page refresh)
- **Caching**: None (fresh data on each page load)
- **Storage Key**: Not stored in localStorage

## 🚀 Key Features

### ✅ Full CRUD Operations
- Create, Read, Update, Delete materials

### ✅ Real-time Validation
- Required field checking
- Format validation (decimal numbers, etc.)

### ✅ User Feedback
- Success messages (green)
- Error messages (red)
- Loading indicators

### ✅ Responsive Design
- Works on desktop, tablet, mobile
- Scrollable tables on small screens
- Touch-friendly buttons and inputs

### ✅ Error Handling
- Try-catch blocks for all API calls
- User-friendly error messages
- Graceful fallbacks

## 📈 Usage Statistics

| Metric | Value |
|--------|-------|
| Total Materials (from DB) | 10 (sample) |
| Form Fields | 5 |
| Table Columns | 7 |
| Action Buttons | 3 (Add, Edit, Delete) |
| Status Options | 2 (Active, Inactive) |
| Unit Options | 5 (kgs, nos, ltrs, mtrs, pcs) |

## 🔍 Related Components

```
Materials.jsx
    ├─ Sidebar.jsx (navigation link)
    ├─ Navbar.jsx (page header)
    ├─ Layout.jsx (page container)
    ├─ Loader.jsx (loading indicator)
    └─ masterRepository.js (API calls)
```

## 🔗 Dependencies

### External
```javascript
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
```

### Internal
```javascript
import { 
  getMaterialsApi, 
  createMaterialApi, 
  updateMaterialApi, 
  deleteMaterialApi 
} from '../../services/repository/masterRepository';
import Loader from '../common/Loader';
```

## 📝 Code Example

### Creating a Material Programmatically
```javascript
const materialData = {
  name: "Steel Bars",
  unit: "kgs",
  default_rate: "45.00",
  hsn_code: "7214",
  gst_rate: 5
};

const response = await createMaterialApi(materialData);
```

### Fetching Materials
```javascript
const response = await getMaterialsApi();
const materials = response.data.data?.materials || [];
```

## 🎯 Common Tasks

### View Materials
1. Open Materials page
2. Table loads automatically
3. View all materials with details

### Add Material for Stock
1. Note the material name and unit
2. Create stock entry
3. Select material from dropdown

### Update Rate
1. Click Edit on material row
2. Change default_rate field
3. Click Update
4. New rate applied to future entries

### Deactivate Material
1. Material status field controls active/inactive
2. Inactive materials can still be viewed
3. Can be reactivated anytime

## 💡 Best Practices

✅ **DO:**
- Add all materials before starting stock entries
- Keep HSN codes updated for tax purposes
- Use consistent unit types
- Mark as inactive instead of deleting (preserves history)
- Review and update rates regularly

❌ **DON'T:**
- Delete materials if used in historical data
- Change unit of existing material mid-project
- Leave HSN code blank for tax compliance
- Mix unit types for same material
- Skip GST rate configuration

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Page blank/loading | Check internet, wait for API response |
| Form won't submit | Ensure all required fields (name, unit, rate) filled |
| Can't delete | Material may be used in other modules |
| Duplicate name error | Material name must be unique |
| Numbers not accepting decimals | Should work with step="0.01" |

## 📞 Support

For issues:
1. Check console for error messages (F12)
2. Verify backend API is running
3. Ensure you're logged in
4. Check user permissions
5. Clear browser cache if needed

## 🏆 Summary

**Materials Masters** is a critical module for:
- ✅ Managing all raw materials in inventory
- ✅ Setting standard rates for costing
- ✅ Maintaining tax compliance (HSN codes)
- ✅ Supporting stock entry and billing operations

---

**Status**: ✅ Fully Functional & Documented
**Last Updated**: 14 May 2026
**Version**: 1.0
**Page Type**: Master Data Management
**Access Level**: Admin/Authorized Users

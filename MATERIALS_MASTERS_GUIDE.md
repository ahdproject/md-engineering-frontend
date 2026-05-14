# Materials Masters - Location & Documentation

## 📍 Location

**File Path:**
```
/Users/devanshu/Desktop/M and D Engineering Frontend/md-engineers-frontend/
└── src/
    └── components/
        └── pages/
            └── Materials.jsx
```

## 🔗 Accessibility

### Via Sidebar Navigation
- **Label**: "Materials" with Package icon (📦)
- **Route**: `/materials`
- **Position**: 4th item in left sidebar navigation

### Via URL
```
http://localhost:5173/materials
```

### Via Routing Config
Located in: `src/RoutesConfig.jsx`
```jsx
import Materials from './components/pages/Materials';

<Route path="/materials" element={<Materials />} />
```

## 🎯 Features

The Materials Masters page provides full CRUD operations for material management:

### Features Included:
1. **View Materials** - Paginated table display
2. **Add Material** - Create new materials with form
3. **Edit Material** - Modify existing materials
4. **Delete Material** - Remove materials
5. **Status Toggle** - Active/Inactive indicator
6. **Search/Filter** - Table display with sorting
7. **Form Validation** - Required fields validation
8. **Error Handling** - User feedback on failures
9. **Success Messages** - Confirmation on operations

### Form Fields:
- **Material Name** - Text (Required)
- **Unit** - Dropdown: kgs, nos, ltrs, mtrs, pcs
- **Default Rate** - Number (Required, 2 decimals)
- **HSN Code** - Text (Optional)
- **GST Rate** - Number (%, default 18)

### Table Columns:
1. Name
2. Unit
3. Default Rate (₹)
4. HSN Code
5. GST Rate (%)
6. Status (Active/Inactive)
7. Actions (Edit, Delete)

## 🔌 API Integration

### API Endpoints Used:
```javascript
// From: src/services/repository/masterRepository.js

getMaterialsApi()           // GET /api/materials
createMaterialApi(data)     // POST /api/materials
updateMaterialApi(id, data) // PUT /api/materials/:id
deleteMaterialApi(id)       // DELETE /api/materials/:id
```

## 🎨 Styling

- **Theme**: Black & White (responsive to theme switcher)
- **Layout**: Clean, professional table-based interface
- **Colors**:
  - Primary: Black (#000000)
  - Background: White (#ffffff)
  - Borders: Light Gray (#e5e7eb)
  - Hover: Light Gray (#f9fafb)
  - Active: White background
  - Edit Button: Blue (#3b82f6)
  - Delete Button: Red (#ef4444)

## 📱 Responsive Design

- **Desktop**: Full table view with all columns
- **Tablet**: Scrollable table with reduced padding
- **Mobile**: Stackable form, scrollable table

## ✅ Status Indicators

- **Active**: Green badge with Eye icon
- **Inactive**: Gray badge with EyeOff icon

## 🔐 Access Control

- **Protected Route**: Yes (requires authentication)
- **Required Role**: Admin/Authorized user
- **Authentication**: JWT token via Protected Route component

## 🚀 Usage Example

### Accessing the Page:
1. Login to the system
2. Click "Materials" in the left sidebar
3. View all materials in the table
4. Click "Add Material" button to create new material
5. Fill the form and click "Create" or "Update"
6. Click Edit icon to modify existing material
7. Click Delete icon to remove material

### Creating a Material:
```javascript
{
  "name": "Steel Bars",
  "unit": "kgs",
  "default_rate": "45.00",
  "hsn_code": "7214",
  "gst_rate": 5
}
```

## 🔄 State Management

- **Local State**: React useState for form and table data
- **Async Operations**: Async/await with error handling
- **Loading State**: Loader component shown while fetching
- **Error Messages**: Red alert boxes for errors
- **Success Messages**: Green alert boxes for confirmations

## 📊 Data Flow

```
Materials.jsx
    ↓
useEffect → fetchMaterials()
    ↓
getMaterialsApi() → Backend API
    ↓
Set materials state
    ↓
Render table with materials
    ↓
User interactions (Add/Edit/Delete)
    ↓
API calls → Update backend
    ↓
Refresh materials list
    ↓
Update UI with success/error messages
```

## 🛠️ Component Structure

```jsx
Materials Component
├── State Management
│   ├── materials (array)
│   ├── loading (boolean)
│   ├── showForm (boolean)
│   ├── editId (null or id)
│   ├── formData (object)
│   ├── error (string)
│   └── success (string)
├── Effects
│   └── fetchMaterials on mount
├── Event Handlers
│   ├── handleSubmit (create/update)
│   ├── handleEdit (load for editing)
│   ├── handleDelete (remove)
│   └── resetForm (clear form)
└── Render
    ├── Header with title and Add button
    ├── Error/Success messages
    ├── Add/Edit Form (conditional)
    └── Materials Table with Actions
```

## 🎯 Key Functions

### fetchMaterials()
Fetches all materials from backend
```javascript
const fetchMaterials = async () => {
  try {
    const { data } = await getMaterialsApi();
    setMaterials(data.data?.materials || []);
  } catch (err) {
    setError('Failed to fetch materials');
  }
}
```

### handleSubmit()
Creates new or updates existing material
```javascript
const handleSubmit = async (e) => {
  if (editId) {
    await updateMaterialApi(editId, formData);
  } else {
    await createMaterialApi(formData);
  }
  fetchMaterials();
}
```

### handleDelete()
Removes material after confirmation
```javascript
const handleDelete = async (id) => {
  if (!window.confirm('Are you sure?')) return;
  await deleteMaterialApi(id);
  fetchMaterials();
}
```

## 📝 Notes

- Materials are used in Stock Entry and other modules
- Default Rate is used for calculations
- GST Rate affects total cost calculations
- HSN Code is for tax classification
- Unit selection determines measurement type (kgs, nos, etc.)
- Materials can be marked Active/Inactive for workflow control

## 🔍 Related Components

- **Sidebar.jsx** - Navigation menu linking to Materials
- **Layout.jsx** - Page container wrapping the Materials page
- **Loader.jsx** - Loading indicator while fetching data
- **masterRepository.js** - API calls for materials operations

## 📚 Documentation Files

For complete system documentation, see:
- `THEME_SYSTEM.md` - Theme documentation
- `BLUE_BEIGE_THEME_GUIDE.md` - Theme usage guide
- `THEME_QUICK_REF.md` - Quick theme reference

---

**Page Status**: ✅ Fully Functional
**Last Updated**: 14 May 2026
**Version**: 1.0

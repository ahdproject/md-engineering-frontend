# Materials Masters - Visual Architecture & Flow

## 📍 Directory Structure

```
M and D Engineering Frontend/
│
└── md-engineers-frontend/
    │
    └── src/
        │
        ├── components/
        │   │
        │   ├── common/
        │   │   ├── Navbar.jsx          (Top navigation)
        │   │   ├── Sidebar.jsx         (Left menu with Materials link)
        │   │   ├── Layout.jsx          (Page container)
        │   │   └── Loader.jsx          (Loading indicator)
        │   │
        │   └── pages/
        │       ├── Materials.jsx       ← MAIN FILE (223 lines)
        │       ├── Dashboard.jsx
        │       ├── ChemicalMasters.jsx
        │       ├── StockEntry.jsx
        │       └── ... (other pages)
        │
        ├── services/
        │   └── repository/
        │       └── masterRepository.js (API calls)
        │
        ├── RoutesConfig.jsx            (Route definitions)
        └── main.jsx                    (App entry point)
```

## 🔗 Component Hierarchy

```
App (main.jsx)
│
├─ ThemeProvider
│  │
│  ├─ BrowserRouter
│  │  │
│  │  └─ RoutesConfig
│  │     │
│  │     ├─ ProtectedRoute (checks auth)
│  │     │  │
│  │     │  └─ Layout (page container)
│  │     │     │
│  │     │     ├─ Navbar (header)
│  │     │     │  └─ ThemeSwitcher
│  │     │     │
│  │     │     ├─ Sidebar (navigation)
│  │     │     │  └─ Links including /materials
│  │     │     │
│  │     │     └─ Route Content
│  │     │        │
│  │     │        └─ Materials.jsx  ← HERE!
│  │     │           ├─ Header (title + Add button)
│  │     │           ├─ Messages (error/success)
│  │     │           ├─ Form (when showForm = true)
│  │     │           └─ Table (materials list)
│  │     │
│  │     └─ Other Routes (/users, /chemicals, etc.)
```

## 🎯 Page Routing

```
Login Page (/login)
    ↓
Authentication Check
    ↓
Authenticated?
    ├─ YES → Protected Routes
    │        │
    │        └─ Layout Wrapper
    │           │
    │           ├─ Sidebar Navigation
    │           │  └─ Materials Link
    │           │     ↓
    │           │  [Click Materials]
    │           │     ↓
    │           └─ Materials.jsx Page
    │
    └─ NO → Redirect to Login
```

## 📊 Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Materials.jsx                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  STATE:                                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ • materials: []                                     │   │
│  │ • loading: false                                    │   │
│  │ • showForm: false                                   │   │
│  │ • editId: null                                      │   │
│  │ • formData: {name, unit, rate, hsn, gst}          │   │
│  │ • error: ""                                         │   │
│  │ • success: ""                                       │   │
│  └─────────────────────────────────────────────────────┘   │
│                          ↓                                  │
│  ON MOUNT (useEffect):                                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ fetchMaterials()                                    │   │
│  │    ↓                                                │   │
│  │ getMaterialsApi()                                   │   │
│  │    ↓ (HTTP GET)                                     │   │
│  │ Backend /api/materials                             │   │
│  │    ↓ (JSON response)                                │   │
│  │ setMaterials(data)                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                          ↓                                  │
│  RENDER UI:                                                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ Header (title + "Add Material" button)             │   │
│  │    ↓                                                │   │
│  │ Messages (error/success alerts)                    │   │
│  │    ↓                                                │   │
│  │ Form (conditional - if showForm)                   │   │
│  │    ↓                                                │   │
│  │ Table (materials list)                             │   │
│  │    ├─ Edit Button → handleEdit() → showForm=true  │   │
│  │    ├─ Delete Button → handleDelete() → API call   │   │
│  │    └─ Form Submit → handleSubmit() → API call     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 User Action Flows

### FLOW 1: View Materials
```
User Opens Materials Page
    ↓
useEffect runs
    ↓
fetchMaterials()
    ↓
GET /api/materials
    ↓
API returns materials array
    ↓
setMaterials(array)
    ↓
Component re-renders
    ↓
Table displays all materials
```

### FLOW 2: Add Material
```
User Clicks "Add Material"
    ↓
setShowForm(true)
    ↓
Form appears with empty fields
    ↓
User fills form fields
    ↓
onChange events update formData state
    ↓
User clicks "Create"
    ↓
handleSubmit(e) → e.preventDefault()
    ↓
createMaterialApi(formData)
    ↓
POST /api/materials (formData)
    ↓
Backend creates material
    ↓
Returns success response
    ↓
setSuccess message
    ↓
resetForm() → setShowForm(false)
    ↓
fetchMaterials() (refresh table)
    ↓
Table updates with new material
```

### FLOW 3: Edit Material
```
User Clicks Edit Icon (✏️)
    ↓
handleEdit(material)
    ↓
setFormData(material) → pre-fill form
    ↓
setEditId(material.id)
    ↓
setShowForm(true)
    ↓
Form shows with data
    ↓
User modifies fields
    ↓
onChange events update formData
    ↓
User clicks "Update"
    ↓
handleSubmit(e)
    ↓
updateMaterialApi(editId, formData)
    ↓
PUT /api/materials/:id (formData)
    ↓
Backend updates material
    ↓
setSuccess message
    ↓
resetForm() → close form
    ↓
fetchMaterials() (refresh)
    ↓
Table updates
```

### FLOW 4: Delete Material
```
User Clicks Delete Icon (🗑️)
    ↓
handleDelete(id)
    ↓
window.confirm() → show dialog
    ↓
User clicks OK
    ↓
deleteMaterialApi(id)
    ↓
DELETE /api/materials/:id
    ↓
Backend deletes material
    ↓
setSuccess message
    ↓
fetchMaterials() (refresh)
    ↓
Table updates
```

## 📡 API Communication

```
Frontend (React)              Backend (Node/Express)       Database (PostgreSQL)
    │                               │                           │
    ├─ GET /api/materials  ────────→│──── SELECT * ────────────→│
    │                               │                           │
    │                               │←─ materials array ←────────│
    │←──────── JSON response ─────────│                           │
    │                               │                           │
    ├─ POST /api/materials ────────→│──── INSERT ──────────────→│
    │   (create data)               │                           │
    │                               │←── success response ──────│
    │←──────── {id, ...} ───────────→│                           │
    │                               │                           │
    ├─ PUT /api/materials/:id ─────→│──── UPDATE ──────────────→│
    │   (modified data)             │                           │
    │                               │←── success response ──────│
    │←──────── {updated} ───────────→│                           │
    │                               │                           │
    ├─ DELETE /api/materials/:id ──→│──── DELETE ──────────────→│
    │                               │                           │
    │                               │←── success response ──────│
    │←──────── {success} ───────────→│                           │
```

## 🎨 UI Layout

```
┌────────────────────────────────────────────────────────────────────┐
│                          NAVBAR                                   │
│  Dashboard        [Theme Button]                [Admin Badge]     │
└────────────────────────────────────────────────────────────────────┘

┌──────────────────┬──────────────────────────────────────────────────┐
│                  │                                                  │
│    SIDEBAR       │  CONTENT AREA - Materials Page                 │
│                  │  ┌──────────────────────────────────────────┐  │
│ • Dashboard      │  │ Materials Master          [Add Material] │  │
│ • Users          │  └──────────────────────────────────────────┘  │
│ • Chemicals      │                                                 │
│ • Materials ← ✓  │  ┌──────────────────────────────────────────┐  │
│ • Stock Entry    │  │ Success: Material added successfully     │  │
│ • Employees      │  └──────────────────────────────────────────┘  │
│ • Attendance     │                                                 │
│ • Salary         │  ┌──────────────────────────────────────────┐  │
│ • Loans          │  │ Add New Material                         │  │
│ • Expenses       │  │                                          │  │
│                  │  │ Material Name: [         ]               │  │
│                  │  │ Unit: [Dropdown  ▼]                     │  │
│                  │  │ Default Rate: [       ]                 │  │
│                  │  │ HSN Code: [         ]                   │  │
│                  │  │ GST Rate: [    ]  [Create] [Cancel]     │  │
│                  │  │                                          │  │
│                  │  └──────────────────────────────────────────┘  │
│                  │                                                 │
│                  │  ┌──────────────────────────────────────────┐  │
│                  │  │ MATERIALS TABLE                          │  │
│                  │  ├────────────────────────────────────────┤  │
│                  │  │ Name │ Unit │ Rate │ HSN │ GST │ Status│  │
│                  │  ├────────────────────────────────────────┤  │
│                  │  │ Steel Bars │ kgs │ 45 │ 7214│ 5% │ ✓   │  │
│                  │  │ [Edit] [Delete]                        │  │
│                  │  │                                         │  │
│                  │  │ Cement │ kgs │ 7.5 │ 2523│ 5% │ ✓   │  │
│                  │  │ [Edit] [Delete]                        │  │
│                  │  │                                         │  │
│                  │  │ Sand │ nos │ 500 │ 2505│ 5% │ ✓   │  │
│                  │  │ [Edit] [Delete]                        │  │
│                  │  │                                         │  │
│                  │  └──────────────────────────────────────────┘  │
│                  │                                                 │
└──────────────────┴──────────────────────────────────────────────────┘
```

## 🔄 State Transitions

```
INITIAL STATE
    │
    ├─→ LOADING (setLoading(true))
    │   ├─→ LOADED (data fetched)
    │   │   └─→ DISPLAY TABLE
    │   │       ├─→ USER CLICKS ADD
    │   │       │   └─→ FORM SHOWN
    │   │       │       ├─→ USER FILLS FORM
    │   │       │       ├─→ USER SUBMITS
    │   │       │       ├─→ SAVING (API call)
    │   │       │       ├─→ SUCCESS
    │   │       │       ├─→ FORM HIDDEN
    │   │       │       └─→ TABLE REFRESHED
    │   │       │
    │   │       ├─→ USER CLICKS EDIT
    │   │       │   └─→ FORM SHOWN (pre-filled)
    │   │       │       ├─→ USER MODIFIES
    │   │       │       ├─→ USER SUBMITS
    │   │       │       ├─→ UPDATING (API call)
    │   │       │       ├─→ SUCCESS
    │   │       │       ├─→ FORM HIDDEN
    │   │       │       └─→ TABLE REFRESHED
    │   │       │
    │   │       └─→ USER CLICKS DELETE
    │   │           ├─→ CONFIRM DIALOG
    │   │           ├─→ DELETING (API call)
    │   │           ├─→ SUCCESS
    │   │           └─→ TABLE REFRESHED
    │   │
    │   └─→ ERROR (API fails)
    │       └─→ ERROR MESSAGE SHOWN
    │
    └─→ Components re-render as state changes
```

## 🎯 Event Handlers

```
Materials.jsx Event Flow:

onClick (Add Material button)
    ↓
setShowForm(!showForm)
    ↓
[Form toggles visibility]

onChange (form inputs)
    ↓
setFormData({...formData, [field]: value})
    ↓
[Form data updates in state]

onSubmit (form submit)
    ↓
handleSubmit(e)
    ↓
[API call - create or update]
    ↓
[Success/Error message]
    ↓
[Form close, table refresh]

onClick (Edit button)
    ↓
handleEdit(material)
    ↓
[Form shows with data pre-filled]

onClick (Delete button)
    ↓
handleDelete(id)
    ↓
[Confirmation required]
    ↓
[API call - delete]
    ↓
[Table refresh]
```

## 📦 Component Props & State

```
Materials Component
├─ Props: None (standalone page)
├─ State:
│  ├─ materials: Material[]
│  ├─ loading: boolean
│  ├─ showForm: boolean
│  ├─ editId: number | null
│  ├─ formData: {
│  │  ├─ name: string
│  │  ├─ unit: string
│  │  ├─ default_rate: number
│  │  ├─ hsn_code: string
│  │  └─ gst_rate: number
│  │ }
│  ├─ error: string
│  └─ success: string
│
├─ Effects:
│  └─ useEffect(fetchMaterials, [])
│
└─ Methods:
   ├─ fetchMaterials(): Promise<void>
   ├─ handleSubmit(e): Promise<void>
   ├─ handleEdit(material): void
   ├─ handleDelete(id): Promise<void>
   └─ resetForm(): void
```

## 🔐 Security Flow

```
User Request
    ↓
ProtectedRoute checks
    ├─ Has token? 
    │  ├─ YES → Continue
    │  └─ NO → Redirect to login
    ├─ Token valid?
    │  ├─ YES → Continue
    │  └─ NO → Refresh/Logout
    └─ User authorized?
       ├─ YES → Display Materials page
       └─ NO → Redirect to login
```

---

**Architecture Status**: ✅ Complete & Documented
**Last Updated**: 14 May 2026

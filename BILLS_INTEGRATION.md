# BMS Bills Integration - M&D Engineering Frontend

## Overview
This document summarizes the complete frontend integration of BMS bill creation into the M&D Engineering ERP system.

## Completed Components

### 1. **Redux State Management** ✅
- **File**: `src/app/BillSlice.js`
- **Reducers**:
  - Bill List: `setBills`, `addBill`, `updateBill`, `deleteBill`
  - Current Bill: `setCurrentBill`, `clearCurrentBill`
  - Bill Items: `setBillItems`, `addBillItem`, `updateBillItem`, `removeBillItem`, `clearBillItems`
  - Filters: `setFilters`, `resetFilters`
  - Loading & Error: `setLoading`, `setError`, `clearError`

### 2. **Redux Store Configuration** ✅
- **File**: `src/app/store.jsx`
- Bills reducer properly integrated into the Redux store

### 3. **API Endpoints** ✅
- **File**: `src/services/Apis.js`
- Added bill-related endpoints:
  ```javascript
  BILLS:              `${BASE}/bills`
  BILLS_BY_ID:        (id) => `${BASE}/bills/${id}`
  BILLS_SEND:         (id) => `${BASE}/bills/${id}/send`
  BILLS_SYNC_MASTERS: `${BASE}/bills/sync/masters`
  ```

### 4. **API Repository Layer** ✅
- **File**: `src/services/repository/billRepository.js`
- Provides clean API interface:
  - `getBillsApi(params)` - Get all bills with filters
  - `getBillByIdApi(id)` - Get single bill
  - `createBillApi(data)` - Create new bill
  - `updateBillApi(id, data)` - Update bill
  - `deleteBillApi(id)` - Delete bill
  - `sendBillApi(id, data)` - Send bill to customer
  - `syncBillMastersApi(data)` - Sync with BMS masters

### 5. **Bills Management Component** ✅
- **File**: `src/components/pages/Bills.jsx`
- **Features**:
  - ✅ Create new bills with line items
  - ✅ Edit existing bills (draft status only)
  - ✅ Delete bills (draft status only)
  - ✅ View bill details with full print preview
  - ✅ Send bills to customers
  - ✅ Filter by status (Draft, Sent, Paid)
  - ✅ Search by customer name or bill number
  - ✅ Add/remove line items dynamically
  - ✅ GST calculation for each item
  - ✅ Auto-calculation of totals (Subtotal, GST, Total)
  - ✅ Notes/Terms section
  - ✅ Responsive dark theme UI
  - ✅ Error and success notifications

### 6. **Routing** ✅
- **File**: `src/RoutesConfig.jsx`
- Added route: `/bills` → `<Bills />`

### 7. **Navigation** ✅
- **File**: `src/components/common/Sidebar.jsx`
- Added Bills menu item with FileText icon
- Integrated into main navigation

## Bill Creation Workflow

### Frontend Flow:
1. User clicks "Create Bill" button
2. Form modal opens with:
   - Customer details (name, email, phone)
   - Bill number (auto-generated or manual)
   - Bill date & due date
   - Line items with dynamic add/remove
   - GST calculation per item
   - Totals calculation
   - Notes section
3. User submits form → API call to backend
4. Redux state updates with new bill
5. User redirected to bills list or can view bill

### Bill Item Addition:
1. User fills item details: Description, Quantity, Unit Price, GST Rate
2. Clicks "Add Item"
3. Item appears in table with automatic amount & GST calculation
4. User can remove item at any time
5. Running totals update dynamically

### Bill Viewing/Printing:
1. User clicks eye icon to view bill details
2. Full bill view page displays with:
   - Complete bill information
   - All line items in table format
   - Total calculations
   - Print-friendly layout
3. User can print or download as PDF using browser's print feature

### Bill Sending:
1. Draft bills can be sent to customers
2. Click "Send" button on draft bills
3. API call sends bill to backend
4. Bill status changes to "sent"
5. Optional: Email integration can be added

## Database Schema Integration

The Bills page expects the backend API to return bills in this format:

```javascript
{
  id: string,
  bill_number: string,
  customer_name: string,
  customer_email: string,
  customer_phone: string,
  bill_date: ISO-8601 date,
  due_date: ISO-8601 date,
  items: [
    {
      description: string,
      quantity: number,
      unit_price: number,
      gst_rate: number (5, 12, 18, 28),
      amount: number (qty * unit_price),
      gst: number (amount * gst_rate / 100),
      total: number (amount + gst)
    }
  ],
  notes: string,
  status: 'draft' | 'sent' | 'paid',
  created_at: ISO-8601 timestamp,
  updated_at: ISO-8601 timestamp
}
```

## Backend Integration Points

The frontend expects these API endpoints from backend:

### GET /bills
- Returns paginated list of bills
- Query params: `status`, `search`, `page`, `limit`
- Response: `{ data: { bills: [...], total: number } }`

### GET /bills/:id
- Returns single bill details
- Response: `{ data: { bill: {...} } }`

### POST /bills
- Creates new bill
- Body: Bill data without `id` and timestamps
- Response: `{ data: { bill: {...} } }`

### PUT /bills/:id
- Updates bill (draft only)
- Body: Bill data to update
- Response: `{ data: { bill: {...} } }`

### DELETE /bills/:id
- Deletes bill (draft only)
- Response: `{ status: 'success' }`

### POST /bills/:id/send
- Sends bill to customer
- Body: Optional email data
- Response: `{ data: { bill: {...} } }`

### POST /bills/sync/masters
- Syncs bills with BMS masters
- Body: Sync configuration
- Response: `{ data: { synced: number } }`

## Environment Configuration

Ensure `VITE_API_BASE_URL` is set in `.env`:
```
VITE_API_BASE_URL=http://localhost:5000/api
# or for production:
VITE_API_BASE_URL=https://your-api-domain.com/api
```

## UI Features

### Bills List Page
- Clean, dark-themed table layout
- Search bar for filtering bills
- Status filter dropdown
- Quick action buttons per bill (View, Edit, Delete, Send)
- Status badges (Draft=Yellow, Sent=Blue, Paid=Green)
- Create bill button with Plus icon
- Loading states and error messages

### Bill Creation Form
- Modal-based form for easy interactions
- Dynamic line item management
- Real-time total calculations
- GST rate options (0%, 5%, 12%, 18%, 28%)
- Date pickers for bill and due dates
- Autosave-friendly structure

### Bill View Page
- Professional print-friendly layout
- Complete bill information display
- Itemized breakdown table
- Tax calculations clearly shown
- Print button for PDF generation
- Back button to return to list

## Known Limitations & Future Enhancements

1. **Current Limitations**:
   - Bills can only be edited in draft status
   - Basic email integration (send bill endpoint exists)
   - No invoice template customization
   - No bulk operations

2. **Future Enhancements**:
   - Invoice template management
   - Email notifications with bill attachment
   - Payment tracking integration
   - Multiple currency support
   - Custom GST rules per customer
   - Bill recurring/subscription support
   - Advanced filtering (date range, amount range)
   - Export to Excel/CSV
   - Multi-currency support

## Testing Checklist

- [ ] Backend bills API endpoints are deployed and working
- [ ] Authentication token is properly passed to API calls
- [ ] Create bill with multiple items
- [ ] Edit draft bill
- [ ] Delete draft bill
- [ ] Send bill (check backend email integration)
- [ ] View bill details and print
- [ ] Search functionality works
- [ ] Status filtering works
- [ ] Error handling displays properly
- [ ] Redux state updates correctly
- [ ] Responsive design works on mobile

## Troubleshooting

### Bills not loading
- Check browser console for API errors
- Verify `VITE_API_BASE_URL` is correct
- Check authentication token in localStorage (`md_token`)

### Cannot create bill
- Ensure all required fields are filled
- Check backend logs for validation errors
- Verify GST rates are valid (0, 5, 12, 18, 28)

### API 401 errors
- Token may have expired
- Check localStorage for `md_token`
- May need to re-login

### Totals not calculating
- Ensure quantities and unit prices are valid numbers
- GST rate must be between 0-100

## Next Steps

1. Deploy backend bills module (if not already done)
2. Test end-to-end bill creation flow
3. Configure email notifications for bill sending
4. Set up bill number generation logic in backend
5. Implement bill sync with BMS system
6. Add advanced reporting features

## Support & Documentation

For more information:
- Backend Documentation: See `backend/mdengineers/docs/BILLS_API.md`
- BMS Integration: See `BMS_INTEGRATION_GUIDE.md`
- Redux Documentation: https://redux-toolkit.js.org/

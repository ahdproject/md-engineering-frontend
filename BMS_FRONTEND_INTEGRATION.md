# BMS Frontend Integration Guide

## Overview

This guide explains how to integrate the BMS backend billing system with the M and D Engineering React frontend.

## Architecture

```
React Frontend
    ↓
Redux Store (Bills Slice)
    ↓
API Service (Connector + Axios)
    ↓
M&D Backend API (/api/bills)
    ↓
BMS Integration Service
    ↓
BMS Backend API
```

---

## Step 1: Update API Endpoints

### File: `src/services/Apis.js`

Add bills endpoints to the APIS object:

```javascript
const APIS = {
  // ... existing endpoints ...

  // Bills (NEW)
  BILLS:              `${BASE}/bills`,
  BILLS_BY_ID:        (id) => `${BASE}/bills/${id}`,
  BILLS_SEND:         (id) => `${BASE}/bills/${id}/send`,
  BILLS_SYNC_MASTERS: `${BASE}/bills/sync/masters`,
};

export default APIS;
```

---

## Step 2: Create Bills API Service

### File: `src/services/billsApi.js` (NEW)

```javascript
import Connector from './Connector';
import APIS from './Apis';

const billsApi = {
  // Create bill
  createBill: (billData) => 
    Connector.post(APIS.BILLS, billData),

  // Get all bills
  getBills: (params = {}) =>
    Connector.get(APIS.BILLS, { params }),

  // Get bill by ID
  getBillById: (billId) =>
    Connector.get(APIS.BILLS_BY_ID(billId)),

  // Update bill
  updateBill: (billId, updateData) =>
    Connector.put(APIS.BILLS_BY_ID(billId), updateData),

  // Send bill to BMS
  sendBill: (billId) =>
    Connector.post(APIS.BILLS_SEND(billId)),

  // Delete bill
  deleteBill: (billId) =>
    Connector.delete(APIS.BILLS_BY_ID(billId)),

  // Sync masters to BMS
  syncMasters: (particulars) =>
    Connector.post(APIS.BILLS_SYNC_MASTERS, { particulars }),
};

export default billsApi;
```

---

## Step 3: Create Redux Slice for Bills

### File: `src/app/BillsSlice.js` (NEW)

```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import billsApi from '../services/billsApi';

// Async Thunks
export const createBill = createAsyncThunk(
  'bills/createBill',
  async (billData, { rejectWithValue }) => {
    try {
      const response = await billsApi.createBill(billData);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create bill');
    }
  }
);

export const getBills = createAsyncThunk(
  'bills/getBills',
  async (params, { rejectWithValue }) => {
    try {
      const response = await billsApi.getBills(params);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bills');
    }
  }
);

export const getBillById = createAsyncThunk(
  'bills/getBillById',
  async (billId, { rejectWithValue }) => {
    try {
      const response = await billsApi.getBillById(billId);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch bill');
    }
  }
);

export const updateBill = createAsyncThunk(
  'bills/updateBill',
  async ({ billId, updateData }, { rejectWithValue }) => {
    try {
      const response = await billsApi.updateBill(billId, updateData);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update bill');
    }
  }
);

export const sendBill = createAsyncThunk(
  'bills/sendBill',
  async (billId, { rejectWithValue }) => {
    try {
      const response = await billsApi.sendBill(billId);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send bill');
    }
  }
);

export const deleteBill = createAsyncThunk(
  'bills/deleteBill',
  async (billId, { rejectWithValue }) => {
    try {
      const response = await billsApi.deleteBill(billId);
      return billId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete bill');
    }
  }
);

export const syncMasters = createAsyncThunk(
  'bills/syncMasters',
  async (particulars, { rejectWithValue }) => {
    try {
      const response = await billsApi.syncMasters(particulars);
      return response.data?.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to sync masters');
    }
  }
);

// Slice
const initialState = {
  bills: [],
  currentBill: null,
  pagination: null,
  loading: false,
  error: null,
  success: false,
  syncStatus: null,
};

const BillsSlice = createSlice({
  name: 'bills',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
    },
    clearCurrentBill: (state) => {
      state.currentBill = null;
    },
  },
  extraReducers: (builder) => {
    // Create Bill
    builder
      .addCase(createBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBill.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBill = action.payload;
        state.success = true;
      })
      .addCase(createBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Bills
    builder
      .addCase(getBills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBills.fulfilled, (state, action) => {
        state.loading = false;
        state.bills = action.payload;
      })
      .addCase(getBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Get Bill by ID
    builder
      .addCase(getBillById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getBillById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBill = action.payload;
      })
      .addCase(getBillById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Bill
    builder
      .addCase(updateBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBill.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBill = action.payload;
        state.success = true;
      })
      .addCase(updateBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Send Bill
    builder
      .addCase(sendBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendBill.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBill = action.payload.bill;
        state.success = true;
      })
      .addCase(sendBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete Bill
    builder
      .addCase(deleteBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBill.fulfilled, (state, action) => {
        state.loading = false;
        state.bills = state.bills.filter(bill => bill.id !== action.payload);
        state.success = true;
      })
      .addCase(deleteBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Sync Masters
    builder
      .addCase(syncMasters.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.syncStatus = 'syncing';
      })
      .addCase(syncMasters.fulfilled, (state, action) => {
        state.loading = false;
        state.syncStatus = 'success';
        state.success = true;
      })
      .addCase(syncMasters.rejected, (state, action) => {
        state.loading = false;
        state.syncStatus = 'failed';
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, clearCurrentBill } = BillsSlice.actions;
export default BillsSlice.reducer;
```

---

## Step 4: Update Redux Store

### File: `src/app/store.js`

Add BillsSlice to store:

```javascript
import { configureStore } from '@reduxjs/toolkit';
import AuthSlice from './AuthSlice';
import BillsSlice from './BillsSlice'; // Add this

export const store = configureStore({
  reducer: {
    auth: AuthSlice,
    bills: BillsSlice, // Add this
    // ... other slices
  },
});

export default store;
```

---

## Step 5: Create Bill Components

### Component 1: Bill Form Component

File: `src/components/bills/BillForm.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createBill, getBills } from '../../app/BillsSlice';

export default function BillForm() {
  const dispatch = useDispatch();
  const { loading, error, success } = useSelector(state => state.bills);

  const [formData, setFormData] = useState({
    customer_id: '',
    items: [{ particular_id: '', quantity: 1, rate: 0, amount: 0 }],
    total_amount: 0,
    description: '',
    due_date: '',
    notes: '',
  });

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;

    // Calculate amount for this item
    if (field === 'quantity' || field === 'rate') {
      newItems[index].amount = parseFloat(newItems[index].quantity) * parseFloat(newItems[index].rate);
    }

    setFormData({
      ...formData,
      items: newItems,
      total_amount: newItems.reduce((sum, item) => sum + item.amount, 0),
    });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { particular_id: '', quantity: 1, rate: 0, amount: 0 }],
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      items: newItems,
      total_amount: newItems.reduce((sum, item) => sum + item.amount, 0),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createBill(formData));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create Bill</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 text-green-700 rounded">
          Bill created successfully!
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Customer Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Customer</label>
          <input
            type="text"
            placeholder="Customer ID"
            value={formData.customer_id}
            onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        {/* Line Items */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Items</h3>

          {formData.items.map((item, index) => (
            <div key={index} className="mb-4 p-4 border rounded bg-gray-50">
              <div className="grid grid-cols-5 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Particular ID"
                  value={item.particular_id}
                  onChange={(e) => handleItemChange(index, 'particular_id', e.target.value)}
                  className="px-3 py-2 border rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  className="px-3 py-2 border rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Rate"
                  value={item.rate}
                  onChange={(e) => handleItemChange(index, 'rate', e.target.value)}
                  className="px-3 py-2 border rounded"
                  required
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={item.amount}
                  disabled
                  className="px-3 py-2 border rounded bg-gray-200"
                />
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mb-4"
          >
            + Add Item
          </button>
        </div>

        {/* Total Amount */}
        <div className="mb-4 p-4 bg-blue-50 rounded">
          <p className="text-lg font-semibold">
            Total Amount: ₹{formData.total_amount.toFixed(2)}
          </p>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">Due Date</label>
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <input
              type="text"
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 border rounded"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Notes</label>
          <textarea
            placeholder="Additional notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-4 py-2 border rounded"
            rows="3"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Creating Bill...' : 'Create Bill'}
        </button>
      </form>
    </div>
  );
}
```

### Component 2: Bills List Component

File: `src/components/bills/BillsList.jsx`

```javascript
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBills, deleteBill, sendBill } from '../../app/BillsSlice';
import { useNavigate } from 'react-router-dom';

export default function BillsList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { bills, loading, error } = useSelector(state => state.bills);

  useEffect(() => {
    dispatch(getBills());
  }, [dispatch]);

  const handleDelete = (billId) => {
    if (window.confirm('Are you sure you want to cancel this bill?')) {
      dispatch(deleteBill(billId));
    }
  };

  const handleSend = (billId) => {
    dispatch(sendBill(billId));
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      draft: 'bg-yellow-100 text-yellow-800',
      synced: 'bg-blue-100 text-blue-800',
      sent: 'bg-green-100 text-green-800',
      paid: 'bg-emerald-100 text-emerald-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status] || 'bg-gray-100'}`}>
        {status?.toUpperCase()}
      </span>
    );
  };

  if (loading) return <div className="text-center py-8">Loading bills...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Bills</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {!bills || bills.length === 0 ? (
        <p className="text-gray-500">No bills found</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Bill ID</th>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Status</th>
                <th className="px-4 py-2 text-left">BMS Invoice</th>
                <th className="px-4 py-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill) => (
                <tr key={bill.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2 text-sm">{bill.id.substring(0, 8)}...</td>
                  <td className="px-4 py-2">{bill.customer_name}</td>
                  <td className="px-4 py-2 font-semibold">₹{bill.total_amount?.toFixed(2)}</td>
                  <td className="px-4 py-2">{getStatusBadge(bill.status)}</td>
                  <td className="px-4 py-2 text-sm">{bill.bms_invoice_number || '-'}</td>
                  <td className="px-4 py-2 text-sm space-x-2">
                    <button
                      onClick={() => navigate(`/bills/${bill.id}`)}
                      className="text-blue-500 hover:underline"
                    >
                      View
                    </button>
                    {bill.status === 'draft' && (
                      <>
                        <button
                          onClick={() => navigate(`/bills/${bill.id}/edit`)}
                          className="text-green-500 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(bill.id)}
                          className="text-red-500 hover:underline"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                    {bill.status === 'synced' && (
                      <button
                        onClick={() => handleSend(bill.id)}
                        className="text-purple-500 hover:underline"
                      >
                        Send
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

---

## Step 6: Create Routes

### File: `src/RoutesConfig.jsx`

Add bill routes:

```javascript
import BillsList from './components/bills/BillsList';
import BillForm from './components/bills/BillForm';
import BillDetails from './components/bills/BillDetails';

const routes = [
  // ... existing routes ...
  
  {
    path: '/bills',
    element: <BillsList />,
  },
  {
    path: '/bills/create',
    element: <BillForm />,
  },
  {
    path: '/bills/:billId',
    element: <BillDetails />,
  },
];
```

---

## Step 7: Add Navigation Menu

Update your navigation menu to include Bills:

```javascript
<nav>
  <Link to="/bills">Bills</Link>
  <Link to="/bills/create">Create Bill</Link>
</nav>
```

---

## Component Details

### BillDetails Component

File: `src/components/bills/BillDetails.jsx`

```javascript
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getBillById, sendBill } from '../../app/BillsSlice';

export default function BillDetails() {
  const { billId } = useParams();
  const dispatch = useDispatch();
  const { currentBill, loading } = useSelector(state => state.bills);

  useEffect(() => {
    if (billId) {
      dispatch(getBillById(billId));
    }
  }, [billId, dispatch]);

  if (loading) return <div>Loading...</div>;
  if (!currentBill) return <div>Bill not found</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Bill Details</h2>
        {currentBill.status === 'synced' && (
          <button
            onClick={() => dispatch(sendBill(billId))}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Send to Customer
          </button>
        )}
      </div>

      {/* Bill Header */}
      <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded">
        <div>
          <p className="text-sm text-gray-600">Bill ID</p>
          <p className="font-semibold">{currentBill.id}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">BMS Invoice</p>
          <p className="font-semibold">{currentBill.bms_invoice_number || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Customer</p>
          <p className="font-semibold">{currentBill.customer_name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Status</p>
          <p className="font-semibold">{currentBill.status}</p>
        </div>
      </div>

      {/* Line Items */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Items</h3>
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Item</th>
              <th className="px-4 py-2 text-right">Quantity</th>
              <th className="px-4 py-2 text-right">Rate</th>
              <th className="px-4 py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {currentBill.items?.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="px-4 py-2">{item.particular_name}</td>
                <td className="px-4 py-2 text-right">{item.quantity}</td>
                <td className="px-4 py-2 text-right">₹{item.rate}</td>
                <td className="px-4 py-2 text-right">₹{item.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Total */}
      <div className="mb-6 p-4 bg-blue-50 rounded border-2 border-blue-500">
        <p className="text-xl font-bold">
          Total Amount: ₹{currentBill.total_amount?.toFixed(2)}
        </p>
      </div>

      {/* Notes */}
      {currentBill.notes && (
        <div className="p-4 bg-yellow-50 rounded border border-yellow-200">
          <p className="text-sm font-medium">Notes</p>
          <p>{currentBill.notes}</p>
        </div>
      )}
    </div>
  );
}
```

---

## Usage Examples

### Create a Bill

```javascript
import { useDispatch } from 'react-redux';
import { createBill } from '../app/BillsSlice';

function MyComponent() {
  const dispatch = useDispatch();

  const handleCreate = () => {
    dispatch(createBill({
      customer_id: 'cust-123',
      items: [
        {
          particular_id: 'part-456',
          quantity: 10,
          rate: 500,
          amount: 5000
        }
      ],
      total_amount: 5000,
    }));
  };

  return <button onClick={handleCreate}>Create Bill</button>;
}
```

### Get Bills

```javascript
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBills } from '../app/BillsSlice';

function MyComponent() {
  const dispatch = useDispatch();
  const { bills, loading } = useSelector(state => state.bills);

  useEffect(() => {
    dispatch(getBills({ limit: 20, status: 'synced' }));
  }, [dispatch]);

  return (
    <div>
      {loading ? 'Loading...' : bills.map(bill => <div key={bill.id}>{bill.id}</div>)}
    </div>
  );
}
```

---

## Styling

The components use Tailwind CSS. Ensure Tailwind is configured in your project.

### Common Classes Used:
- `bg-white`, `p-6`, `rounded-lg`, `shadow-md` - Card styling
- `grid grid-cols-2 gap-4` - Layout
- `text-2xl font-bold` - Typography
- `px-4 py-2 border rounded` - Input styling
- `bg-blue-500 text-white hover:bg-blue-600` - Button styling

---

## Error Handling

All components have built-in error handling:

```javascript
const { error } = useSelector(state => state.bills);

if (error) {
  return <div className="text-red-600">{error}</div>;
}
```

---

## Notifications

Add toast notifications for user feedback:

```bash
npm install react-hot-toast
```

Usage:

```javascript
import toast from 'react-hot-toast';

const handleCreate = async () => {
  try {
    await dispatch(createBill(data));
    toast.success('Bill created successfully!');
  } catch (error) {
    toast.error('Failed to create bill');
  }
};
```

---

## Performance Optimization

1. **Memoization** - Use `React.memo()` for list items
2. **Lazy Loading** - Use `React.lazy()` for components
3. **Pagination** - Implement server-side pagination
4. **Caching** - Cache bills in Redux

---

## Testing

### Unit Test Example

```javascript
import { configureStore } from '@reduxjs/toolkit';
import billsReducer, { createBill } from '../app/BillsSlice';

describe('BillsSlice', () => {
  it('should handle createBill.fulfilled', () => {
    const initialState = { bills: [], currentBill: null };
    const action = {
      type: createBill.fulfilled.type,
      payload: { id: '1', customer_id: 'cust-1' },
    };
    
    const result = billsReducer(initialState, action);
    expect(result.currentBill).toEqual(action.payload);
  });
});
```

---

## Deployment

Ensure environment variables are set in deployment:

```env
VITE_API_BASE_URL=https://your-backend-url/api
```

---

## Support

For questions or issues:
1. Check Redux DevTools for state debugging
2. Review network requests in browser DevTools
3. Check backend logs: `tail -f logs/error.log`
4. Verify API endpoints are accessible

---

**Version:** 1.0.0  
**Last Updated:** May 19, 2026  
**Ready for Implementation** ✅

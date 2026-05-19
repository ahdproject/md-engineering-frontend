import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bills: [],
  currentBill: null,
  loading: false,
  error: null,
  filters: {
    status: 'all',
    dateRange: { start: null, end: null },
    searchTerm: '',
  },
  billItems: [],
};

const billSlice = createSlice({
  name: 'bills',
  initialState,
  reducers: {
    // Bill List Actions
    setBills: (state, action) => {
      state.bills = action.payload;
    },
    addBill: (state, action) => {
      state.bills.unshift(action.payload);
    },
    updateBill: (state, action) => {
      const index = state.bills.findIndex(b => b.id === action.payload.id);
      if (index !== -1) {
        state.bills[index] = action.payload;
      }
    },
    deleteBill: (state, action) => {
      state.bills = state.bills.filter(b => b.id !== action.payload);
    },

    // Current Bill Actions
    setCurrentBill: (state, action) => {
      state.currentBill = action.payload;
    },
    clearCurrentBill: (state) => {
      state.currentBill = null;
    },

    // Bill Items Actions
    setBillItems: (state, action) => {
      state.billItems = action.payload;
    },
    addBillItem: (state, action) => {
      state.billItems.push(action.payload);
    },
    updateBillItem: (state, action) => {
      const index = state.billItems.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.billItems[index] = action.payload;
      }
    },
    removeBillItem: (state, action) => {
      state.billItems = state.billItems.filter(item => item.id !== action.payload);
    },
    clearBillItems: (state) => {
      state.billItems = [];
    },

    // Filter Actions
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Loading & Error
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setBills, addBill, updateBill, deleteBill,
  setCurrentBill, clearCurrentBill,
  setBillItems, addBillItem, updateBillItem, removeBillItem, clearBillItems,
  setFilters, resetFilters,
  setLoading, setError, clearError,
} = billSlice.actions;

export default billSlice.reducer;

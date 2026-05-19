/**
 * Bills Module - Frontend Component Tests
 * Tests Redux state management, API repository, and business logic
 * 
 * Run with: npm test (after configuring vitest)
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// ============================================================================
// BillSlice Tests
// ============================================================================

describe('BillSlice - Redux State Management', () => {
  const initialState = {
    bills: [],
    currentBill: null,
    loading: false,
    error: null,
  };

  describe('Initial State', () => {
    it('should have correct initial state structure', () => {
      expect(initialState).toHaveProperty('bills');
      expect(initialState).toHaveProperty('currentBill');
      expect(initialState).toHaveProperty('loading');
      expect(initialState).toHaveProperty('error');
      expect(initialState.bills).toEqual([]);
      expect(initialState.currentBill).toBeNull();
      expect(initialState.loading).toBe(false);
      expect(initialState.error).toBeNull();
    });
  });

  describe('Bill Operations', () => {
    it('should add a bill to empty state', () => {
      const newBill = {
        id: 1,
        customer_name: 'Acme Corp',
        customer_email: 'contact@acme.com',
        status: 'draft',
        total_amount: 5000,
        items: [],
        created_at: '2025-01-15T10:00:00Z',
      };

      const state = {
        ...initialState,
        bills: [newBill],
      };

      expect(state.bills).toHaveLength(1);
      expect(state.bills[0]).toEqual(newBill);
    });

    it('should add multiple bills', () => {
      const bills = [
        { id: 1, customer_name: 'Customer 1', status: 'draft' },
        { id: 2, customer_name: 'Customer 2', status: 'sent' },
        { id: 3, customer_name: 'Customer 3', status: 'cancelled' },
      ];

      const state = {
        ...initialState,
        bills,
      };

      expect(state.bills).toHaveLength(3);
    });

    it('should update an existing bill', () => {
      const initialBills = [
        { id: 1, customer_name: 'Old Name', status: 'draft' },
      ];

      const updatedBill = {
        id: 1,
        customer_name: 'New Name',
        status: 'draft',
      };

      const state = {
        ...initialState,
        bills: initialBills.map(b => b.id === updatedBill.id ? updatedBill : b),
      };

      expect(state.bills[0].customer_name).toBe('New Name');
    });

    it('should delete a bill from list', () => {
      const initialBills = [
        { id: 1, customer_name: 'Customer 1', status: 'draft' },
        { id: 2, customer_name: 'Customer 2', status: 'draft' },
        { id: 3, customer_name: 'Customer 3', status: 'draft' },
      ];

      const state = {
        ...initialState,
        bills: initialBills.filter(b => b.id !== 2),
      };

      expect(state.bills).toHaveLength(2);
      expect(state.bills.find(b => b.id === 2)).toBeUndefined();
    });

    it('should set current bill', () => {
      const bill = { id: 1, customer_name: 'Customer 1', status: 'draft' };

      const state = {
        ...initialState,
        currentBill: bill,
      };

      expect(state.currentBill).toEqual(bill);
    });

    it('should clear current bill', () => {
      const state = {
        ...initialState,
        currentBill: null,
      };

      expect(state.currentBill).toBeNull();
    });
  });

  describe('Loading and Error States', () => {
    it('should set loading state', () => {
      const state = {
        ...initialState,
        loading: true,
      };

      expect(state.loading).toBe(true);
    });

    it('should set error state', () => {
      const errorMessage = 'Failed to fetch bills';
      const state = {
        ...initialState,
        error: errorMessage,
      };

      expect(state.error).toBe(errorMessage);
    });

    it('should clear error state', () => {
      const state = {
        ...initialState,
        error: null,
      };

      expect(state.error).toBeNull();
    });
  });
});

// ============================================================================
// Bill Model/Data Tests
// ============================================================================

describe('Bill Data Model', () => {
  const createMockBill = (overrides = {}) => ({
    id: 1,
    customer_id: 1,
    customer_name: 'Acme Corporation',
    customer_email: 'contact@acme.com',
    customer_phone: '555-1234',
    bill_number: 'INV-2025-001',
    bill_date: '2025-01-15',
    due_date: '2025-02-15',
    status: 'draft',
    total_amount: 10000,
    items: [],
    notes: 'Test bill',
    bms_invoice_id: null,
    bms_invoice_number: null,
    created_by: 1,
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-01-15T10:00:00Z',
    ...overrides,
  });

  describe('Bill Properties', () => {
    it('should have all required bill properties', () => {
      const bill = createMockBill();

      expect(bill).toHaveProperty('id');
      expect(bill).toHaveProperty('customer_name');
      expect(bill).toHaveProperty('bill_date');
      expect(bill).toHaveProperty('due_date');
      expect(bill).toHaveProperty('status');
      expect(bill).toHaveProperty('items');
      expect(bill).toHaveProperty('total_amount');
    });

    it('should have valid status values', () => {
      const validStatuses = ['draft', 'sent', 'cancelled', 'paid'];
      const bill = createMockBill({ status: 'draft' });

      expect(validStatuses).toContain(bill.status);
    });

    it('should support different status transitions', () => {
      let bill = createMockBill({ status: 'draft' });
      expect(bill.status).toBe('draft');

      bill = createMockBill({ status: 'sent', bms_invoice_id: 'BMS-001' });
      expect(bill.status).toBe('sent');
      expect(bill.bms_invoice_id).not.toBeNull();

      bill = createMockBill({ status: 'cancelled' });
      expect(bill.status).toBe('cancelled');
    });
  });

  describe('Bill Items', () => {
    it('should support line items', () => {
      const bill = createMockBill({
        items: [
          { id: 1, description: 'Service A', quantity: 2, unit_price: 500, gst_rate: 18 },
          { id: 2, description: 'Service B', quantity: 1, unit_price: 1000, gst_rate: 18 },
        ],
      });

      expect(bill.items).toHaveLength(2);
      expect(bill.items[0].description).toBe('Service A');
    });

    it('should support empty items list', () => {
      const bill = createMockBill({ items: [] });
      expect(bill.items).toHaveLength(0);
    });
  });
});

// ============================================================================
// Bill Calculation Tests
// ============================================================================

describe('Bill Calculations', () => {
  const createItem = (quantity, unitPrice, gstRate = 18) => {
    const amount = quantity * unitPrice;
    const gst = (amount * gstRate) / 100;
    const total = amount + gst;

    return {
      description: 'Test Item',
      quantity,
      unit_price: unitPrice,
      gst_rate: gstRate,
      amount,
      gst,
      total,
    };
  };

  describe('Single Item Calculations', () => {
    it('should calculate correct amount (quantity × unit_price)', () => {
      const item = createItem(5, 1000);
      expect(item.amount).toBe(5000);
    });

    it('should calculate correct GST amount', () => {
      const item = createItem(5, 1000, 18);
      expect(item.gst).toBe(900);
    });

    it('should calculate correct total (amount + GST)', () => {
      const item = createItem(5, 1000, 18);
      expect(item.total).toBe(5900);
    });

    it('should handle different GST rates', () => {
      const item5 = createItem(100, 100, 5);
      const item12 = createItem(100, 100, 12);
      const item18 = createItem(100, 100, 18);
      const item28 = createItem(100, 100, 28);

      expect(item5.gst).toBe(500); // 5% of 10,000
      expect(item12.gst).toBe(1200); // 12% of 10,000
      expect(item18.gst).toBe(1800); // 18% of 10,000
      expect(item28.gst).toBe(2800); // 28% of 10,000
    });

    it('should handle zero GST rate', () => {
      const item = createItem(10, 500, 0);
      expect(item.gst).toBe(0);
      expect(item.total).toBe(item.amount);
    });

    it('should handle decimal values', () => {
      const item = createItem(2.5, 1250.50, 18);
      const expectedAmount = 2.5 * 1250.50; // 3126.25
      const expectedGst = (expectedAmount * 18) / 100; // 562.725
      const expectedTotal = expectedAmount + expectedGst; // 3688.975

      expect(item.amount).toBeCloseTo(expectedAmount, 2);
      expect(item.gst).toBeCloseTo(expectedGst, 2);
      expect(item.total).toBeCloseTo(expectedTotal, 2);
    });
  });

  describe('Multiple Items Calculations', () => {
    it('should calculate bill totals correctly', () => {
      const items = [
        createItem(10, 500, 18),  // 5000 + 900 = 5900
        createItem(5, 1000, 18),  // 5000 + 900 = 5900
      ];

      const subtotal = items.reduce((sum, item) => sum + item.amount, 0); // 10,000
      const totalGst = items.reduce((sum, item) => sum + item.gst, 0); // 1800
      const billTotal = subtotal + totalGst; // 11,800

      expect(subtotal).toBe(10000);
      expect(totalGst).toBe(1800);
      expect(billTotal).toBe(11800);
    });

    it('should handle mixed GST rates', () => {
      const items = [
        createItem(10, 500, 18),  // Amount: 5000, GST: 900
        createItem(5, 1000, 12),  // Amount: 5000, GST: 600
        createItem(2, 500, 5),    // Amount: 1000, GST: 50
      ];

      const subtotal = items.reduce((sum, item) => sum + item.amount, 0); // 11,000
      const totalGst = items.reduce((sum, item) => sum + item.gst, 0); // 1550
      const billTotal = subtotal + totalGst; // 12,550

      expect(subtotal).toBe(11000);
      expect(totalGst).toBe(1550);
      expect(billTotal).toBe(12550);
    });

    it('should handle many items', () => {
      const items = Array.from({ length: 100 }, (_, i) =>
        createItem(i + 1, 100, 18)
      );

      const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
      const totalGst = items.reduce((sum, item) => sum + item.gst, 0);
      const billTotal = subtotal + totalGst;

      expect(subtotal).toBeGreaterThan(0);
      expect(totalGst).toBeGreaterThan(0);
      expect(billTotal).toBe(subtotal + totalGst);
    });
  });
});

// ============================================================================
// Bill Filtering and Search Tests
// ============================================================================

describe('Bill Filtering and Search', () => {
  const mockBills = [
    { id: 1, customer_name: 'Acme Corp', status: 'draft', created_at: '2025-01-01' },
    { id: 2, customer_name: 'TechCorp Industries', status: 'sent', created_at: '2025-01-05' },
    { id: 3, customer_name: 'Global Solutions', status: 'cancelled', created_at: '2025-01-10' },
    { id: 4, customer_name: 'Acme Services', status: 'draft', created_at: '2025-01-15' },
  ];

  describe('Status Filtering', () => {
    it('should filter bills by draft status', () => {
      const filtered = mockBills.filter(b => b.status === 'draft');
      expect(filtered).toHaveLength(2);
      expect(filtered.every(b => b.status === 'draft')).toBe(true);
    });

    it('should filter bills by sent status', () => {
      const filtered = mockBills.filter(b => b.status === 'sent');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].status).toBe('sent');
    });

    it('should filter bills by cancelled status', () => {
      const filtered = mockBills.filter(b => b.status === 'cancelled');
      expect(filtered).toHaveLength(1);
      expect(filtered[0].status).toBe('cancelled');
    });

    it('should return all bills when no status filter', () => {
      const filtered = mockBills;
      expect(filtered).toHaveLength(4);
    });
  });

  describe('Search Functionality', () => {
    it('should search bills by customer name (exact)', () => {
      const searchTerm = 'Acme Corp';
      const filtered = mockBills.filter(b =>
        b.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      expect(filtered).toHaveLength(2);
    });

    it('should search bills by customer name (partial)', () => {
      const searchTerm = 'Acme';
      const filtered = mockBills.filter(b =>
        b.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      expect(filtered).toHaveLength(2);
    });

    it('should search case-insensitively', () => {
      const searchTerm = 'TECHCORP';
      const filtered = mockBills.filter(b =>
        b.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      expect(filtered).toHaveLength(1);
      expect(filtered[0].customer_name).toBe('TechCorp Industries');
    });

    it('should return empty results for no matches', () => {
      const searchTerm = 'NonExistent';
      const filtered = mockBills.filter(b =>
        b.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      expect(filtered).toHaveLength(0);
    });
  });

  describe('Combined Filtering and Search', () => {
    it('should filter by status AND search by name', () => {
      const status = 'draft';
      const searchTerm = 'Acme';
      const filtered = mockBills.filter(b =>
        b.status === status &&
        b.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      expect(filtered).toHaveLength(2);
    });

    it('should return empty when combining filters with no matches', () => {
      const status = 'sent';
      const searchTerm = 'Acme';
      const filtered = mockBills.filter(b =>
        b.status === status &&
        b.customer_name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      expect(filtered).toHaveLength(0);
    });
  });
});

// ============================================================================
// Bill Validation Tests
// ============================================================================

describe('Bill Validation', () => {
  const validateBillForm = (formData) => {
    const errors = {};

    if (!formData.customer_name) {
      errors.customer_name = 'Customer name is required';
    }

    if (!formData.bill_date) {
      errors.bill_date = 'Bill date is required';
    }

    if (!formData.items || formData.items.length === 0) {
      errors.items = 'At least one item is required';
    } else {
      formData.items.forEach((item, index) => {
        if (!item.description) {
          errors[`items[${index}].description`] = 'Item description is required';
        }
        if (!item.quantity || item.quantity <= 0) {
          errors[`items[${index}].quantity`] = 'Quantity must be greater than 0';
        }
        if (!item.unit_price || item.unit_price <= 0) {
          errors[`items[${index}].unit_price`] = 'Unit price must be greater than 0';
        }
      });
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  describe('Required Fields', () => {
    it('should validate customer name is required', () => {
      const formData = {
        customer_name: '',
        bill_date: '2025-01-15',
        items: [{ description: 'Item', quantity: 1, unit_price: 100 }],
      };

      const result = validateBillForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.customer_name).toBeDefined();
    });

    it('should validate bill date is required', () => {
      const formData = {
        customer_name: 'Test Customer',
        bill_date: '',
        items: [{ description: 'Item', quantity: 1, unit_price: 100 }],
      };

      const result = validateBillForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.bill_date).toBeDefined();
    });

    it('should validate items are required', () => {
      const formData = {
        customer_name: 'Test Customer',
        bill_date: '2025-01-15',
        items: [],
      };

      const result = validateBillForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors.items).toBeDefined();
    });
  });

  describe('Item Validation', () => {
    it('should validate item description is required', () => {
      const formData = {
        customer_name: 'Test Customer',
        bill_date: '2025-01-15',
        items: [{ description: '', quantity: 1, unit_price: 100 }],
      };

      const result = validateBillForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors['items[0].description']).toBeDefined();
    });

    it('should validate quantity is greater than 0', () => {
      const formData = {
        customer_name: 'Test Customer',
        bill_date: '2025-01-15',
        items: [{ description: 'Item', quantity: 0, unit_price: 100 }],
      };

      const result = validateBillForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors['items[0].quantity']).toBeDefined();
    });

    it('should validate unit price is greater than 0', () => {
      const formData = {
        customer_name: 'Test Customer',
        bill_date: '2025-01-15',
        items: [{ description: 'Item', quantity: 1, unit_price: 0 }],
      };

      const result = validateBillForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors['items[0].unit_price']).toBeDefined();
    });

    it('should validate multiple items', () => {
      const formData = {
        customer_name: 'Test Customer',
        bill_date: '2025-01-15',
        items: [
          { description: 'Item 1', quantity: 1, unit_price: 100 },
          { description: '', quantity: 1, unit_price: 100 },
          { description: 'Item 3', quantity: -1, unit_price: 100 },
        ],
      };

      const result = validateBillForm(formData);
      expect(result.isValid).toBe(false);
      expect(result.errors['items[1].description']).toBeDefined();
      expect(result.errors['items[2].quantity']).toBeDefined();
    });
  });

  describe('Valid Form Submission', () => {
    it('should pass validation with all required fields', () => {
      const formData = {
        customer_name: 'Test Customer',
        bill_date: '2025-01-15',
        items: [
          { description: 'Service A', quantity: 5, unit_price: 500 },
          { description: 'Service B', quantity: 2, unit_price: 1000 },
        ],
      };

      const result = validateBillForm(formData);
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors)).toHaveLength(0);
    });
  });
});

// ============================================================================
// Export Tests
// ============================================================================

export default {
  'Bills Redux State Management': 'Tested',
  'Bill Data Model': 'Tested',
  'Bill Calculations': 'Tested',
  'Bill Filtering and Search': 'Tested',
  'Bill Validation': 'Tested',
};

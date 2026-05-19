import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Send, Download, Eye, Search, Filter, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getBillsApi,
  getBillByIdApi,
  createBillApi,
  updateBillApi,
  deleteBillApi,
  sendBillApi,
} from '../../services/repository/billRepository';
import { setBills, addBill, updateBill, deleteBill, setCurrentBill } from '../../app/BillSlice';
import Loader from '../common/Loader';

export default function Bills() {
  const dispatch = useDispatch();
  const { bills, loading, error } = useSelector(s => s.bills);

  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedBill, setSelectedBill] = useState(null);
  const [formData, setFormData] = useState({
    bill_number: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    bill_date: new Date().toISOString().split('T')[0],
    due_date: '',
    items: [],
    notes: '',
    status: 'draft',
  });
  const [newItem, setNewItem] = useState({
    description: '',
    quantity: 1,
    unit_price: 0,
    gst_rate: 18,
  });

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLocalLoading(true);
      const { data } = await getBillsApi({ status: statusFilter !== 'all' ? statusFilter : '' });
      dispatch(setBills(data.data?.bills || []));
      setLocalError('');
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to fetch bills');
      console.error('Error fetching bills:', err);
    } finally {
      setLocalLoading(false);
    }
  };

  const handleAddItem = () => {
    if (newItem.description && newItem.quantity && newItem.unit_price) {
      const amount = newItem.quantity * newItem.unit_price;
      const gst = (amount * newItem.gst_rate) / 100;
      const total = amount + gst;

      setFormData(prev => ({
        ...prev,
        items: [...prev.items, { ...newItem, amount, gst, total }],
      }));
      setNewItem({ description: '', quantity: 1, unit_price: 0, gst_rate: 18 });
    }
  };

  const handleRemoveItem = (index) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const calculateTotals = () => {
    let subtotal = 0;
    let totalGst = 0;

    formData.items.forEach(item => {
      subtotal += item.amount || 0;
      totalGst += item.gst || 0;
    });

    return {
      subtotal,
      gst: totalGst,
      total: subtotal + totalGst,
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.customer_name || !formData.bill_date || formData.items.length === 0) {
      setLocalError('Please fill all required fields');
      return;
    }

    try {
      const submitData = {
        ...formData,
        items: formData.items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unit_price: item.unit_price,
          gst_rate: item.gst_rate,
        })),
      };

      if (editId) {
        await updateBillApi(editId, submitData);
        dispatch(updateBill({ id: editId, ...submitData }));
        setSuccess('Bill updated successfully');
      } else {
        const { data } = await createBillApi(submitData);
        dispatch(addBill(data.data?.bill || { id: Date.now(), ...submitData }));
        setSuccess('Bill created successfully');
      }

      resetForm();
      setShowForm(false);
      setEditId(null);
      await fetchBills();
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to save bill');
    }
  };

  const handleEdit = async (bill) => {
    try {
      const { data } = await getBillByIdApi(bill.id);
      const billData = data.data?.bill || bill;
      setFormData({
        bill_number: billData.bill_number || '',
        customer_name: billData.customer_name || '',
        customer_email: billData.customer_email || '',
        customer_phone: billData.customer_phone || '',
        bill_date: billData.bill_date?.split('T')[0] || new Date().toISOString().split('T')[0],
        due_date: billData.due_date?.split('T')[0] || '',
        items: billData.items || [],
        notes: billData.notes || '',
        status: billData.status || 'draft',
      });
      setEditId(bill.id);
      setShowForm(true);
    } catch (err) {
      setLocalError('Failed to fetch bill details');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await deleteBillApi(id);
        dispatch(deleteBill(id));
        setSuccess('Bill deleted successfully');
        await fetchBills();
      } catch (err) {
        setLocalError(err.response?.data?.message || 'Failed to delete bill');
      }
    }
  };

  const handleSendBill = async (id) => {
    try {
      await sendBillApi(id, {});
      setSuccess('Bill sent successfully');
      await fetchBills();
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to send bill');
    }
  };

  const resetForm = () => {
    setFormData({
      bill_number: '',
      customer_name: '',
      customer_email: '',
      customer_phone: '',
      bill_date: new Date().toISOString().split('T')[0],
      due_date: '',
      items: [],
      notes: '',
      status: 'draft',
    });
    setNewItem({ description: '', quantity: 1, unit_price: 0, gst_rate: 18 });
  };

  const handleViewBill = (bill) => {
    setSelectedBill(bill);
    setViewMode('view');
  };

  const filteredBills = bills.filter(bill => {
    const matchesSearch = bill.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bill.bill_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bill.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totals = calculateTotals();

  if (viewMode === 'view' && selectedBill) {
    return (
      <div className="p-6 bg-gray-950 min-h-screen">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Bill #{selectedBill.bill_number}</h1>
            <button
              onClick={() => setViewMode('list')}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Back to List
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-gray-600 text-sm">Bill Date</p>
              <p className="font-semibold">{new Date(selectedBill.bill_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Due Date</p>
              <p className="font-semibold">{new Date(selectedBill.due_date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Customer</p>
              <p className="font-semibold">{selectedBill.customer_name}</p>
            </div>
            <div>
              <p className="text-gray-600 text-sm">Status</p>
              <span className={`inline-block px-3 py-1 rounded-full text-white text-xs font-semibold ${
                selectedBill.status === 'paid' ? 'bg-green-600' :
                selectedBill.status === 'sent' ? 'bg-blue-600' :
                'bg-yellow-600'
              }`}>
                {selectedBill.status.toUpperCase()}
              </span>
            </div>
          </div>

          <table className="w-full mb-6 border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-2">Description</th>
                <th className="text-right py-2">Qty</th>
                <th className="text-right py-2">Rate</th>
                <th className="text-right py-2">Amount</th>
                <th className="text-right py-2">GST %</th>
                <th className="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedBill.items?.map((item, idx) => (
                <tr key={idx} className="border-b border-gray-200">
                  <td className="py-2">{item.description}</td>
                  <td className="text-right">{item.quantity}</td>
                  <td className="text-right">₹{item.unit_price?.toFixed(2)}</td>
                  <td className="text-right">₹{(item.quantity * item.unit_price)?.toFixed(2)}</td>
                  <td className="text-right">{item.gst_rate}%</td>
                  <td className="text-right font-semibold">₹{(item.quantity * item.unit_price * (1 + item.gst_rate / 100))?.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end mb-6">
            <div className="w-64">
              <div className="flex justify-between py-2 border-t-2 border-gray-300">
                <span>Subtotal:</span>
                <span>₹{selectedBill.items?.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 border-b-2 border-gray-300">
                <span>GST:</span>
                <span>₹{selectedBill.items?.reduce((sum, item) => sum + ((item.quantity * item.unit_price * item.gst_rate) / 100), 0)?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-2 text-xl font-bold">
                <span>Total:</span>
                <span>₹{selectedBill.items?.reduce((sum, item) => sum + (item.quantity * item.unit_price * (1 + item.gst_rate / 100)), 0)?.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {selectedBill.notes && (
            <div className="mb-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-gray-600 text-sm">Notes</p>
              <p>{selectedBill.notes}</p>
            </div>
          )}

          <div className="flex gap-3">
            {selectedBill.status === 'draft' && (
              <button
                onClick={() => handleSendBill(selectedBill.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Send size={16} /> Send Bill
              </button>
            )}
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
            >
              <Download size={16} /> Print / Download
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-950 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Bills Management</h1>
        <p className="text-gray-400">Create and manage customer bills</p>
      </div>

      {/* Messages */}
      {localError && (
        <div className="mb-4 p-4 bg-red-900 text-red-100 rounded-lg flex justify-between items-center">
          <span>{localError}</span>
          <button onClick={() => setLocalError('')}><X size={20} /></button>
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-900 text-green-100 rounded-lg flex justify-between items-center">
          <span>{success}</span>
          <button onClick={() => setSuccess('')}><X size={20} /></button>
        </div>
      )}

      {/* Action & Filter Bar */}
      <div className="mb-6 flex gap-4 items-center bg-gray-900 p-4 rounded-lg">
        <button
          onClick={() => {
            setShowForm(true);
            resetForm();
            setEditId(null);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <Plus size={18} /> Create Bill
        </button>

        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer or bill number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="sent">Sent</option>
          <option value="paid">Paid</option>
        </select>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
          <div className="bg-gray-900 rounded-lg shadow-xl w-full max-w-2xl my-8">
            <div className="sticky top-0 bg-gray-800 px-6 py-4 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">{editId ? 'Edit Bill' : 'Create New Bill'}</h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                  setEditId(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {/* Customer Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Customer Name *</label>
                  <input
                    type="text"
                    value={formData.customer_name}
                    onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Customer name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Bill Number</label>
                  <input
                    type="text"
                    value={formData.bill_number}
                    onChange={(e) => setFormData({ ...formData, bill_number: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="Auto-generated"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.customer_email}
                    onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="customer@example.com"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.customer_phone}
                    onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Bill Date *</label>
                  <input
                    type="date"
                    value={formData.bill_date}
                    onChange={(e) => setFormData({ ...formData, bill_date: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Due Date</label>
                  <input
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Bill Items */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4 mt-6">Bill Items *</h3>

                {/* Add Item Form */}
                <div className="bg-gray-800 p-4 rounded-lg mb-4 border border-gray-700">
                  <div className="grid grid-cols-12 gap-3 mb-3">
                    <input
                      type="text"
                      placeholder="Description"
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      className="col-span-4 px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: parseFloat(e.target.value) || 0 })}
                      className="col-span-2 px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                      min="0"
                      step="0.01"
                    />
                    <input
                      type="number"
                      placeholder="Rate"
                      value={newItem.unit_price}
                      onChange={(e) => setNewItem({ ...newItem, unit_price: parseFloat(e.target.value) || 0 })}
                      className="col-span-2 px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                      min="0"
                      step="0.01"
                    />
                    <select
                      value={newItem.gst_rate}
                      onChange={(e) => setNewItem({ ...newItem, gst_rate: parseFloat(e.target.value) })}
                      className="col-span-2 px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-sm"
                    >
                      <option value={0}>0%</option>
                      <option value={5}>5%</option>
                      <option value={12}>12%</option>
                      <option value={18}>18%</option>
                      <option value={28}>28%</option>
                    </select>
                    <button
                      type="button"
                      onClick={handleAddItem}
                      className="col-span-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm"
                    >
                      Add Item
                    </button>
                  </div>
                </div>

                {/* Items List */}
                {formData.items.length > 0 && (
                  <div className="bg-gray-800 rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-700">
                        <tr>
                          <th className="px-4 py-2 text-left">Description</th>
                          <th className="px-4 py-2 text-right">Qty</th>
                          <th className="px-4 py-2 text-right">Rate</th>
                          <th className="px-4 py-2 text-right">Amount</th>
                          <th className="px-4 py-2 text-right">GST</th>
                          <th className="px-4 py-2 text-right">Total</th>
                          <th className="px-4 py-2 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="text-gray-200">
                        {formData.items.map((item, idx) => {
                          const amount = item.quantity * item.unit_price;
                          const gst = (amount * item.gst_rate) / 100;
                          return (
                            <tr key={idx} className="border-t border-gray-700">
                              <td className="px-4 py-2">{item.description}</td>
                              <td className="px-4 py-2 text-right">{item.quantity}</td>
                              <td className="px-4 py-2 text-right">₹{item.unit_price.toFixed(2)}</td>
                              <td className="px-4 py-2 text-right">₹{amount.toFixed(2)}</td>
                              <td className="px-4 py-2 text-right">₹{gst.toFixed(2)}</td>
                              <td className="px-4 py-2 text-right font-semibold">₹{(amount + gst).toFixed(2)}</td>
                              <td className="px-4 py-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(idx)}
                                  className="text-red-400 hover:text-red-300"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {formData.items.length === 0 && (
                  <div className="text-center py-4 text-gray-400 bg-gray-800 rounded-lg">
                    No items added yet. Add items to the bill above.
                  </div>
                )}
              </div>

              {/* Totals */}
              {formData.items.length > 0 && (
                <div className="bg-gray-800 p-4 rounded-lg mt-4">
                  <div className="space-y-2 text-right text-white">
                    <div className="flex justify-end gap-4">
                      <span>Subtotal:</span>
                      <span className="w-32 font-semibold">₹{totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-end gap-4">
                      <span>Total GST:</span>
                      <span className="w-32 font-semibold">₹{totals.gst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-end gap-4 text-xl font-bold pt-2 border-t border-gray-700">
                      <span>Grand Total:</span>
                      <span className="w-32">₹{totals.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 text-white border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
                  placeholder="Add any notes or terms..."
                  rows="3"
                />
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  {editId ? 'Update Bill' : 'Create Bill'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                    setEditId(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bills Table */}
      {localLoading ? (
        <Loader />
      ) : (
        <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden">
          {filteredBills.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800 border-b border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-white font-semibold">Bill Number</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Customer</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Amount</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Bill Date</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Due Date</th>
                    <th className="px-6 py-4 text-left text-white font-semibold">Status</th>
                    <th className="px-6 py-4 text-center text-white font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredBills.map((bill) => {
                    const total = bill.items?.reduce((sum, item) => 
                      sum + (item.quantity * item.unit_price * (1 + item.gst_rate / 100)), 0) || 0;

                    return (
                      <tr key={bill.id} className="hover:bg-gray-800 transition-colors">
                        <td className="px-6 py-4 text-gray-200 font-medium">{bill.bill_number}</td>
                        <td className="px-6 py-4 text-gray-200">{bill.customer_name}</td>
                        <td className="px-6 py-4 text-gray-200 font-semibold">₹{total.toFixed(2)}</td>
                        <td className="px-6 py-4 text-gray-400">{new Date(bill.bill_date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-gray-400">{bill.due_date ? new Date(bill.due_date).toLocaleDateString() : '-'}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block px-3 py-1 rounded-full text-white text-xs font-semibold ${
                            bill.status === 'paid' ? 'bg-green-600' :
                            bill.status === 'sent' ? 'bg-blue-600' :
                            'bg-yellow-600'
                          }`}>
                            {bill.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() => handleViewBill(bill)}
                              className="p-2 text-blue-400 hover:text-blue-300 hover:bg-gray-800 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye size={18} />
                            </button>
                            {bill.status === 'draft' && (
                              <>
                                <button
                                  onClick={() => handleEdit(bill)}
                                  className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-gray-800 rounded-lg transition-colors"
                                  title="Edit"
                                >
                                  <Edit2 size={18} />
                                </button>
                                <button
                                  onClick={() => handleDelete(bill.id)}
                                  className="p-2 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-lg transition-colors"
                                  title="Delete"
                                >
                                  <Trash2 size={18} />
                                </button>
                              </>
                            )}
                            {bill.status === 'draft' && (
                              <button
                                onClick={() => handleSendBill(bill.id)}
                                className="p-2 text-green-400 hover:text-green-300 hover:bg-gray-800 rounded-lg transition-colors"
                                title="Send"
                              >
                                <Send size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">No bills found</p>
              <button
                onClick={() => {
                  setShowForm(true);
                  resetForm();
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center gap-2"
              >
                <Plus size={18} /> Create Your First Bill
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

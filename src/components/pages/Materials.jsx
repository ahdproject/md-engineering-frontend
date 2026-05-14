import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';
import { getMaterialsApi, createMaterialApi, updateMaterialApi, deleteMaterialApi } from '../../services/repository/masterRepository';
import Loader from '../common/Loader';

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: '', unit: 'kgs', default_rate: '', hsn_code: '', gst_rate: 18 });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const units = ['kgs', 'nos', 'ltrs', 'mtrs', 'pcs'];

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const { data } = await getMaterialsApi();
      setMaterials(data.data?.materials || []);
    } catch (err) {
      setError('Failed to fetch materials');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editId) {
        await updateMaterialApi(editId, formData);
        setSuccess('Material updated successfully');
      } else {
        await createMaterialApi(formData);
        setSuccess('Material added successfully');
      }
      setFormData({ name: '', unit: 'kgs', default_rate: '', hsn_code: '', gst_rate: 18 });
      setEditId(null);
      setShowForm(false);
      fetchMaterials();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save material');
    }
  };

  const handleEdit = (material) => {
    setFormData(material);
    setEditId(material.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      await deleteMaterialApi(id);
      setSuccess('Material deleted successfully');
      fetchMaterials();
    } catch (err) {
      setError('Failed to delete material');
    }
  };

  const resetForm = () => {
    setFormData({ name: '', unit: 'kgs', default_rate: '', hsn_code: '', gst_rate: 18 });
    setEditId(null);
    setShowForm(false);
  };

  if (loading) return <Loader text="Loading materials..." />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-black">Materials Master</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition"
        >
          <Plus size={20} /> Add Material
        </button>
      </div>

      {/* Messages */}
      {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">{error}</div>}
      {success && <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg">{success}</div>}

      {/* Form */}
      {showForm && (
        <div className="bg-white border-2 border-gray-200 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-black mb-4">{editId ? 'Edit Material' : 'Add New Material'}</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Material Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-black focus:outline-none"
              required
            />
            <select
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-black focus:outline-none"
            >
              {units.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
            <input
              type="number"
              placeholder="Default Rate"
              value={formData.default_rate}
              onChange={(e) => setFormData({ ...formData, default_rate: e.target.value })}
              className="border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-black focus:outline-none"
              step="0.01"
              required
            />
            <input
              type="text"
              placeholder="HSN Code"
              value={formData.hsn_code}
              onChange={(e) => setFormData({ ...formData, hsn_code: e.target.value })}
              className="border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-black focus:outline-none"
            />
            <input
              type="number"
              placeholder="GST Rate (%)"
              value={formData.gst_rate}
              onChange={(e) => setFormData({ ...formData, gst_rate: e.target.value })}
              className="border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-black focus:outline-none"
              step="0.01"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition font-semibold"
              >
                {editId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg transition font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-100 border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-black">Name</th>
                <th className="px-4 py-3 text-left font-semibold text-black">Unit</th>
                <th className="px-4 py-3 text-left font-semibold text-black">Default Rate</th>
                <th className="px-4 py-3 text-left font-semibold text-black">HSN Code</th>
                <th className="px-4 py-3 text-left font-semibold text-black">GST Rate</th>
                <th className="px-4 py-3 text-left font-semibold text-black">Status</th>
                <th className="px-4 py-3 text-center font-semibold text-black">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {materials.map((material) => (
                <tr key={material.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-black font-medium">{material.name}</td>
                  <td className="px-4 py-3 text-black">{material.unit}</td>
                  <td className="px-4 py-3 text-black">₹{Number(material.default_rate).toFixed(2)}</td>
                  <td className="px-4 py-3 text-black">{material.hsn_code || '-'}</td>
                  <td className="px-4 py-3 text-black">{material.gst_rate}%</td>
                  <td className="px-4 py-3">
                    {material.is_active ? (
                      <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        <Eye size={14} /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
                        <EyeOff size={14} /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEdit(material)}
                      className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(material.id)}
                      className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {materials.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">No materials found. Create one to get started.</p>
        </div>
      )}
    </div>
  );
}

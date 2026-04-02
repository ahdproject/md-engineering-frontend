import React, { useEffect, useState } from 'react';
import { UserPlus, Shield, ToggleLeft, ToggleRight, ChevronDown, ChevronUp } from 'lucide-react';
import { getUsersApi, createUserApi, updatePermApi, deactivateUserApi } from '../../services/repository/userRepository';
import Loader from '../common/Loader';

const MODULES = ['stock','pl','salary','attendance','cash_expense','masters'];
const ROLE_LABELS = { 1:'Admin', 2:'Manager', 3:'Staff' };

export default function Users() {
  const [users, setUsers]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [form, setForm]         = useState({ name:'', email:'', password:'', role_id:2, permissions: MODULES.map(m => ({ module:m, can_view:true, can_edit:false })) });
  const [saving, setSaving]     = useState(false);
  const [msg, setMsg]           = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getUsersApi();
      setUsers(data.data?.users || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await createUserApi(form);
      setMsg('User created successfully');
      setShowForm(false);
      setForm({ name:'', email:'', password:'', role_id:2, permissions: MODULES.map(m => ({ module:m, can_view:true, can_edit:false })) });
      load();
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error creating user');
    }
    setSaving(false);
    setTimeout(() => setMsg(''), 3000);
  };

  const toggleActive = async (user) => {
    try {
      await updatePermApi(user.id, { is_active: !user.is_active, permissions:[] });
      load();
    } catch {}
  };

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[#2d3748]">User Management</h2>
        <button onClick={() => setShowForm(p => !p)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#6D94C5] hover:bg-[#5a7eb0]
                     text-white text-sm font-semibold rounded-xl transition-all">
          <UserPlus size={16} />
          Add User
        </button>
      </div>

      {msg && (
        <div className={`px-4 py-3 rounded-xl text-sm font-medium ${msg.includes('success') ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
          {msg}
        </div>
      )}

      {/* Create Form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-[#E8DFCA] p-6">
          <h3 className="font-bold text-[#2d3748] mb-5">Create New User</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {[['Name','name','text','Full name'],['Email','email','email','user@mdengineers.com'],['Password','password','password','Min 6 chars']].map(([label,key,type,ph]) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-[#718096] mb-1.5">{label}</label>
                  <input type={type} required value={form[key]} placeholder={ph}
                    onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm
                               bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5] focus:ring-2 focus:ring-[#CBDCEB]" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-semibold text-[#718096] mb-1.5">Role</label>
                <select value={form.role_id} onChange={e => setForm(p => ({ ...p, role_id: parseInt(e.target.value) }))}
                  className="w-full px-4 py-2.5 border border-[#E8DFCA] rounded-xl text-sm bg-[#F5EFE6] focus:outline-none focus:border-[#6D94C5]">
                  <option value={2}>Manager</option>
                  <option value={3}>Staff</option>
                </select>
              </div>
            </div>

            {/* Permissions */}
            <div>
              <label className="block text-xs font-semibold text-[#718096] mb-2">Module Permissions</label>
              <div className="grid grid-cols-3 gap-2">
                {form.permissions.map((p, i) => (
                  <div key={p.module} className="bg-[#F5EFE6] rounded-xl p-3">
                    <p className="text-xs font-bold text-[#4a5568] capitalize mb-2">{p.module.replace('_',' ')}</p>
                    <div className="flex gap-3">
                      {['can_view','can_edit'].map(f => (
                        <label key={f} className="flex items-center gap-1 text-xs text-[#718096] cursor-pointer">
                          <input type="checkbox" checked={p[f]}
                            onChange={e => setForm(prev => {
                              const perms = [...prev.permissions];
                              perms[i] = { ...perms[i], [f]: e.target.checked };
                              return { ...prev, permissions: perms };
                            })}
                            className="accent-[#6D94C5]" />
                          {f === 'can_view' ? 'View' : 'Edit'}
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving}
                className="px-6 py-2.5 bg-[#6D94C5] text-white text-sm font-semibold rounded-xl
                           hover:bg-[#5a7eb0] disabled:opacity-60 transition-all">
                {saving ? 'Creating...' : 'Create User'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 py-2.5 bg-[#E8DFCA] text-[#4a5568] text-sm font-semibold rounded-xl hover:bg-[#d4cdb8] transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      {loading ? <Loader /> : (
        <div className="space-y-3">
          {users.map(u => (
            <div key={u.id} className="bg-white rounded-2xl border border-[#E8DFCA] overflow-hidden">
              <div className="flex items-center gap-4 px-5 py-4">
                <div className="w-10 h-10 bg-[#CBDCEB] rounded-xl flex items-center justify-center font-bold text-[#6D94C5]">
                  {u.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#2d3748] text-sm">{u.name}</p>
                  <p className="text-xs text-[#718096]">{u.email}</p>
                </div>
                <span className="text-xs bg-[#CBDCEB] text-[#6D94C5] px-3 py-1 rounded-full font-semibold capitalize">
                  {u.role}
                </span>
                <button onClick={() => toggleActive(u)} className="transition-all">
                  {u.is_active
                    ? <ToggleRight size={28} className="text-[#6D94C5]" />
                    : <ToggleLeft  size={28} className="text-[#E8DFCA]" />}
                </button>
                <button onClick={() => setExpanded(expanded === u.id ? null : u.id)}
                  className="text-[#718096] hover:text-[#6D94C5] transition-colors">
                  {expanded === u.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>

              {expanded === u.id && (
                <div className="px-5 pb-4 border-t border-[#F5EFE6]">
                  <p className="text-xs font-bold text-[#718096] uppercase tracking-wider mt-3 mb-2 flex items-center gap-2">
                    <Shield size={12} /> Permissions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(u.permissions || {}).map(([mod, perm]) => (
                      <span key={mod} className={`text-xs px-3 py-1 rounded-full font-medium ${perm.can_edit ? 'bg-[#6D94C5] text-white' : 'bg-[#CBDCEB] text-[#6D94C5]'}`}>
                        {mod.replace('_',' ')} {perm.can_edit ? '(Edit)' : '(View)'}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
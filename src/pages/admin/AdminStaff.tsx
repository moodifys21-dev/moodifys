import React, { useState, useMemo } from 'react'
import { useStaffStore } from '@/stores/staffStore'
import { AdminRole, AdminUser, PermissionKey, ROLE_LABELS, ROLE_PERMISSIONS } from '@/types/admin'
import { formatDate } from '@/lib/utils'
import {
  UserPlus,
  Search,
  Key,
  X,
  Trash2,
  Power,
} from 'lucide-react'

export const AdminStaff: React.FC = () => {
  const { staff, inviteStaffMember, updateStaffRole, updateStaffPermissions, toggleStaffStatus, deleteStaffMember } = useStaffStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  // Edit Permissions Modal
  const [editingStaff, setEditingStaff] = useState<AdminUser | null>(null)
  const [selectedRole, setSelectedRole] = useState<AdminRole>('MANAGER')
  const [selectedPermissions, setSelectedPermissions] = useState<PermissionKey[]>([])

  // Invite Modal
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [inviteName, setInviteName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<AdminRole>('MANAGER')

  const permissionCategories: { label: string; permissions: { key: PermissionKey; desc: string }[] }[] = [
    {
      label: 'ORDERS & FULFILLMENT',
      permissions: [
        { key: 'orders.view', desc: 'View orders list and customer summaries' },
        { key: 'orders.update', desc: 'Modify order details and add staff notes' },
        { key: 'orders.fulfill', desc: 'Advance fulfillment stages & assign couriers' },
        { key: 'orders.cancel', desc: 'Cancel orders and trigger customer refunds' },
      ],
    },
    {
      label: 'PRODUCTS & INVENTORY',
      permissions: [
        { key: 'products.view', desc: 'View product blank catalog' },
        { key: 'products.create', desc: 'Create new garment blanks' },
        { key: 'products.update', desc: 'Edit prices, variants, and colors' },
        { key: 'products.delete', desc: 'Delete and archive garments' },
        { key: 'inventory.view', desc: 'View stock levels across SKUs' },
        { key: 'inventory.adjust', desc: 'Commit stock adjustments & movements' },
      ],
    },
    {
      label: 'CONTENT & HOMEPAGE CMS',
      permissions: [
        { key: 'homepage.view', desc: 'View homepage visual builder' },
        { key: 'homepage.update', desc: 'Edit homepage block copy & photos' },
        { key: 'homepage.publish', desc: 'Publish live changes and restore snapshots' },
        { key: 'categories.view', desc: 'View catalog categories' },
        { key: 'categories.update', desc: 'Create, edit, and reorder categories' },
        { key: 'media.upload', desc: 'Upload digital lookbook assets' },
        { key: 'media.delete', desc: 'Delete CDN media files' },
      ],
    },
    {
      label: 'CRM & AUDIT SECURITY',
      permissions: [
        { key: 'customers.view', desc: 'Inspect customer profiles & history' },
        { key: 'customers.update', desc: 'Edit VIP tiers and flag risk accounts' },
        { key: 'admin.users.view', desc: 'View staff members list' },
        { key: 'admin.users.update', desc: 'Manage staff roles and access control' },
        { key: 'audit_logs.view', desc: 'Inspect immutable system security logs' },
      ],
    },
  ]

  const filteredStaff = useMemo(() => {
    return staff.filter((s) => {
      const q = searchQuery.toLowerCase().trim()
      if (q) {
        const matchesName = s.fullName.toLowerCase().includes(q)
        const matchesEmail = s.email.toLowerCase().includes(q)
        if (!matchesName && !matchesEmail) return false
      }

      if (roleFilter !== 'all' && s.role !== roleFilter) {
        return false
      }

      return true
    })
  }, [staff, searchQuery, roleFilter])

  const openEditModal = (member: AdminUser) => {
    setEditingStaff(member)
    setSelectedRole(member.role)
    setSelectedPermissions(member.permissions)
  }

  const handleRoleChange = (newRole: AdminRole) => {
    setSelectedRole(newRole)
    // Auto-populate default permissions for selected role
    setSelectedPermissions(ROLE_PERMISSIONS[newRole])
  }

  const handleTogglePermission = (key: PermissionKey) => {
    if (selectedPermissions.includes(key)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== key))
    } else {
      setSelectedPermissions([...selectedPermissions, key])
    }
  }

  const handleSavePermissions = (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingStaff) return

    updateStaffRole(editingStaff.id, selectedRole)
    updateStaffPermissions(editingStaff.id, selectedPermissions)
    setEditingStaff(null)
  }

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteName.trim() || !inviteEmail.trim()) return

    inviteStaffMember(inviteName.trim(), inviteEmail.trim(), inviteRole)
    setInviteName('')
    setInviteEmail('')
    setIsInviteModalOpen(false)
  }

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#BEBDBB]/30">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#BEBDBB] uppercase">
            ACCESS CONTROL & GOVERNANCE
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#090808]">
            ADMIN STAFF & RBAC PERMISSIONS MATRIX
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsInviteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85 transition-opacity"
          >
            <UserPlus size={14} />
            <span>INVITE STAFF MEMBER</span>
          </button>
        </div>
      </div>

      {/* SEARCH & FILTERS */}
      <div className="bg-white border border-[#E1E0DC] p-4 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          <div className="relative flex-1 min-w-[280px]">
            <Search
              size={14}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#BEBDBB]"
            />
            <input
              type="text"
              placeholder="Search staff by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F0EFED] border border-[#E1E0DC] pl-10 pr-4 py-2 text-xs text-[#090808] placeholder-[#BEBDBB] focus:outline-none focus:border-[#090808]"
            />
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-[#BEBDBB] uppercase text-[10px]">ROLE:</span>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="bg-[#F0EFED] border border-[#E1E0DC] px-2.5 py-1.5 font-bold uppercase focus:outline-none"
            >
              <option value="all">ALL ROLES</option>
              {Object.keys(ROLE_LABELS).map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r as AdminRole]}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* STAFF DIRECTORY TABLE */}
      <div className="bg-white border border-[#E1E0DC] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#F0EFED] text-[#BEBDBB] uppercase text-[10px] font-mono border-b border-[#E1E0DC]">
              <tr>
                <th className="p-4 pl-6">STAFF MEMBER</th>
                <th className="p-4">ASSIGNED ROLE</th>
                <th className="p-4">ACTIVE PERMISSIONS</th>
                <th className="p-4">LAST ACTIVE</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 pr-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1E0DC]">
              {filteredStaff.map((member) => (
                <tr key={member.id} className="hover:bg-[#FAFAFA] transition-colors">
                  
                  {/* Name & Email */}
                  <td className="p-4 pl-6">
                    <p className="font-bold text-xs text-[#090808]">{member.fullName}</p>
                    <p className="text-[10px] font-mono text-[#BEBDBB]">{member.email}</p>
                  </td>

                  {/* Role */}
                  <td className="p-4">
                    <span className="font-mono text-xs font-bold text-[#090808] uppercase">
                      {ROLE_LABELS[member.role] || member.role}
                    </span>
                  </td>

                  {/* Permissions count */}
                  <td className="p-4 font-mono text-xs text-[#302F2E]">
                    <span className="font-bold text-[#090808]">{member.permissions.length}</span> granular keys
                  </td>

                  {/* Last Active */}
                  <td className="p-4 font-mono text-xs text-[#BEBDBB]">
                    {member.lastActiveAt ? formatDate(member.lastActiveAt) : 'Invited / Pending'}
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <span className={`inline-flex items-center text-[9px] font-mono font-bold px-2 py-0.5 uppercase border ${
                      member.isActive
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-rose-50 text-rose-800 border-rose-300'
                    }`}>
                      {member.isActive ? 'ACTIVE' : 'DEACTIVATED'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEditModal(member)}
                        className="px-2.5 py-1 bg-[#090808] text-white hover:opacity-85 text-[10px] font-mono font-bold uppercase transition-opacity flex items-center gap-1"
                        title="Configure RBAC Permissions"
                      >
                        <Key size={11} />
                        <span>PERMISSIONS</span>
                      </button>

                      {member.role !== 'SUPER_ADMIN' && (
                        <>
                          <button
                            type="button"
                            onClick={() => toggleStaffStatus(member.id)}
                            className="p-1 border border-[#E1E0DC] text-[#302F2E] hover:bg-[#F0EFED] transition-colors"
                            title={member.isActive ? 'Deactivate Access' : 'Reactivate Access'}
                          >
                            <Power size={12} className={member.isActive ? 'text-amber-700' : 'text-emerald-700'} />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete staff account for "${member.fullName}"?`)) {
                                deleteStaffMember(member.id)
                              }
                            }}
                            className="p-1 border border-[#E1E0DC] text-[#BEBDBB] hover:text-rose-700 hover:bg-rose-50 transition-colors"
                            title="Remove Staff Member"
                          >
                            <Trash2 size={12} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: RBAC PERMISSIONS MATRIX */}
      {editingStaff && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#090808] p-6 max-w-2xl w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between border-b border-[#E1E0DC] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#BEBDBB] uppercase">
                  RBAC ACCESS CONTROL MATRIX
                </span>
                <h3 className="font-display text-xl font-bold uppercase text-[#090808]">
                  {editingStaff.fullName}
                </h3>
                <p className="text-xs font-mono text-[#302F2E]">{editingStaff.email}</p>
              </div>

              <button
                type="button"
                onClick={() => setEditingStaff(null)}
                className="p-1 text-[#090808] hover:opacity-70"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSavePermissions} className="space-y-5 text-xs">
              
              {/* Role Preset Selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                  PRIMARY ROLE TEMPLATE
                </label>
                <select
                  value={selectedRole}
                  onChange={(e) => handleRoleChange(e.target.value as AdminRole)}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 font-mono text-xs font-bold uppercase focus:outline-none"
                >
                  {Object.keys(ROLE_LABELS).map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABELS[r as AdminRole]}
                    </option>
                  ))}
                </select>
                <p className="text-[10px] text-[#BEBDBB]">
                  Changing the role template automatically loads default baseline permissions below.
                </p>
              </div>

              {/* Granular Permissions Checklist */}
              <div className="space-y-4 pt-2 border-t border-[#E1E0DC]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] font-bold uppercase text-[#090808]">
                    GRANULAR CAPABILITY OVERRIDES ({selectedPermissions.length} ENABLED)
                  </span>
                </div>

                <div className="space-y-4">
                  {permissionCategories.map((cat, idx) => (
                    <div key={idx} className="space-y-2 p-3 bg-[#F0EFED] border border-[#E1E0DC]">
                      <span className="font-mono text-[10px] font-bold uppercase text-[#090808] block border-b border-[#E1E0DC] pb-1">
                        {cat.label}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {cat.permissions.map((p) => {
                          const isChecked = selectedPermissions.includes(p.key)
                          return (
                            <label
                              key={p.key}
                              className="flex items-start gap-2 cursor-pointer select-none"
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleTogglePermission(p.key)}
                                className="w-4 h-4 accent-[#090808] mt-0.5"
                              />
                              <div>
                                <span className="font-mono font-bold text-[11px] text-[#090808] block">
                                  {p.key}
                                </span>
                                <span className="text-[10px] text-[#302F2E] leading-tight block">
                                  {p.desc}
                                </span>
                              </div>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-[#E1E0DC]">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="flex-1 py-2 border border-[#090808] text-xs font-mono font-bold uppercase hover:bg-[#F0EFED]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85"
                >
                  SAVE ACCESS POLICY
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL: INVITE STAFF MEMBER */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#090808] p-6 max-w-md w-full space-y-5 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#E1E0DC] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#BEBDBB] uppercase">
                  STAFF ONBOARDING
                </span>
                <h3 className="font-display text-lg font-bold uppercase text-[#090808]">
                  INVITE STAFF OPERATOR
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsInviteModalOpen(false)}
                className="p-1 text-[#090808] hover:opacity-70"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                  FULL NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sen"
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 font-bold text-xs text-[#090808] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                  ORGANIZATION EMAIL *
                </label>
                <input
                  type="email"
                  required
                  placeholder="rahul.operations@moodifys.studio"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 font-mono text-xs text-[#090808] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                  INITIAL ROLE ASSIGNMENT *
                </label>
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value as AdminRole)}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 font-mono text-xs font-bold uppercase focus:outline-none"
                >
                  {Object.keys(ROLE_LABELS).map((r) => (
                    <option key={r} value={r}>
                      {ROLE_LABELS[r as AdminRole]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex gap-2 pt-3 border-t border-[#E1E0DC]">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="flex-1 py-2 border border-[#090808] text-xs font-mono font-bold uppercase hover:bg-[#F0EFED]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85"
                >
                  SEND INVITATION
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminStaff

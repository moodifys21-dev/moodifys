import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Plus, Trash2, Check } from 'lucide-react'

interface AddressItem {
  id: string
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

const INITIAL_ADDRESSES: AddressItem[] = [
  {
    id: 'addr-1',
    fullName: 'Vikramaditya Sen',
    phone: '+91 98765 43210',
    addressLine1: '42 Indiranagar 100ft Road',
    addressLine2: 'Apartment 4B',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560038',
    country: 'India',
    isDefault: true,
  },
  {
    id: 'addr-2',
    fullName: 'Vikramaditya Sen (Studio)',
    phone: '+91 98765 43210',
    addressLine1: 'Archival Labs, 18 Lavelle Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560001',
    country: 'India',
    isDefault: false,
  },
]

export const AccountAddresses: React.FC = () => {
  const [addresses, setAddresses] = useState<AddressItem[]>(INITIAL_ADDRESSES)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAddr, setNewAddr] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
  })

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    )
  }

  const handleDelete = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id))
  }

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAddr.fullName || !newAddr.addressLine1 || !newAddr.city) return

    const created: AddressItem = {
      id: `addr-${Date.now()}`,
      fullName: newAddr.fullName,
      phone: newAddr.phone || '+91 98765 43210',
      addressLine1: newAddr.addressLine1,
      city: newAddr.city,
      state: newAddr.state || 'Karnataka',
      postalCode: newAddr.postalCode || '560001',
      country: 'India',
      isDefault: addresses.length === 0,
    }

    setAddresses([...addresses, created])
    setShowAddForm(false)
    setNewAddr({ fullName: '', phone: '', addressLine1: '', city: '', state: '', postalCode: '' })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-[#E1E0DC] p-5 rounded-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold uppercase text-[#090808]">
            SAVED ADDRESSES ({addresses.length})
          </h2>
          <p className="text-xs text-[#302F2E]">
            Manage your personal shipping and studio delivery destinations.
          </p>
        </div>
        <Button
          variant="ink"
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
          className="gap-1.5"
        >
          <Plus size={14} />
          <span>ADD NEW DESTINATION</span>
        </Button>
      </div>

      {/* Add Form */}
      {showAddForm && (
        <form
          onSubmit={handleAddSubmit}
          className="bg-white border border-[#090808] p-6 rounded-sm space-y-4 shadow-sm"
        >
          <h3 className="font-display text-sm font-bold uppercase text-[#090808]">
            ADD NEW SHIPPING DESTINATION
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase block mb-1">
                CONTACT NAME
              </label>
              <input
                type="text"
                value={newAddr.fullName}
                onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                required
                className="w-full bg-[#F0EFED] border border-[#BEBDBB] px-3 py-2 text-xs font-bold text-[#090808] uppercase focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase block mb-1">
                PHONE NUMBER
              </label>
              <input
                type="tel"
                value={newAddr.phone}
                onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                className="w-full bg-[#F0EFED] border border-[#BEBDBB] px-3 py-2 text-xs font-bold text-[#090808] focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase block mb-1">
                STREET ADDRESS
              </label>
              <input
                type="text"
                value={newAddr.addressLine1}
                onChange={(e) => setNewAddr({ ...newAddr, addressLine1: e.target.value })}
                required
                className="w-full bg-[#F0EFED] border border-[#BEBDBB] px-3 py-2 text-xs font-bold text-[#090808] uppercase focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase block mb-1">
                CITY
              </label>
              <input
                type="text"
                value={newAddr.city}
                onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                required
                className="w-full bg-[#F0EFED] border border-[#BEBDBB] px-3 py-2 text-xs font-bold text-[#090808] uppercase focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold tracking-[0.2em] text-[#BEBDBB] uppercase block mb-1">
                PINCODE
              </label>
              <input
                type="text"
                value={newAddr.postalCode}
                onChange={(e) => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                className="w-full bg-[#F0EFED] border border-[#BEBDBB] px-3 py-2 text-xs font-mono text-[#090808] focus:outline-none"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button type="submit" variant="ink" size="sm">
              SAVE DESTINATION
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(false)}
            >
              CANCEL
            </Button>
          </div>
        </form>
      )}

      {/* Address Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`bg-white p-5 border rounded-sm flex flex-col justify-between space-y-4 ${
              addr.isDefault ? 'border-[#090808] shadow-xs' : 'border-[#E1E0DC]'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-display text-sm font-bold uppercase text-[#090808]">
                  {addr.fullName}
                </span>
                {addr.isDefault && (
                  <span className="text-[9px] font-bold tracking-wider bg-[#090808] text-white px-2 py-0.5 rounded uppercase">
                    PRIMARY
                  </span>
                )}
              </div>
              <div className="text-xs text-[#302F2E] space-y-0.5">
                <p>{addr.addressLine1}</p>
                {addr.addressLine2 && <p>{addr.addressLine2}</p>}
                <p>{addr.city}, {addr.state} - {addr.postalCode}</p>
                <p className="font-mono text-[11px] pt-1">{addr.phone}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#F0EFED] text-xs">
              {!addr.isDefault ? (
                <button
                  type="button"
                  onClick={() => handleSetDefault(addr.id)}
                  className="font-bold text-[#302F2E] hover:text-[#090808] underline underline-offset-4 uppercase"
                >
                  SET AS PRIMARY
                </button>
              ) : (
                <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                  <Check size={12} /> PRIMARY DESTINATION
                </span>
              )}

              <button
                type="button"
                onClick={() => handleDelete(addr.id)}
                className="text-[#BEBDBB] hover:text-red-600 p-1 transition-colors"
                title="Delete address"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

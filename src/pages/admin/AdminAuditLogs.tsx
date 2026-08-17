import React, { useState, useMemo } from 'react'
import { useAuditLogStore } from '@/stores/auditLogStore'
import { AuditRecord } from '@/types/audit'
import { formatDate } from '@/lib/utils'
import {
  Shield,
  Search,
  AlertTriangle,
  ShieldAlert,
  Info,
  Eye,
  X,
  Globe,
  Terminal,
  Activity,
} from 'lucide-react'

export const AdminAuditLogs: React.FC = () => {
  const { logs } = useAuditLogStore()

  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [severityFilter, setSeverityFilter] = useState<string>('all')

  // Diff Modal
  const [inspectedLog, setInspectedLog] = useState<AuditRecord | null>(null)

  // Metrics
  const totalEvents = logs.length
  const criticalCount = logs.filter((l) => l.severity === 'CRITICAL_SECURITY').length
  const warningCount = logs.filter((l) => l.severity === 'WARNING').length
  const uniqueActors = new Set(logs.map((l) => l.actorName)).size

  const filteredLogs = useMemo(() => {
    return logs.filter((l) => {
      // Search
      const q = searchQuery.toLowerCase().trim()
      if (q) {
        const matchesActor = l.actorName.toLowerCase().includes(q)
        const matchesAction = l.action.toLowerCase().includes(q)
        const matchesEntity = l.entityId.toLowerCase().includes(q)
        const matchesIP = l.ipAddress.toLowerCase().includes(q)
        if (!matchesActor && !matchesAction && !matchesEntity && !matchesIP) return false
      }

      // Category
      if (categoryFilter !== 'all' && l.category !== categoryFilter) {
        return false
      }

      // Severity
      if (severityFilter !== 'all' && l.severity !== severityFilter) {
        return false
      }

      return true
    })
  }, [logs, searchQuery, categoryFilter, severityFilter])

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#BEBDBB]/30">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#BEBDBB] uppercase">
            FORENSICS & COMPLIANCE
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#090808]">
            AUDIT LOG EXPLORER & SECURITY LEDGER
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#BEBDBB]">
          <Terminal size={14} className="text-[#090808]" />
          <span>IMMUTABLE WRITE-ONLY STREAM</span>
        </div>
      </div>

      {/* 4-COLUMN AUDIT METRICS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-[#E1E0DC] p-5 space-y-2">
          <div className="flex items-center justify-between text-[#BEBDBB]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">RECORDED EVENTS</span>
            <Activity size={16} className="text-[#090808]" />
          </div>
          <p className="font-mono text-3xl font-bold text-[#090808]">
            {totalEvents}
          </p>
          <p className="text-[10px] font-mono text-[#BEBDBB]">
            Cryptographically sealed entries
          </p>
        </div>

        <div className="bg-white border border-[#E1E0DC] p-5 space-y-2">
          <div className="flex items-center justify-between text-[#BEBDBB]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">SECURITY CRITICAL</span>
            <ShieldAlert size={16} className="text-rose-600" />
          </div>
          <p className="font-mono text-3xl font-bold text-rose-700">
            {criticalCount}
          </p>
          <p className="text-[10px] font-mono text-rose-800">
            Velocity failures & unauthorized attempts
          </p>
        </div>

        <div className="bg-white border border-[#E1E0DC] p-5 space-y-2">
          <div className="flex items-center justify-between text-[#BEBDBB]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">WARNING FLAGS</span>
            <AlertTriangle size={16} className="text-amber-600" />
          </div>
          <p className="font-mono text-3xl font-bold text-amber-700">
            {warningCount}
          </p>
          <p className="text-[10px] font-mono text-[#302F2E]">
            QC scrap & manual overrides
          </p>
        </div>

        <div className="bg-white border border-[#E1E0DC] p-5 space-y-2">
          <div className="flex items-center justify-between text-[#BEBDBB]">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider">ACTIVE OPERATORS</span>
            <Shield size={16} className="text-[#090808]" />
          </div>
          <p className="font-mono text-3xl font-bold text-[#090808]">
            {uniqueActors}
          </p>
          <p className="text-[10px] font-mono text-emerald-800">
            Authenticated actors on record
          </p>
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
              placeholder="Search audit records by actor, action, entity ID, or IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F0EFED] border border-[#E1E0DC] pl-10 pr-4 py-2 text-xs text-[#090808] placeholder-[#BEBDBB] focus:outline-none focus:border-[#090808]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[10px] font-mono text-[#BEBDBB] uppercase">CATEGORY:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-[#F0EFED] border border-[#E1E0DC] px-2.5 py-1.5 text-xs font-mono font-bold uppercase focus:outline-none"
              >
                <option value="all">ALL CATEGORIES</option>
                <option value="ORDERS">ORDERS</option>
                <option value="FULFILLMENT">FULFILLMENT</option>
                <option value="INVENTORY">INVENTORY</option>
                <option value="CMS_HOMEPAGE">CMS HOMEPAGE</option>
                <option value="STAFF_RBAC">STAFF RBAC</option>
                <option value="SECURITY_FRAUD">SECURITY & FRAUD</option>
              </select>
            </div>

            {/* Severity Filter */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-[10px] font-mono text-[#BEBDBB] uppercase">SEVERITY:</span>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="bg-[#F0EFED] border border-[#E1E0DC] px-2.5 py-1.5 text-xs font-mono font-bold uppercase focus:outline-none"
              >
                <option value="all">ALL SEVERITIES</option>
                <option value="INFO">INFO</option>
                <option value="WARNING">WARNING</option>
                <option value="CRITICAL_SECURITY">CRITICAL SECURITY</option>
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* MASTER AUDIT TABLE */}
      <div className="bg-white border border-[#E1E0DC] overflow-hidden shadow-xs">
        {filteredLogs.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <Shield size={32} className="mx-auto text-[#BEBDBB]" />
            <p className="font-mono text-xs font-bold text-[#BEBDBB] uppercase">
              NO AUDIT ENTRIES MATCHING SEARCH CRITERIA
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-[#F0EFED] text-[#BEBDBB] uppercase text-[10px] font-mono border-b border-[#E1E0DC]">
                <tr>
                  <th className="p-4 pl-6">TIMESTAMP</th>
                  <th className="p-4">ACTOR / ROLE</th>
                  <th className="p-4">ACTION EVENT</th>
                  <th className="p-4">TARGET ENTITY</th>
                  <th className="p-4">IP & GEO</th>
                  <th className="p-4">SEVERITY</th>
                  <th className="p-4 pr-6 text-right">PAYLOAD</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E1E0DC]">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-[#FAFAFA] transition-colors">
                    
                    {/* Timestamp */}
                    <td className="p-4 pl-6 font-mono text-[11px] text-[#090808]">
                      {formatDate(log.createdAt)}
                    </td>

                    {/* Actor */}
                    <td className="p-4">
                      <p className="font-bold text-xs text-[#090808]">{log.actorName}</p>
                      <p className="text-[10px] font-mono text-[#BEBDBB]">{log.actorRole}</p>
                    </td>

                    {/* Action */}
                    <td className="p-4">
                      <span className="font-mono font-bold text-xs text-[#090808] block">
                        {log.action}
                      </span>
                      <span className="text-[9px] font-mono uppercase text-[#302F2E]">
                        {log.category.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Entity */}
                    <td className="p-4 font-mono text-xs text-[#302F2E]">
                      <span className="text-[#BEBDBB] text-[10px] block">{log.entityType}</span>
                      <strong className="text-[#090808]">{log.entityId}</strong>
                    </td>

                    {/* IP & Location */}
                    <td className="p-4 font-mono text-xs">
                      <div className="flex items-center gap-1 text-[#090808]">
                        <Globe size={11} className="text-[#BEBDBB]" />
                        <span>{log.ipAddress}</span>
                      </div>
                      {log.location && (
                        <span className="text-[10px] text-[#BEBDBB]">{log.location}</span>
                      )}
                    </td>

                    {/* Severity */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-mono font-bold px-2 py-0.5 uppercase border ${
                        log.severity === 'CRITICAL_SECURITY'
                          ? 'bg-rose-50 text-rose-900 border-rose-300'
                          : log.severity === 'WARNING'
                          ? 'bg-amber-50 text-amber-900 border-amber-300'
                          : 'bg-emerald-50 text-emerald-900 border-emerald-300'
                      }`}>
                        {log.severity === 'CRITICAL_SECURITY' && <ShieldAlert size={10} className="text-rose-700" />}
                        {log.severity === 'WARNING' && <AlertTriangle size={10} className="text-amber-700" />}
                        {log.severity === 'INFO' && <Info size={10} className="text-emerald-700" />}
                        {log.severity.replace(/_/g, ' ')}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4 pr-6 text-right">
                      <button
                        type="button"
                        onClick={() => setInspectedLog(log)}
                        className="px-2.5 py-1 bg-[#090808] text-white hover:opacity-85 text-[10px] font-mono font-bold uppercase transition-opacity flex items-center gap-1 ml-auto"
                      >
                        <Eye size={11} />
                        <span>DIFF</span>
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL: STATE DIFF INSPECTOR */}
      {inspectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#090808] p-6 max-w-2xl w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between border-b border-[#E1E0DC] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#BEBDBB] uppercase">
                  FORENSIC STATE DIFF INSPECTOR
                </span>
                <h3 className="font-display text-lg font-bold uppercase text-[#090808]">
                  {inspectedLog.action}
                </h3>
                <p className="text-xs font-mono text-[#302F2E]">
                  Entity: {inspectedLog.entityType} ({inspectedLog.entityId})
                </p>
              </div>

              <button
                type="button"
                onClick={() => setInspectedLog(null)}
                className="p-1 text-[#090808] hover:opacity-70"
              >
                <X size={18} />
              </button>
            </div>

            {/* Forensic Metadata Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-[#F0EFED] border border-[#E1E0DC] text-[10px] font-mono">
              <div>
                <span className="text-[#BEBDBB] block uppercase">ACTOR:</span>
                <strong className="text-[#090808]">{inspectedLog.actorName}</strong>
              </div>
              <div>
                <span className="text-[#BEBDBB] block uppercase">ROLE:</span>
                <span className="text-[#302F2E]">{inspectedLog.actorRole}</span>
              </div>
              <div>
                <span className="text-[#BEBDBB] block uppercase">IP / GEO:</span>
                <span className="text-[#090808]">{inspectedLog.ipAddress}</span>
              </div>
              <div>
                <span className="text-[#BEBDBB] block uppercase">TIMESTAMP:</span>
                <span className="text-[#302F2E]">{formatDate(inspectedLog.createdAt)}</span>
              </div>
            </div>

            {/* Side-by-side Old vs New State Diff */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
              
              {/* OLD STATE */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#BEBDBB]">
                  STATE BEFORE MUTATION (OLD DATA)
                </span>
                <pre className="p-3 bg-[#090808] text-rose-400 font-mono text-[11px] overflow-x-auto max-h-48 border border-zinc-800">
                  {inspectedLog.oldData ? JSON.stringify(inspectedLog.oldData, null, 2) : 'null (Created)'}
                </pre>
              </div>

              {/* NEW STATE */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase text-emerald-800">
                  STATE AFTER MUTATION (NEW DATA)
                </span>
                <pre className="p-3 bg-[#090808] text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-48 border border-zinc-800">
                  {inspectedLog.newData ? JSON.stringify(inspectedLog.newData, null, 2) : 'null (Deleted)'}
                </pre>
              </div>

            </div>

            <div className="flex justify-end pt-3 border-t border-[#E1E0DC]">
              <button
                type="button"
                onClick={() => setInspectedLog(null)}
                className="px-5 py-2 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85"
              >
                CLOSE
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default AdminAuditLogs

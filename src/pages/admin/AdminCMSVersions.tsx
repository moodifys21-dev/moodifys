import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCMSVersionStore } from '@/stores/cmsVersionStore'
import { useCMSStore } from '@/stores/cmsStore'
import { CMSVersion } from '@/types/cmsVersion'
import { formatDate } from '@/lib/utils'
import {
  History,
  RotateCcw,
  Calendar,
  Eye,
  CheckCircle2,
  X,
  Clock,
  Trash2,
} from 'lucide-react'

export const AdminCMSVersions: React.FC = () => {
  const { versions, scheduled, loadVersionsFromSupabase, rollbackToVersion, scheduleRelease, cancelScheduledRelease } = useCMSVersionStore()
  const { config: currentConfig } = useCMSStore()

  useEffect(() => {
    loadVersionsFromSupabase()
  }, [loadVersionsFromSupabase])

  // Selected for inspection
  const [inspectedVersion, setInspectedVersion] = useState<CMSVersion | null>(null)

  // Scheduling Modal
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false)
  const [scheduleTitle, setScheduleTitle] = useState('')
  const [scheduleDateTime, setScheduleDateTime] = useState('')

  const handleRollback = async (ver: CMSVersion) => {
    if (
      window.confirm(
        `EMERGENCY ROLLBACK CONFIRMATION:\n\nAre you sure you want to rollback the live homepage storefront to "${ver.versionNumber}"?\n\nThis will immediately overwrite current live content.`
      )
    ) {
      const success = await rollbackToVersion(ver.id)
      if (success) {
        setInspectedVersion(null)
        alert(`Successfully restored homepage to version: ${ver.versionNumber}`)
      }
    }
  }

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!scheduleTitle.trim() || !scheduleDateTime) return

    scheduleRelease(
      scheduleTitle.trim().toUpperCase(),
      new Date(scheduleDateTime).toISOString(),
      currentConfig,
      'Content Manager'
    )

    setScheduleTitle('')
    setScheduleDateTime('')
    setIsScheduleModalOpen(false)
  }

  return (
    <div className="space-y-6 pb-20">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#BEBDBB]/30">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-[0.25em] text-[#BEBDBB] uppercase">
            AUDIT LOGS & SITE RECOVERY
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#090808]">
            CMS VERSIONING & ROLLBACK CONTROL
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsScheduleModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-[#090808] text-xs font-mono font-bold uppercase hover:bg-[#F0EFED] transition-colors"
          >
            <Calendar size={13} />
            <span>SCHEDULE CAMPAIGN RELEASE</span>
          </button>

          <Link
            to="/admin/cms/homepage"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85 transition-opacity"
          >
            <span>GO TO CMS BUILDER</span>
          </Link>
        </div>
      </div>

      {/* SECTION 1: SCHEDULED PUBLISHING QUEUE */}
      {scheduled.length > 0 && (
        <div className="bg-white border border-[#E1E0DC] p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#E1E0DC] pb-3">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-[#090808]" />
              <h3 className="font-display text-sm font-bold uppercase text-[#090808]">
                SCHEDULED STOREFRONT RELEASES ({scheduled.filter((s) => s.status === 'PENDING').length} PENDING)
              </h3>
            </div>
          </div>

          <div className="space-y-2">
            {scheduled.map((item) => (
              <div
                key={item.id}
                className="flex flex-wrap items-center justify-between p-3.5 bg-[#F0EFED] border border-[#E1E0DC] text-xs font-mono"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#090808]">{item.title}</span>
                    <span className={`px-1.5 py-0.2 text-[9px] font-bold uppercase border ${
                      item.status === 'PENDING'
                        ? 'bg-amber-100 text-amber-900 border-amber-300'
                        : 'bg-zinc-100 text-zinc-600 border-zinc-300'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#BEBDBB]">
                    TARGET LAUNCH: <strong className="text-[#302F2E]">{formatDate(item.scheduledAt)}</strong> • BY {item.authorName}
                  </p>
                </div>

                {item.status === 'PENDING' && (
                  <button
                    type="button"
                    onClick={() => cancelScheduledRelease(item.id)}
                    className="text-rose-700 hover:underline text-xs uppercase font-bold flex items-center gap-1"
                  >
                    <Trash2 size={12} />
                    <span>CANCEL SCHEDULE</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 2: VERSION HISTORY LEDGER */}
      <div className="bg-white border border-[#E1E0DC] overflow-hidden shadow-xs">
        <div className="p-4 bg-[#F0EFED] border-b border-[#E1E0DC] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History size={16} className="text-[#090808]" />
            <span className="text-xs font-mono font-bold uppercase text-[#090808]">
              IMMUTABLE VERSION SNAPSHOT LEDGER ({versions.length} COMMITS)
            </span>
          </div>
          <p className="text-[11px] text-[#302F2E] font-mono">
            Every publish creates a permanent rollback point.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-[#F0EFED]/60 text-[#BEBDBB] uppercase text-[10px] font-mono border-b border-[#E1E0DC]">
              <tr>
                <th className="p-4 pl-6">VERSION / RELEASE</th>
                <th className="p-4">CHANGE LOG SUMMARY</th>
                <th className="p-4">PUBLISHED BY</th>
                <th className="p-4">TIMESTAMP</th>
                <th className="p-4">STATUS</th>
                <th className="p-4 pr-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1E0DC]">
              {versions.map((ver) => (
                <tr key={ver.id} className="hover:bg-[#FAFAFA] transition-colors">
                  
                  {/* Version */}
                  <td className="p-4 pl-6 font-mono font-bold text-xs text-[#090808]">
                    {ver.versionNumber}
                  </td>

                  {/* Summary */}
                  <td className="p-4 text-xs text-[#090808] max-w-sm">
                    {ver.changeSummary}
                  </td>

                  {/* Author */}
                  <td className="p-4 font-mono text-xs text-[#302F2E]">
                    {ver.authorName}
                  </td>

                  {/* Timestamp */}
                  <td className="p-4 font-mono text-xs text-[#BEBDBB]">
                    {formatDate(ver.publishedAt)}
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    {ver.isActive ? (
                      <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5">
                        <CheckCircle2 size={10} className="text-emerald-700" />
                        ACTIVE ON LIVE STORE
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-[#BEBDBB] uppercase">
                        HISTORICAL ARCHIVE
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setInspectedVersion(ver)}
                        className="px-2.5 py-1 border border-[#E1E0DC] text-[#090808] hover:bg-[#F0EFED] text-[10px] font-mono font-bold uppercase transition-colors flex items-center gap-1"
                      >
                        <Eye size={11} />
                        <span>INSPECT SNAPSHOT</span>
                      </button>

                      {!ver.isActive && (
                        <button
                          type="button"
                          onClick={() => handleRollback(ver)}
                          className="px-2.5 py-1 bg-[#090808] text-white hover:opacity-85 text-[10px] font-mono font-bold uppercase transition-opacity flex items-center gap-1"
                        >
                          <RotateCcw size={11} />
                          <span>ROLLBACK</span>
                        </button>
                      )}
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: SNAPSHOT INSPECTOR */}
      {inspectedVersion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#090808] p-6 max-w-3xl w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-start justify-between border-b border-[#E1E0DC] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#BEBDBB] uppercase">
                  CMS VERSION SNAPSHOT INSPECTOR
                </span>
                <h3 className="font-display text-lg font-bold uppercase text-[#090808]">
                  {inspectedVersion.versionNumber}
                </h3>
                <p className="text-xs text-[#302F2E]">{inspectedVersion.changeSummary}</p>
              </div>

              <button
                type="button"
                onClick={() => setInspectedVersion(null)}
                className="p-1 text-[#090808] hover:opacity-70"
              >
                <X size={18} />
              </button>
            </div>

            {/* Visual Snapshot Details */}
            <div className="space-y-4 text-xs font-mono">
              <div className="p-4 bg-[#F0EFED] border border-[#E1E0DC] space-y-2">
                <div className="flex justify-between border-b border-[#E1E0DC] pb-1">
                  <span className="text-[#BEBDBB]">HERO HEADLINE:</span>
                  <span className="font-bold text-[#090808]">
                    {inspectedVersion.snapshot.hero.headlineLine1} {inspectedVersion.snapshot.hero.headlineLine2}
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#E1E0DC] pb-1">
                  <span className="text-[#BEBDBB]">TAGLINE:</span>
                  <span className="text-[#302F2E]">{inspectedVersion.snapshot.hero.tagline}</span>
                </div>
                <div className="flex justify-between border-b border-[#E1E0DC] pb-1">
                  <span className="text-[#BEBDBB]">SECTION SEQUENCE:</span>
                  <span className="text-[#090808] font-bold">
                    {inspectedVersion.snapshot.sectionsOrder.join(' → ')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#BEBDBB]">ANNOUNCEMENT TICKER:</span>
                  <span className="text-[#302F2E] truncate max-w-sm">
                    {inspectedVersion.snapshot.announcement.text}
                  </span>
                </div>
              </div>

              {/* JSON Payload Inspection */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-[#090808]">
                  COMPLETE STORE CONFIGURATION PAYLOAD (JSON)
                </label>
                <pre className="p-3 bg-[#090808] text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-56 border border-zinc-800">
                  {JSON.stringify(inspectedVersion.snapshot, null, 2)}
                </pre>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#E1E0DC]">
                <button
                  type="button"
                  onClick={() => setInspectedVersion(null)}
                  className="px-4 py-2 border border-[#090808] text-xs uppercase font-bold hover:bg-[#F0EFED]"
                >
                  CLOSE
                </button>

                {!inspectedVersion.isActive && (
                  <button
                    type="button"
                    onClick={() => handleRollback(inspectedVersion)}
                    className="px-5 py-2 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85 flex items-center gap-2 shadow-lg"
                  >
                    <RotateCcw size={13} />
                    <span>RESTORE THIS VERSION TO LIVE STORE</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* MODAL: SCHEDULE NEW RELEASE */}
      {isScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white border border-[#090808] p-6 max-w-lg w-full space-y-5 shadow-2xl">
            <div className="flex items-start justify-between border-b border-[#E1E0DC] pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold tracking-widest text-[#BEBDBB] uppercase">
                  AUTOMATED CAMPAIGN DEPLOYMENT
                </span>
                <h3 className="font-display text-lg font-bold uppercase text-[#090808]">
                  SCHEDULE STOREFRONT DROP
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsScheduleModalOpen(false)}
                className="p-1 text-[#090808] hover:opacity-70"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                  CAMPAIGN / DROP TITLE *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MONOCHROME AUTUMN DROP 05"
                  value={scheduleTitle}
                  onChange={(e) => setScheduleTitle(e.target.value)}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 font-bold uppercase text-xs text-[#090808] focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase text-[#090808]">
                  TARGET LAUNCH DATE & TIME *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={scheduleDateTime}
                  onChange={(e) => setScheduleDateTime(e.target.value)}
                  className="w-full bg-[#F0EFED] border border-[#E1E0DC] p-2.5 font-mono text-xs text-[#090808] focus:outline-none"
                />
              </div>

              <div className="p-3 bg-[#F0EFED] border border-[#E1E0DC] font-mono text-[10px] text-[#302F2E]">
                At the scheduled timestamp, the currently drafted CMS snapshot will automatically be published to the public storefront.
              </div>

              <div className="flex gap-2 pt-3 border-t border-[#E1E0DC]">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="flex-1 py-2 border border-[#090808] text-xs font-mono font-bold uppercase hover:bg-[#F0EFED]"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#090808] text-white text-xs font-mono font-bold uppercase hover:opacity-85"
                >
                  COMMIT TO RELEASE QUEUE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}

export default AdminCMSVersions

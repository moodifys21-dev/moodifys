import React from 'react'
import { Link } from 'react-router-dom'
import { useCMSStore } from '@/stores/cmsStore'
import { ANNOUNCEMENT_TEXT } from '@/lib/constants'

export const AnnouncementBar: React.FC = () => {
  const { config } = useCMSStore()
  const announcement = config?.announcement

  if (announcement && announcement.isEnabled === false) {
    return null
  }

  const text = announcement?.text || ANNOUNCEMENT_TEXT
  const bgColor = announcement?.backgroundColor || '#090808'
  const textColor = announcement?.textColor || '#E1E0DC'
  const linkText = announcement?.linkText
  const linkUrl = announcement?.linkUrl

  return (
    <div
      style={{ backgroundColor: bgColor, color: textColor }}
      className="text-[11px] font-medium tracking-wider uppercase py-2 px-4 border-b border-[#302F2E] transition-colors"
    >
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        {/* Left message & optional CTA link */}
        <div className="flex items-center space-x-2 truncate mx-auto md:mx-0">
          <span className="font-semibold tracking-widest truncate">
            {text}
          </span>
          {linkText && linkUrl && (
            <Link
              to={linkUrl}
              className="underline underline-offset-4 ml-2 font-bold hover:opacity-80 transition-opacity hidden sm:inline"
            >
              {linkText}
            </Link>
          )}
        </div>

        {/* Right utility links */}
        <div className="hidden md:flex items-center space-x-6 text-[10px] text-[#BEBDBB] tracking-widest">
          <Link to="/customize" className="hover:text-white transition-colors">
            STUDIO
          </Link>
          <span className="text-[#302F2E]">|</span>
          <Link to="/account/orders" className="hover:text-white transition-colors">
            TRACK ORDER
          </Link>
          <span className="text-[#302F2E]">|</span>
          <Link to="/help" className="hover:text-white transition-colors">
            HELP
          </Link>
        </div>
      </div>
    </div>
  )
}


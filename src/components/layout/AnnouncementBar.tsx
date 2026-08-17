import React from 'react'
import { Link } from 'react-router-dom'
import { ANNOUNCEMENT_TEXT } from '@/lib/constants'

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#090808] text-[#E1E0DC] text-[11px] font-medium tracking-wider uppercase py-2 px-4 border-b border-[#302F2E]">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between">
        {/* Left message */}
        <div className="flex items-center space-x-2 truncate">
          <span className="font-semibold text-white tracking-widest">
            {ANNOUNCEMENT_TEXT}
          </span>
        </div>

        {/* Right utility links */}
        <div className="hidden md:flex items-center space-x-6 text-[10px] text-[#BEBDBB] tracking-widest">
          <Link to="/app" className="hover:text-white transition-colors">
            DOWNLOAD APP
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

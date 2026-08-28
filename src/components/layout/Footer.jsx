import { Link } from 'react-router-dom'
import { HiOutlineAcademicCap } from 'react-icons/hi2'

export default function Footer() {
  return (
    <footer className="bg-[#fafafa] text-gray-600 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-3 group">
              <div className="w-7 h-7 bg-black text-white rounded-lg flex items-center justify-center shadow-xs">
                <HiOutlineAcademicCap className="text-base" />
              </div>
              <span className="text-base font-extrabold text-gray-950 tracking-tight">
                Campus Connect
              </span>
            </Link>
            <p className="text-gray-500 text-xs max-w-md leading-relaxed">
              The unified intelligent digital campus companion uniting academics, smart attendance, AI advisor, grievances, student requests, and verified credentials.
            </p>
          </div>

          {/* Student Services */}
          <div>
            <h4 className="text-gray-900 font-bold text-xs mb-3 uppercase tracking-wider">
              Student Services
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link to="/dashboard" className="text-xs text-gray-500 hover:text-black transition-colors">
                  Student Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard/academics" className="text-xs text-gray-500 hover:text-black transition-colors">
                  Academics & Schedule
                </Link>
              </li>
              <li>
                <Link to="/dashboard/smart-attendance" className="text-xs text-gray-500 hover:text-black transition-colors">
                  Smart Attendance & Bunk Predictor
                </Link>
              </li>
              <li>
                <Link to="/dashboard/ai-assistant" className="text-xs text-gray-500 hover:text-black transition-colors">
                  AI Campus Advisor
                </Link>
              </li>
            </ul>
          </div>

          {/* Events Hub */}
          <div>
            <h4 className="text-gray-900 font-bold text-xs mb-3 uppercase tracking-wider">
              Events & Portals
            </h4>
            <ul className="space-y-1.5">
              <li>
                <Link to="/events" className="text-xs text-gray-500 hover:text-black transition-colors">
                  Browse Campus Events
                </Link>
              </li>
              <li>
                <Link to="/my-tickets" className="text-xs text-gray-500 hover:text-black transition-colors">
                  My Tickets
                </Link>
              </li>
              <li>
                <Link to="/dashboard/certificates" className="text-xs text-gray-500 hover:text-black transition-colors">
                  Certificate Vault
                </Link>
              </li>
              <li>
                <Link to="/dashboard/requests" className="text-xs text-gray-500 hover:text-black transition-colors">
                  Digital Requests & Passes
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-gray-400">
            © 2026 Campus Connect • Intelligent Student Services Platform
          </p>
          <p className="text-[11px] text-gray-400">
            Engineered with modern Vercel-style aesthetics
          </p>
        </div>
      </div>
    </footer>
  )
}

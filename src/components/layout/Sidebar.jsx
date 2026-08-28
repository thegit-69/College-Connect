import { NavLink, Link } from 'react-router-dom'
import {
  IoGridOutline,
  IoSchoolOutline,
  IoCheckboxOutline,
  IoSparklesOutline,
  IoShieldCheckmarkOutline,
  IoBulbOutline,
  IoDocumentTextOutline,
  IoMegaphoneOutline,
  IoRibbonOutline,
  IoCalendarOutline,
  IoTicketOutline,
  IoAddCircleOutline,
  IoChevronBackOutline,
  IoChevronForwardOutline,
  IoCloseOutline
} from 'react-icons/io5'
import { HiOutlineAcademicCap } from 'react-icons/hi2'
import useAuthStore from '../../store/authStore'
import useCampusStore from '../../store/campusStore'

const NAVIGATION_GROUPS = [
  {
    title: 'Academics & Campus',
    links: [
      { label: 'Student Dashboard', path: '/dashboard', icon: <IoGridOutline />, end: true },
      { label: 'Academics & Schedule', path: '/dashboard/academics', icon: <IoSchoolOutline /> },
      { label: 'Attendance', path: '/dashboard/attendance', icon: <IoCheckboxOutline /> },
    ],
  },
  {
    title: 'AI Intelligence',
    links: [
      { label: 'AI Campus Advisor', path: '/dashboard/ai-assistant', icon: <IoSparklesOutline />, badge: 'AI' },
      { label: 'AI Recommendations', path: '/dashboard/recommendations', icon: <IoBulbOutline /> },
    ],
  },
  {
    title: 'Student Services',
    links: [
      { label: 'Requests', path: '/dashboard/requests', icon: <IoDocumentTextOutline /> },
      { label: 'Complaints', path: '/dashboard/complaints', icon: <IoMegaphoneOutline /> },
      { label: 'Certificate Vault', path: '/dashboard/certificates', icon: <IoRibbonOutline /> },
    ],
  },
  {
    title: 'Events Hub',
    links: [
      { label: 'Explore Events', path: '/events', icon: <IoCalendarOutline /> },
      { label: 'My Tickets', path: '/my-tickets', icon: <IoTicketOutline /> },
      { label: 'Manage Events', path: '/dashboard/events', icon: <IoCalendarOutline /> },
      { label: 'Create Event', path: '/dashboard/create', icon: <IoAddCircleOutline /> },
    ],
  },
]

export default function Sidebar({ isOpen, onClose }) {
  const { isSuperAdmin } = useAuthStore()
  const { isSidebarCollapsed, toggleSidebarCollapse, studentProfile } = useCampusStore()

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Vercel Light Sidebar Container */}
      <aside
        className={`
          fixed lg:sticky top-0 inset-y-0 left-0 z-50 h-screen
          bg-[#fafafa] text-gray-900 flex flex-col border-r border-gray-200
          transition-all duration-300 ease-in-out select-none
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
          w-64
        `}
      >
        {/* Header Branding */}
        <div className="p-4 sm:p-5 border-b border-gray-200 bg-white flex items-center justify-between">
          <Link
            to="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3 overflow-hidden group"
          >
            <div className="w-9 h-9 min-w-[2.25rem] bg-black text-white rounded-xl flex items-center justify-center shadow-xs group-hover:bg-primary-600 transition-colors">
              <HiOutlineAcademicCap className="text-xl" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-extrabold text-gray-950 tracking-tight leading-tight">
                  Campus Connect
                </span>
                <span className="text-[10px] text-gray-500 font-medium tracking-wide">
                  Student Life Platform
                </span>
              </div>
            )}
          </Link>

          {/* Mobile Close Button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 lg:hidden"
            aria-label="Close Sidebar"
          >
            <IoCloseOutline size={20} />
          </button>
        </div>

        {/* Scrollable Navigation Groups */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 scrollbar-thin scrollbar-thumb-gray-200">
          {NAVIGATION_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              {!isSidebarCollapsed ? (
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 mb-1.5">
                  {group.title}
                </p>
              ) : (
                <div className="h-px bg-gray-200 my-2.5 mx-2" />
              )}

              <ul className="space-y-0.5">
                {group.links.map((link) => (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      end={link.end}
                      onClick={onClose}
                      title={isSidebarCollapsed ? link.label : undefined}
                      className={({ isActive }) =>
                        `group flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                          isActive
                            ? 'bg-black text-white shadow-xs font-semibold'
                            : 'text-gray-600 hover:text-gray-950 hover:bg-gray-200/60'
                        } ${isSidebarCollapsed ? 'justify-center py-2.5' : ''}`
                      }
                    >
                      <span className="text-base flex-shrink-0">{link.icon}</span>
                      {!isSidebarCollapsed && (
                        <div className="flex items-center justify-between w-full">
                          <span className="truncate">{link.label}</span>
                          {link.badge && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-primary-50 text-primary-700 border border-primary-200 group-hover:border-primary-300">
                              {link.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Super Admin Section */}
          {isSuperAdmin && (
            <div className="space-y-1 pt-2 border-t border-gray-200">
              {!isSidebarCollapsed && (
                <p className="text-[10px] font-bold text-amber-700 uppercase tracking-wider px-3 mb-1.5">
                  Super Admin
                </p>
              )}
              <NavLink
                to="/dashboard/admin/review"
                onClick={onClose}
                title={isSidebarCollapsed ? 'Admin Review' : undefined}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-amber-600 text-white shadow-xs font-semibold'
                      : 'text-amber-800 hover:text-amber-950 hover:bg-amber-100/60'
                  } ${isSidebarCollapsed ? 'justify-center' : ''}`
                }
              >
                <span className="text-base flex-shrink-0"><IoShieldCheckmarkOutline /></span>
                {!isSidebarCollapsed && <span>Admin Event Review</span>}
              </NavLink>
            </div>
          )}
        </nav>

        {/* Footer Collapse Toggle & Student Mini Card */}
        <div className="p-3 border-t border-gray-200 bg-white flex flex-col gap-2">
          {!isSidebarCollapsed && (
            <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200/80 flex items-center justify-between text-xs">
              <div className="flex flex-col">
                <span className="font-bold text-gray-900 truncate max-w-[130px]">
                  {studentProfile.name}
                </span>
                <span className="text-[10px] text-gray-500 font-mono">
                  {studentProfile.rollNo} • Sem {studentProfile.semester}
                </span>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                {studentProfile.overallAttendance}%
              </span>
            </div>
          )}

          {/* Desktop Sidebar Collapse Button */}
          <button
            onClick={toggleSidebarCollapse}
            className="hidden lg:flex items-center justify-center w-full py-1.5 rounded-lg text-gray-500 hover:text-black hover:bg-gray-100 transition-colors text-xs font-medium gap-1.5"
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isSidebarCollapsed ? (
              <IoChevronForwardOutline size={16} />
            ) : (
              <>
                <IoChevronBackOutline size={15} />
                <span>Collapse Sidebar</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  )
}

import { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiGrid } from 'react-icons/fi';
import SidebarContent from './SidebarContent';

export default function DesktopSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 ${isCollapsed ? 'w-16' : 'w-64'}
                   bg-white border-r border-muted-sand/20
                   transition-all duration-300 ease-in-out
                   z-20 font-display
                   lg:block hidden shadow-sm`}
    >
      <div className="flex h-14 items-center justify-between border-b border-muted-sand/20 px-3">
        {!isCollapsed && (
          <span className="font-serif text-sm font-bold uppercase tracking-wider text-temple-gold flex items-center gap-2">
            <FiGrid className="h-4 w-4" /> Admin Portal
          </span>
        )}
        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-full hover:bg-warm-cream/50 text-natural-wood hover:text-dark-charcoal focus:outline-none transition-colors ml-auto"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <FiChevronRight className="h-4 w-4" />
          ) : (
            <FiChevronLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <div className="flex-1 flex-col overflow-y-auto p-3 space-y-1 custom-scrollbar h-[calc(100vh-120px)]">
        <SidebarContent isCollapsed={isCollapsed} />
      </div>
    </aside>
  );
}
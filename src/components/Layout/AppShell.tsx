import { ReactNode } from 'react'
import { Sidebar, PageType } from '../Sidebar/Sidebar'
import { Header } from '../Header/Header'

interface AppShellProps {
  children: ReactNode
  sidebar?: ReactNode
  onLumiClick?: () => void
  lumiActive?: boolean
  sidebarFullscreen?: boolean
  activePage?: PageType
  onPageChange?: (page: PageType) => void
}

export function AppShell({ children, sidebar, onLumiClick, lumiActive, sidebarFullscreen, activePage, onPageChange }: AppShellProps) {
  return (
    <div className="h-screen flex overflow-hidden bg-neutral-background">
      {/* Left Sidebar */}
      <Sidebar activePage={activePage} onPageChange={onPageChange} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header onLumiClick={onLumiClick} lumiActive={lumiActive} />

        {/* Page Content + Optional Right Sidebar */}
        <div className="flex-1 flex overflow-hidden">
          {/* Main Content - hidden when sidebar is fullscreen */}
          {!sidebarFullscreen && (
            <main className="flex-1 overflow-auto bg-neutral-surface">
              {children}
            </main>
          )}

          {/* Right Sidebar (Chat) – padded container with rounded card, matching Figma */}
          {sidebar && (
            <aside 
              className={`border-l border-neutral-surface-disabled bg-neutral-surface flex-shrink-0 transition-all duration-300 p-2 ${
                sidebarFullscreen ? 'flex-1' : 'w-[340px]'
              }`}
            >
              <div className="h-full bg-white border border-neutral-surface-highlight rounded-lg overflow-hidden flex flex-col">
                {sidebar}
              </div>
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}

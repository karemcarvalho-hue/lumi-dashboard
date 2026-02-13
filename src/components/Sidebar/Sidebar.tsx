import {
  HomeIcon,
  StatsIcon,
  CartIcon,
  TagIcon,
  CashIcon,
  TruckIcon,
  ChatIcon,
  UsersIcon,
  DiscountIcon,
  NewsIcon,
  StoreIcon,
  CogIcon,
  AppsIcon,
  NuvemshopLogo,
} from '../Icons'

export type PageType = 'home' | 'stats' | 'sales' | 'products' | 'payments' | 'shipping' | 'chat' | 'customers' | 'discounts' | 'news' | 'store' | 'apps' | 'settings'

interface SidebarItemProps {
  icon: React.ReactNode
  active?: boolean
  onClick?: () => void
  title?: string
}

function SidebarItem({ icon, active, onClick, title }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        w-full flex items-center justify-center
        p-1.5 rounded-md transition-colors
        ${active 
          ? 'bg-primary-surface text-neutral-text-high' 
          : 'text-neutral-text-high hover:bg-neutral-surface-disabled'
        }
      `}
    >
      <span className="w-4 h-4">{icon}</span>
    </button>
  )
}

function Divider() {
  return <div className="w-8 h-px bg-neutral-surface-highlight mx-auto" />
}

interface SidebarProps {
  activePage?: PageType
  onPageChange?: (page: PageType) => void
}

export function Sidebar({ activePage = 'sales', onPageChange }: SidebarProps) {
  const handlePageClick = (page: PageType) => {
    if (onPageChange) {
      onPageChange(page)
    }
  }
  return (
    <aside className="w-12 h-screen bg-white flex flex-col border-r border-neutral-surface-disabled">
      {/* Header with logo */}
      <div className="h-14 flex items-center justify-center border-b border-transparent">
        <NuvemshopLogo className="w-7 h-5" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-2 px-2 flex flex-col gap-1.5 overflow-y-auto">
        {/* Main section */}
        <SidebarItem icon={<HomeIcon />} title="Início" onClick={() => handlePageClick('home')} active={activePage === 'home'} />
        <SidebarItem icon={<StatsIcon />} title="Estatísticas" onClick={() => handlePageClick('stats')} active={activePage === 'stats'} />

        <Divider />

        {/* Store section */}
        <SidebarItem icon={<CartIcon />} title="Vendas" onClick={() => handlePageClick('sales')} active={activePage === 'sales'} />
        <SidebarItem icon={<TagIcon />} title="Produtos" onClick={() => handlePageClick('products')} active={activePage === 'products'} />
        <SidebarItem icon={<CashIcon />} title="Pagamentos" onClick={() => handlePageClick('payments')} active={activePage === 'payments'} />
        <SidebarItem icon={<TruckIcon />} title="Envios" onClick={() => handlePageClick('shipping')} active={activePage === 'shipping'} />
        <SidebarItem icon={<ChatIcon />} title="Mensagens" onClick={() => handlePageClick('chat')} active={activePage === 'chat'} />
        <SidebarItem icon={<UsersIcon />} title="Clientes" onClick={() => handlePageClick('customers')} active={activePage === 'customers'} />
        <SidebarItem icon={<DiscountIcon />} title="Descontos" onClick={() => handlePageClick('discounts')} active={activePage === 'discounts'} />
        <SidebarItem icon={<NewsIcon />} title="Novidades" onClick={() => handlePageClick('news')} active={activePage === 'news'} />

        <Divider />

        {/* Channels section */}
        <SidebarItem icon={<StoreIcon />} title="Loja" onClick={() => handlePageClick('store')} active={activePage === 'store'} />
        <SidebarItem icon={<AppsIcon />} title="Aplicativos" onClick={() => handlePageClick('apps')} active={activePage === 'apps'} />
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-neutral-surface-disabled">
        <SidebarItem icon={<CogIcon />} title="Configurações" onClick={() => handlePageClick('settings')} active={activePage === 'settings'} />
      </div>
    </aside>
  )
}

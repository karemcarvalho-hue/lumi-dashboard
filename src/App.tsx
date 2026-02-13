import { useState, useMemo } from 'react'
import { AppShell } from './components/Layout/AppShell'
import { SalesPage } from './components/Sales/SalesPage'
import { StatsPage } from './components/Stats/StatsPage'
import { ProductsPage } from './components/Products/ProductsPage'
import { ProductListPage } from './components/Products/ProductListPage'
import { LumiChat } from './components/Chat/LumiChat'
import { StatsFilter } from './components/Chat/StatsCard'
import { ProductData } from './components/Chat/ProductCard'
import { PageType } from './components/Sidebar/Sidebar'
import { ExecutableAction } from './components/Chat/types'
import { ExportProvider } from './context/ExportContext'
import { allOrders } from './components/Chat/OrdersTable'

// Extended page type to include product create sub-page
type ExtendedPageType = PageType | 'products-create'

function App() {
  const [lumiOpen, setLumiOpen] = useState(true)
  const [lumiFullscreen, setLumiFullscreen] = useState(false)
  const [filteredOrderIds, setFilteredOrderIds] = useState<string[]>([])
  const [statsFilters, setStatsFilters] = useState<StatsFilter[]>([])
  const [productData, setProductData] = useState<ProductData | null>(null)
  const [activePage, setActivePage] = useState<ExtendedPageType>('sales')
  
  // New state for order actions
  const [orderActionLog, setOrderActionLog] = useState<Array<{
    action: ExecutableAction
    orderIds: string[]
    timestamp: Date
  }>>([])

  const handleLumiToggle = () => {
    setLumiOpen((prev) => !prev)
    if (!lumiOpen) {
      setLumiFullscreen(false) // Reset fullscreen when opening
    }
  }

  const handleLumiClose = () => {
    setLumiOpen(false)
    setLumiFullscreen(false)
  }

  const handleToggleFullscreen = () => {
    setLumiFullscreen((prev) => !prev)
  }

  const handleApplyFilter = (orderIds: string[]) => {
    setFilteredOrderIds(orderIds)
  }

  const handleClearFilter = () => {
    setFilteredOrderIds([])
  }

  const handleApplyStatsFilter = (filters: StatsFilter[]) => {
    setStatsFilters(filters)
    // Navigate to stats page when applying stats filter
    setActivePage('stats')
  }

  const handleClearStatsFilter = () => {
    setStatsFilters([])
  }

  const handleApplyProduct = (product: ProductData) => {
    setProductData(product)
    // Navigate to product create page when applying product from Lumi
    setActivePage('products-create')
  }

  const handleClearProductData = () => {
    setProductData(null)
  }

  const handlePageChange = (page: PageType) => {
    setActivePage(page)
  }

  const handleGoToProductCreate = () => {
    setActivePage('products-create')
  }

  const handleBackToProductList = () => {
    setProductData(null)
    setActivePage('products')
  }

  // New handler for order actions from Lumi
  const handleOrderAction = (action: ExecutableAction, orderIds: string[]) => {
    // Log the action (in a real app, this would call an API)
    setOrderActionLog((prev) => [
      ...prev,
      {
        action,
        orderIds,
        timestamp: new Date()
      }
    ])

    // In a real implementation, this would:
    // 1. Call the backend API to update order status
    // 2. Update local state to reflect changes
    // 3. Show success/error notification
    
    console.log(`[Lumi Action] ${action} executed on orders:`, orderIds)
    
    // For demo purposes, we could update filtered orders or trigger a refresh
    // This simulates the action being processed
    switch (action) {
      case 'mark_payment_received':
        console.log('Marking payment as received for orders:', orderIds)
        break
      case 'mark_packed':
        console.log('Marking orders as packed:', orderIds)
        break
      case 'unpack':
        console.log('Unpacking orders:', orderIds)
        break
      case 'reopen_order':
        console.log('Reopening orders:', orderIds)
        break
    }
  }

  // New handler for navigating to a specific order
  const handleNavigateToOrder = (orderId: string) => {
    // In a real app, this would navigate to the order detail page
    // For now, we'll navigate to sales page and filter to show just this order
    setFilteredOrderIds([orderId])
    setActivePage('sales')
    console.log(`[Lumi Navigation] Navigating to order #${orderId}`)
  }

  // Render the current page based on activePage
  const renderCurrentPage = () => {
    switch (activePage) {
      case 'stats':
        return (
          <StatsPage
            onAskLumi={handleLumiToggle}
            statsFilters={statsFilters}
            onClearStatsFilter={handleClearStatsFilter}
          />
        )
      case 'products':
        return (
          <ProductListPage
            onAddProduct={handleGoToProductCreate}
          />
        )
      case 'products-create':
        return (
          <ProductsPage
            onAskLumi={handleLumiToggle}
            productData={productData}
            onClearProductData={handleClearProductData}
            onBack={handleBackToProductList}
          />
        )
      case 'sales':
      default:
        return (
          <SalesPage
            onAskLumi={handleLumiToggle}
            filteredOrderIds={filteredOrderIds}
            onClearFilter={handleClearFilter}
            statsFilters={statsFilters}
            onClearStatsFilter={handleClearStatsFilter}
          />
        )
    }
  }

  // Map extended page type to sidebar page type (products-create shows as products in sidebar)
  const sidebarActivePage: PageType = activePage === 'products-create' ? 'products' : activePage as PageType

  // Data provider for the export system – returns the current orders dataset
  const dataProvider = useMemo(() => () => allOrders, [])

  return (
    <ExportProvider dataProvider={dataProvider}>
      <AppShell
        sidebar={
          lumiOpen ? (
            <LumiChat 
              onClose={handleLumiClose} 
              onApplyFilter={handleApplyFilter}
              onUndoFilter={handleClearFilter}
              onApplyStatsFilter={handleApplyStatsFilter}
              onUndoStatsFilter={handleClearStatsFilter}
              onApplyProduct={handleApplyProduct}
              onUndoProduct={handleClearProductData}
              isFullscreen={lumiFullscreen}
              onToggleFullscreen={handleToggleFullscreen}
              onOrderAction={handleOrderAction}
              onNavigateToOrder={handleNavigateToOrder}
            />
          ) : undefined
        }
        onLumiClick={handleLumiToggle}
        lumiActive={lumiOpen}
        sidebarFullscreen={lumiFullscreen}
        activePage={sidebarActivePage}
        onPageChange={handlePageChange}
      >
        {renderCurrentPage()}
      </AppShell>
    </ExportProvider>
  )
}

export default App

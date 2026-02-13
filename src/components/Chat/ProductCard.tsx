import { useState } from 'react'

// Product variant (for multiple images)
export interface ProductVariant {
  id: string
  imageUrl?: string
  color?: string
  size?: string
  stock?: number
  price?: string
}

// Product data interface with Nuvemshop fields
export interface ProductData {
  // Título
  title: string
  
  // Descrição
  description: string
  
  // Pesos e dimensões
  weight: string
  height: string
  width: string
  depth: string
  
  // Instagram e Google Shopping
  instagramEnabled: boolean
  googleShoppingEnabled: boolean
  googleProductCategory?: string
  condition?: 'new' | 'used' | 'refurbished'
  
  // Categorias
  categories: string[]
  
  // Variantes (quando há múltiplas fotos)
  variants: ProductVariant[]
  
  // Tags, marca e SEO
  tags: string[]
  brand: string
  seoTitle: string
  seoDescription: string
  seoUrl: string
  
  // Imagens
  images: string[]
}

interface ProductCardProps {
  product?: ProductData
  onApply?: (product: ProductData) => void
  onUndo?: () => void
  isFullscreen?: boolean
}

// Placeholder image as data URL (simple gray box with product icon)
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjBGMEYwIi8+CjxwYXRoIGQ9Ik04MCA3MEw2MCA5MEw4MCAxMTBNMTIwIDcwTDE0MCA5MEwxMjAgMTEwTTkwIDEyMEwxMTAgNjAiIHN0cm9rZT0iI0JCQkJCQiIgc3Ryb2tlLXdpZHRoPSI0IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHJlY3QgeD0iNjAiIHk9IjEzMCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjQwIiByeD0iNCIgZmlsbD0iI0RERERERCIvPgo8L3N2Zz4K'

// Generate mock product data (simulating AI analysis of image)
export function generateMockProduct(imageUrls?: string[]): ProductData {
  const hasMultipleImages = imageUrls && imageUrls.length > 1
  const defaultImage = 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop'
  
  return {
    title: 'Camiseta Básica Algodão Premium',
    description: 'Camiseta masculina de algodão 100% premium, com corte regular e acabamento de alta qualidade. Tecido macio e confortável, ideal para uso diário.',
    weight: '0.25',
    height: '2',
    width: '30',
    depth: '40',
    instagramEnabled: true,
    googleShoppingEnabled: true,
    googleProductCategory: 'Vestuário e acessórios > Roupas > Camisetas',
    condition: 'new',
    categories: ['Vestuário', 'Camisetas', 'Masculino'],
    variants: hasMultipleImages ? [
      { id: '1', imageUrl: imageUrls?.[0], color: 'Preto', size: 'M', stock: 50, price: '79,90' },
      { id: '2', imageUrl: imageUrls?.[1], color: 'Branco', size: 'M', stock: 45, price: '79,90' },
    ] : [],
    tags: ['camiseta', 'algodão', 'básica', 'masculina', 'premium'],
    brand: 'Minha Marca',
    seoTitle: 'Camiseta Básica Algodão Premium | Conforto e Qualidade',
    seoDescription: 'Camiseta masculina de algodão premium com corte regular. Tecido macio e durável. Compre agora com frete grátis!',
    seoUrl: 'camiseta-basica-algodao-premium',
    images: imageUrls || [defaultImage],
  }
}

// Icons
function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
    </svg>
  )
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PackageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 7l7-4 7 4v8l-7 4-7-4V7z" strokeLinejoin="round" />
      <path d="M10 11V3M3 7l7 4 7-4" strokeLinejoin="round" />
    </svg>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
    </svg>
  )
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
    </svg>
  )
}

function TagIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 8.5V2h6.5l5.5 5.5-6.5 6.5L2 8.5z" strokeLinejoin="round" />
      <circle cx="5.5" cy="5.5" r="1" fill="currentColor" />
    </svg>
  )
}

// Field Row Component
function FieldRow({ label, value }: { label: string; value: string | React.ReactNode }) {
  return (
    <div className="flex items-start justify-between py-1.5 border-b border-neutral-surface-disabled last:border-0">
      <span className="text-xs text-neutral-text-low flex-shrink-0 w-28">{label}</span>
      <div className="flex-1 min-w-0 text-right">
        {typeof value === 'string' ? (
          <span className="text-xs text-neutral-text-high break-words">{value}</span>
        ) : value}
      </div>
    </div>
  )
}

// Section Header Component
function SectionHeader({ title, icon }: { title: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 py-1.5 mt-2 border-b border-neutral-surface-highlight">
      {icon && <span className="text-primary-interactive">{icon}</span>}
      <span className="text-xs font-semibold text-neutral-text-high">{title}</span>
    </div>
  )
}

// Tags Display Component
function TagsDisplay({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {tags.map((tag, index) => (
        <span 
          key={index}
          className="px-2 py-0.5 text-[10px] bg-primary-surface text-primary-text-high rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
  )
}

// Categories Display Component
function CategoriesDisplay({ categories }: { categories: string[] }) {
  return (
    <span className="text-xs text-neutral-text-high">
      {categories.join(' > ')}
    </span>
  )
}

// Toggle Badge
function ToggleBadge({ enabled, label }: { enabled: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] rounded-full ${
      enabled 
        ? 'bg-success-surface text-success-text-high' 
        : 'bg-neutral-surface text-neutral-text-low'
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${enabled ? 'bg-success-interactive' : 'bg-neutral-text-disabled'}`} />
      {label}
    </span>
  )
}

// Product Modal for expanded view
function ProductModal({ 
  isOpen, 
  onClose, 
  product,
  onApply
}: { 
  isOpen: boolean
  onClose: () => void
  product: ProductData
  onApply?: () => void
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-[95vw] max-w-[900px] max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-surface-disabled">
          <div className="flex items-center gap-2">
            <PackageIcon className="w-5 h-5 text-primary-interactive" />
            <span className="text-base font-semibold text-neutral-text-high">Novo Produto</span>
          </div>
          <button onClick={onClose} className="p-1.5 text-neutral-text-low hover:text-neutral-text-high rounded">
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column - Images */}
            <div>
              <div className="aspect-square bg-neutral-surface rounded-lg overflow-hidden mb-3">
                {product.images[0] ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-text-low">
                    <PackageIcon className="w-16 h-16" />
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex gap-2">
                  {product.images.map((img, idx) => (
                    <div key={idx} className="w-16 h-16 bg-neutral-surface rounded overflow-hidden border-2 border-transparent hover:border-primary-interactive cursor-pointer">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}

              {/* Variants */}
              {product.variants.length > 0 && (
                <div className="mt-4 p-3 bg-neutral-surface rounded-lg">
                  <h4 className="text-sm font-medium text-neutral-text-high mb-2">Variantes</h4>
                  <div className="space-y-2">
                    {product.variants.map((variant) => (
                      <div key={variant.id} className="flex items-center gap-3 p-2 bg-white rounded">
                        <div className="w-10 h-10 bg-neutral-surface-disabled rounded overflow-hidden">
                          {variant.imageUrl && <img src={variant.imageUrl} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium">{variant.color} - {variant.size}</p>
                          <p className="text-xs text-neutral-text-low">Estoque: {variant.stock}</p>
                        </div>
                        <span className="text-sm font-medium">R$ {variant.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Details */}
            <div className="space-y-4">
              {/* Title & Description */}
              <div>
                <h3 className="text-lg font-semibold text-neutral-text-high mb-2">{product.title}</h3>
                <p className="text-sm text-neutral-text-low">{product.description}</p>
              </div>

              {/* Categories */}
              <div className="p-3 bg-neutral-surface rounded-lg">
                <span className="text-xs font-medium text-neutral-text-high mb-1 block">Categorias</span>
                <p className="text-sm text-primary-interactive">{product.categories.join(' > ')}</p>
              </div>

              {/* Weight & Dimensions */}
              <div className="p-3 bg-neutral-surface rounded-lg">
                <span className="text-xs font-medium text-neutral-text-high mb-2 block">Pesos e dimensões</span>
                <div className="grid grid-cols-4 gap-2 text-center">
                  <div>
                    <span className="text-[10px] text-neutral-text-low">Peso</span>
                    <p className="text-xs font-medium">{product.weight} kg</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-text-low">Altura</span>
                    <p className="text-xs font-medium">{product.height} cm</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-text-low">Largura</span>
                    <p className="text-xs font-medium">{product.width} cm</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-text-low">Profund.</span>
                    <p className="text-xs font-medium">{product.depth} cm</p>
                  </div>
                </div>
              </div>

              {/* Instagram & Google Shopping */}
              <div className="p-3 bg-neutral-surface rounded-lg">
                <span className="text-xs font-medium text-neutral-text-high mb-2 block">Canais de venda</span>
                <div className="flex gap-2">
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${product.instagramEnabled ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-neutral-surface-disabled text-neutral-text-low'}`}>
                    <InstagramIcon className="w-4 h-4" />
                    <span className="text-xs font-medium">Instagram</span>
                  </div>
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${product.googleShoppingEnabled ? 'bg-blue-500 text-white' : 'bg-neutral-surface-disabled text-neutral-text-low'}`}>
                    <GoogleIcon className="w-4 h-4" />
                    <span className="text-xs font-medium">Google Shopping</span>
                  </div>
                </div>
              </div>

              {/* Brand & Tags */}
              <div className="p-3 bg-neutral-surface rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-neutral-text-high">Marca</span>
                  <span className="text-xs text-neutral-text-high">{product.brand}</span>
                </div>
                <span className="text-xs font-medium text-neutral-text-high mb-2 block">Tags</span>
                <div className="flex flex-wrap gap-1">
                  {product.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-white text-neutral-text-high rounded-full border border-neutral-surface-disabled">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* SEO */}
              <div className="p-3 bg-neutral-surface rounded-lg">
                <span className="text-xs font-medium text-neutral-text-high mb-2 block">SEO</span>
                <div className="p-2 bg-white rounded border border-neutral-surface-disabled">
                  <p className="text-sm text-primary-interactive truncate">{product.seoTitle}</p>
                  <p className="text-xs text-success-text-low truncate">sualoja.com.br/{product.seoUrl}</p>
                  <p className="text-xs text-neutral-text-low line-clamp-2 mt-0.5">{product.seoDescription}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-surface-disabled">
          <button
            onClick={() => {
              onApply?.()
              onClose()
            }}
            className="w-full py-2.5 px-4 text-sm font-medium text-white rounded-md transition-opacity hover:opacity-90"
            style={{
              background: 'linear-gradient(17deg, #0050C3 28%, #4629BA 49%, #D8446E 83%)'
            }}
          >
            Criar produto
          </button>
        </div>
      </div>
    </div>
  )
}

// Product Content for the card with horizontal scroll
function ProductContent({ product, isExpanded }: { product: ProductData; isExpanded: boolean }) {
  return (
    <div 
      className="overflow-x-auto overflow-y-hidden"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div style={{ minWidth: '400px' }}>
        {/* Product Image, Title & Description */}
        <div className="flex gap-3 py-2 px-2.5 border-b border-neutral-surface-disabled">
          <div className="w-14 h-14 bg-neutral-surface rounded-md overflow-hidden flex-shrink-0">
            {product.images[0] ? (
              <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-text-low">
                <PackageIcon className="w-6 h-6" />
              </div>
            )}
          </div>
          <div className="flex-1" style={{ minWidth: '300px' }}>
            <h4 className="text-sm font-medium text-neutral-text-high">{product.title}</h4>
            <p className="text-xs text-neutral-text-low mt-0.5 whitespace-normal">{product.description}</p>
          </div>
        </div>

        {/* Fields Table */}
        <div className="px-2.5">
          {/* Basic Fields - Always visible */}
          <div className="py-1">
            <FieldRow label="Categorias" value={<CategoriesDisplay categories={product.categories} />} />
            <FieldRow label="Peso" value={`${product.weight} kg`} />
            <FieldRow label="Dimensões" value={`${product.height} × ${product.width} × ${product.depth} cm`} />
          </div>

          {/* Expanded Fields */}
          {isExpanded && (
            <>
              {/* Instagram & Google Shopping */}
              <SectionHeader title="Instagram e Google Shopping" />
              <div className="py-2 flex flex-wrap gap-2">
                <ToggleBadge enabled={product.instagramEnabled} label="Instagram" />
                <ToggleBadge enabled={product.googleShoppingEnabled} label="Google Shopping" />
              </div>
              {product.googleProductCategory && (
                <FieldRow label="Categoria Google" value={product.googleProductCategory} />
              )}

              {/* Variants */}
              {product.variants.length > 0 && (
                <>
                  <SectionHeader title="Variantes" />
                  <div className="py-2 space-y-1">
                    {product.variants.map((variant) => (
                      <div key={variant.id} className="flex items-center justify-between text-xs py-1 border-b border-neutral-surface-disabled last:border-0">
                        <span className="text-neutral-text-low">{variant.color} - {variant.size}</span>
                        <span className="text-neutral-text-high">Est: {variant.stock} | R$ {variant.price}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Tags, Brand & SEO */}
              <SectionHeader title="Tags, marca e SEO" icon={<TagIcon className="w-3 h-3" />} />
              <div className="py-1">
                <FieldRow label="Marca" value={product.brand} />
                <FieldRow label="Tags" value={<TagsDisplay tags={product.tags} />} />
                <FieldRow label="Título SEO" value={product.seoTitle} />
                <FieldRow label="URL" value={`/${product.seoUrl}`} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

// Main ProductCard component
export function ProductCard({ 
  product = generateMockProduct(), 
  onApply,
  onUndo,
  isFullscreen = false 
}: ProductCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCardCollapsed, setIsCardCollapsed] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isApplied, setIsApplied] = useState(false)

  const handleButtonClick = () => {
    if (isApplied) {
      // Undo action - call the undo callback
      if (onUndo) {
        onUndo()
      }
      setIsApplied(false)
    } else {
      // Apply action
      if (onApply) {
        onApply(product)
      }
      setIsApplied(true)
    }
  }

  return (
    <>
      {/* Card container */}
      <div className="bg-white rounded-lg shadow-[0_0_2px_rgba(136,136,136,0.5)] overflow-hidden">
        {/* Header - clickable to collapse/expand card */}
        <button 
          onClick={() => setIsCardCollapsed(!isCardCollapsed)}
          className="w-full flex items-center gap-2 px-2.5 py-2.5 hover:bg-neutral-surface/50 transition-colors text-left"
        >
          <ChevronDownIcon 
            className={`w-4 h-4 text-neutral-text-low flex-shrink-0 transition-transform duration-200 ${isCardCollapsed ? '-rotate-90' : ''}`} 
          />
          <span className="flex-1 text-sm font-semibold text-neutral-text-high">Novo Produto</span>
          {isCardCollapsed && (
            <span className="text-xs text-neutral-text-low">7 campos</span>
          )}
          <div 
            onClick={(e) => {
              e.stopPropagation()
              setIsModalOpen(true)
            }}
            className="p-1 rounded hover:bg-neutral-surface-disabled transition-colors"
            title="Abrir em tela cheia"
          >
            <svg className="w-4 h-4 text-neutral-text-low" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M10 2h4v4M6 14H2v-4M14 2L9 7M2 14l5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </button>

        {/* Collapsible content */}
        <div className={`transition-all duration-200 ease-in-out overflow-hidden ${isCardCollapsed ? 'max-h-0 opacity-0' : 'opacity-100'}`}>
          {/* Product Content */}
          <ProductContent product={product} isExpanded={isExpanded} />

          {/* Footer with expand and apply buttons */}
          <div className="px-2.5 py-2.5 space-y-2 border-t border-neutral-surface-disabled bg-white">
            {/* Expand/Collapse button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full flex items-center justify-center gap-1 py-1 text-xs text-neutral-text-low hover:text-neutral-text-high transition-colors"
            >
              <span>{isExpanded ? 'Ver menos' : 'Ver mais (Canais, Variantes, SEO)'}</span>
              <ChevronDownIcon className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Create Product / Undo Button */}
            <button
              onClick={handleButtonClick}
              className={`w-full py-1.5 px-3 text-sm font-medium rounded-md transition-all ${
                isApplied 
                  ? 'bg-neutral-surface border border-neutral-surface-disabled text-neutral-text-high hover:bg-neutral-surface-disabled' 
                  : 'text-white hover:opacity-90'
              }`}
              style={!isApplied ? {
                background: 'linear-gradient(17deg, #0050C3 28%, #4629BA 49%, #D8446E 83%)'
              } : undefined}
            >
              {isApplied ? 'Desfazer' : 'Criar produto'}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Modal */}
      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        product={product}
        onApply={handleButtonClick}
      />
    </>
  )
}

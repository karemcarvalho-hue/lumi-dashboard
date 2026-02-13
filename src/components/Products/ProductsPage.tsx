import { useState, useEffect } from 'react'
import { Button } from '../UI'
import { SparklesIcon, CloseIcon } from '../Icons'
import { ProductData } from '../Chat/ProductCard'

// Icons
function ImageIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="14" height="14" rx="2" />
      <circle cx="7" cy="7" r="1.5" fill="currentColor" />
      <path d="M3 14l4-4 3 3 4-4 3 3" strokeLinejoin="round" />
    </svg>
  )
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M8 3v10M3 8h10" strokeLinecap="round" />
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

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 4h12M5 4V2.5A.5.5 0 015.5 2h5a.5.5 0 01.5.5V4M6.5 7v5M9.5 7v5M3.5 4l.5 9.5a1 1 0 001 .5h6a1 1 0 001-.5L12.5 4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function DollarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 1v14M11 4H6.5a2.5 2.5 0 000 5h3a2.5 2.5 0 010 5H5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function BoxIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 5l6-3 6 3v6l-6 3-6-3V5z" strokeLinejoin="round" />
      <path d="M8 8V2M2 5l6 3 6-3" strokeLinejoin="round" />
    </svg>
  )
}

function BarCodeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M1 2h2v12H1V2zm3 0h1v12H4V2zm2 0h2v12H6V2zm3 0h1v12H9V2zm2 0h1v12h-1V2zm2 0h2v12h-2V2z"/>
    </svg>
  )
}

function FileTextIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 1H4a1 1 0 00-1 1v12a1 1 0 001 1h8a1 1 0 001-1V5L9 1z" strokeLinejoin="round" />
      <path d="M9 1v4h4M5 8h6M5 11h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 1l2.163 4.383 4.837.703-3.5 3.412.826 4.817L8 12l-4.326 2.315.826-4.817-3.5-3.412 4.837-.703L8 1z" strokeLinejoin="round" />
    </svg>
  )
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M1 8s2.545-5 7-5 7 5 7 5-2.545 5-7 5-7-5-7-5z" strokeLinejoin="round" />
      <circle cx="8" cy="8" r="2" />
    </svg>
  )
}

// AI Generated style wrapper for Lumi-filled fields
// Following Nimbus Design System aiGenerated pattern:
// - AI gradient border
// - White background  
// - AI focus ring on focus-within
// Reference: https://nimbus.tiendanube.com/documentation/atomic-components/input#example-aigenerated-flag
function AIGeneratedField({ children, isActive }: { children: React.ReactNode; isActive: boolean }) {
  if (!isActive) {
    // Return children wrapped in a div with normal border style
    return (
      <div className="rounded-lg border border-neutral-surface-disabled focus-within:ring-2 focus-within:ring-primary-interactive focus-within:border-transparent">
        {children}
      </div>
    )
  }
  
  return (
    <div className="relative">
      {/* AI Focus ring - appears on focus-within */}
      <div 
        className="absolute inset-[-3px] rounded-[10px] opacity-0 focus-within:opacity-100 transition-opacity duration-200 pointer-events-none -z-10"
        style={{
          background: 'linear-gradient(17deg, rgba(0,80,195,0.25) 28%, rgba(70,41,186,0.25) 49%, rgba(216,68,110,0.25) 83%)',
          filter: 'blur(2px)'
        }}
      />
      {/* Gradient border container */}
      <div 
        className="p-[2px] rounded-lg relative"
        style={{
          background: 'linear-gradient(17deg, #0050C3 28%, #4629BA 49%, #D8446E 83%)'
        }}
      >
        {children}
      </div>
    </div>
  )
}

// Alias for backwards compatibility
const GradientBorder = AIGeneratedField

interface ProductsPageProps {
  onAskLumi?: () => void
  productData?: ProductData | null
  onClearProductData?: () => void
  onBack?: () => void
}

// Form Section Component (Collapsible)
function FormSection({ 
  title, 
  children, 
  defaultOpen = true,
  badge,
  icon
}: { 
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
  badge?: React.ReactNode
  icon?: React.ReactNode
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  
  return (
    <div className="bg-white rounded-lg border border-neutral-surface-disabled overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-neutral-surface/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          {icon && <span className="text-neutral-text-low">{icon}</span>}
          <span className="text-sm font-semibold text-neutral-text-high">{title}</span>
          {badge}
        </div>
        <ChevronDownIcon className={`w-4 h-4 text-neutral-text-low transition-transform ${isOpen ? '' : '-rotate-90'}`} />
      </button>
      {isOpen && (
        <div className="px-4 pb-4 border-t border-neutral-surface-disabled">
          {children}
        </div>
      )}
    </div>
  )
}

// Toggle Switch Component
function ToggleSwitch({ enabled, onChange, label }: { enabled: boolean; onChange: (enabled: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <div 
        onClick={() => onChange(!enabled)}
        className={`relative w-10 h-5 rounded-full transition-colors ${enabled ? 'bg-primary-interactive' : 'bg-neutral-surface-disabled'}`}
      >
        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
      </div>
      <span className="text-sm text-neutral-text-high">{label}</span>
    </label>
  )
}

// Checkbox Component
function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: (checked: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input 
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4 rounded border-neutral-surface-disabled text-primary-interactive focus:ring-primary-interactive"
      />
      <span className="text-sm text-neutral-text-high">{label}</span>
    </label>
  )
}

export function ProductsPage({ productData, onClearProductData, onBack }: ProductsPageProps) {
  // === CAMPOS QUE O LUMI PREENCHE ===
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [width, setWidth] = useState('')
  const [depth, setDepth] = useState('')
  const [instagramEnabled, setInstagramEnabled] = useState(false)
  const [googleShoppingEnabled, setGoogleShoppingEnabled] = useState(false)
  const [googleProductCategory, setGoogleProductCategory] = useState('')
  const [condition, setCondition] = useState<'new' | 'used' | 'refurbished'>('new')
  const [categories, setCategories] = useState<string[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [brand, setBrand] = useState('')
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')
  const [seoUrl, setSeoUrl] = useState('')

  // === CAMPOS QUE O LUMI NÃO PREENCHE ===
  // Tipo de produto
  const [productType, setProductType] = useState<'physical' | 'digital' | 'service'>('physical')
  
  // Preços
  const [price, setPrice] = useState('')
  const [compareAtPrice, setCompareAtPrice] = useState('')
  const [costPrice, setCostPrice] = useState('')
  
  // Estoque e SKU
  const [sku, setSku] = useState('')
  const [barcode, setBarcode] = useState('')
  const [stock, setStock] = useState('')
  const [trackInventory, setTrackInventory] = useState(true)
  const [allowBackorder, setAllowBackorder] = useState(false)
  
  // Nota fiscal
  const [ncm, setNcm] = useState('')
  const [productOrigin, setProductOrigin] = useState<'0' | '1' | '2'>('0')
  
  // Destaque e visibilidade
  const [showOnHomepage, setShowOnHomepage] = useState(false)
  const [isFeatured, setIsFeatured] = useState(false)
  const [isFreeShipping, setIsFreeShipping] = useState(false)
  const [isPublished, setIsPublished] = useState(true)

  const hasLumiData = productData !== null && productData !== undefined

  // Fill form with Lumi data (only the fields Lumi can fill)
  useEffect(() => {
    if (productData) {
      setTitle(productData.title)
      setDescription(productData.description)
      setImages(productData.images)
      setWeight(productData.weight)
      setHeight(productData.height)
      setWidth(productData.width)
      setDepth(productData.depth)
      setInstagramEnabled(productData.instagramEnabled)
      setGoogleShoppingEnabled(productData.googleShoppingEnabled)
      setGoogleProductCategory(productData.googleProductCategory ?? '')
      setCondition(productData.condition ?? 'new')
      setCategories(productData.categories)
      setTags(productData.tags)
      setBrand(productData.brand)
      setSeoTitle(productData.seoTitle)
      setSeoDescription(productData.seoDescription)
      setSeoUrl(productData.seoUrl)
    }
  }, [productData])

  const handleClearForm = () => {
    // Clear Lumi fields
    setTitle('')
    setDescription('')
    setImages([])
    setWeight('')
    setHeight('')
    setWidth('')
    setDepth('')
    setInstagramEnabled(false)
    setGoogleShoppingEnabled(false)
    setGoogleProductCategory('')
    setCondition('new')
    setCategories([])
    setTags([])
    setBrand('')
    setSeoTitle('')
    setSeoDescription('')
    setSeoUrl('')
    // Clear non-Lumi fields
    setProductType('physical')
    setPrice('')
    setCompareAtPrice('')
    setCostPrice('')
    setSku('')
    setBarcode('')
    setStock('')
    setTrackInventory(true)
    setAllowBackorder(false)
    setNcm('')
    setProductOrigin('0')
    setShowOnHomepage(false)
    setIsFeatured(false)
    setIsFreeShipping(false)
    setIsPublished(true)
    onClearProductData?.()
  }

  const handleAddImage = () => {
    const mockImages = [
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=400&h=400&fit=crop',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&h=400&fit=crop',
    ]
    const newImage = mockImages[images.length % mockImages.length]
    setImages([...images, newImage])
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  // Count Lumi-filled fields
  const lumiFilledCount = [
    title, description, weight, height, width, depth, brand, seoTitle, seoDescription, seoUrl
  ].filter(Boolean).length + (images.length > 0 ? 1 : 0) + (categories.length > 0 ? 1 : 0) + (tags.length > 0 ? 1 : 0)

  return (
    <div className="min-h-full bg-neutral-background">
      {/* Header */}
      <div className="bg-white border-b border-neutral-surface-disabled px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onBack}
              className="p-1 text-neutral-text-low hover:text-neutral-text-high"
            >
              <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 4l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <h1 className="text-lg font-semibold text-neutral-text-high">Novo produto</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="neutral" onClick={() => { handleClearForm(); onBack?.(); }}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={onBack}>
              Criar produto
            </Button>
          </div>
        </div>
      </div>

      {/* Lumi Data Banner */}
      {hasLumiData && (
        <div className="mx-6 mt-4">
          <div className="flex items-center justify-between p-3 rounded-lg border"
            style={{
              background: 'linear-gradient(135deg, rgba(0,80,195,0.1) 0%, rgba(70,41,186,0.1) 50%, rgba(216,68,110,0.1) 100%)',
              borderColor: 'rgba(70,41,186,0.3)'
            }}
          >
            <div className="flex items-center gap-2">
              <SparklesIcon className="w-4 h-4 text-[#4629BA]" />
              <span className="text-sm text-neutral-text-high">
                <strong>Lumi</strong> preencheu {lumiFilledCount} campos automaticamente
              </span>
              <span className="text-xs text-neutral-text-low">
                (campos com borda colorida)
              </span>
            </div>
            <button
              onClick={handleClearForm}
              className="flex items-center gap-1 text-sm text-[#4629BA] hover:text-[#3a1f9e]"
            >
              <CloseIcon className="w-4 h-4" />
              Limpar dados
            </button>
          </div>
        </div>
      )}

      {/* Form Content */}
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-4">
          
          {/* Images */}
          <FormSection title="Imagens" icon={<ImageIcon className="w-4 h-4" />}>
            <div className="pt-4">
              <GradientBorder isActive={hasLumiData && images.length > 0}>
                <div className="flex flex-wrap gap-3 p-3 bg-white rounded-lg min-h-[120px]">
                  {images.map((img, index) => (
                    <div key={index} className="relative w-24 h-24 bg-neutral-surface rounded-lg overflow-hidden group">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-1 right-1 p-1 bg-white/90 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <TrashIcon className="w-4 h-4 text-danger-text-low" />
                      </button>
                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 text-[10px] bg-primary-interactive text-white rounded">
                          Principal
                        </span>
                      )}
                    </div>
                  ))}
                  
                  <button 
                    onClick={handleAddImage}
                    className="w-24 h-24 border-2 border-dashed border-neutral-surface-disabled rounded-lg flex flex-col items-center justify-center text-neutral-text-low hover:border-primary-interactive hover:text-primary-interactive transition-colors"
                  >
                    <ImageIcon className="w-6 h-6 mb-1" />
                    <span className="text-xs">Adicionar</span>
                  </button>
                </div>
              </GradientBorder>
              <p className="text-xs text-neutral-text-low mt-2">
                Arraste para reordenar. A primeira imagem será a principal.
              </p>
            </div>
          </FormSection>

          {/* Title */}
          <FormSection title="Título">
            <div className="pt-4">
              <GradientBorder isActive={hasLumiData && !!title}>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Camiseta Básica Algodão"
                  className="w-full px-3 py-2 text-sm border-0 rounded-lg focus:outline-none bg-white"
                />
              </GradientBorder>
            </div>
          </FormSection>

          {/* Description */}
          <FormSection title="Descrição">
            <div className="pt-4">
              <GradientBorder isActive={hasLumiData && !!description}>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Descreva seu produto..."
                  rows={4}
                  className="w-full px-3 py-2 text-sm border-0 rounded-lg focus:outline-none resize-none bg-white"
                />
              </GradientBorder>
            </div>
          </FormSection>

          {/* Product Type - Lumi NÃO preenche */}
          <FormSection title="Tipo de produto" icon={<BoxIcon className="w-4 h-4" />}>
            <div className="pt-4">
              <div className="flex gap-4">
                {[
                  { value: 'physical', label: 'Produto físico', desc: 'Requer envio' },
                  { value: 'digital', label: 'Produto digital', desc: 'Download ou acesso online' },
                  { value: 'service', label: 'Serviço', desc: 'Prestação de serviço' },
                ].map((type) => (
                  <label 
                    key={type.value}
                    className={`flex-1 p-3 border rounded-lg cursor-pointer transition-colors ${
                      productType === type.value 
                        ? 'border-primary-interactive bg-primary-surface/30' 
                        : 'border-neutral-surface-disabled hover:border-neutral-text-low'
                    }`}
                  >
                    <input
                      type="radio"
                      name="productType"
                      value={type.value}
                      checked={productType === type.value}
                      onChange={(e) => setProductType(e.target.value as typeof productType)}
                      className="sr-only"
                    />
                    <span className="block text-sm font-medium text-neutral-text-high">{type.label}</span>
                    <span className="block text-xs text-neutral-text-low mt-0.5">{type.desc}</span>
                  </label>
                ))}
              </div>
            </div>
          </FormSection>

          {/* Prices - Lumi NÃO preenche */}
          <FormSection title="Preços" icon={<DollarIcon className="w-4 h-4" />}>
            <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-neutral-text-low mb-1">Preço *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-text-low">R$</span>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="0,00"
                    className="w-full pl-10 pr-3 py-2 text-sm border border-neutral-surface-disabled rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-interactive"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-neutral-text-low mb-1">Preço promocional</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-text-low">R$</span>
                  <input
                    type="text"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value)}
                    placeholder="0,00"
                    className="w-full pl-10 pr-3 py-2 text-sm border border-neutral-surface-disabled rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-interactive"
                  />
                </div>
                <p className="text-xs text-neutral-text-low mt-1">Preço anterior (riscado)</p>
              </div>
              <div>
                <label className="block text-xs text-neutral-text-low mb-1">Custo</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-text-low">R$</span>
                  <input
                    type="text"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    placeholder="0,00"
                    className="w-full pl-10 pr-3 py-2 text-sm border border-neutral-surface-disabled rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-interactive"
                  />
                </div>
                <p className="text-xs text-neutral-text-low mt-1">Para cálculo de margem (não visível)</p>
              </div>
            </div>
          </FormSection>

          {/* Inventory & SKU - Lumi NÃO preenche */}
          <FormSection title="Estoque e SKU" icon={<BarCodeIcon className="w-4 h-4" />}>
            <div className="pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs text-neutral-text-low mb-1">SKU (código interno)</label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="Ex: CAM-001"
                    className="w-full px-3 py-2 text-sm border border-neutral-surface-disabled rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-interactive"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-text-low mb-1">Código de barras (GTIN/EAN)</label>
                  <input
                    type="text"
                    value={barcode}
                    onChange={(e) => setBarcode(e.target.value)}
                    placeholder="Ex: 7891234567890"
                    className="w-full px-3 py-2 text-sm border border-neutral-surface-disabled rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-interactive"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-text-low mb-1">Quantidade em estoque</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 text-sm border border-neutral-surface-disabled rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-interactive"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-4">
                <Checkbox 
                  checked={trackInventory} 
                  onChange={setTrackInventory} 
                  label="Controlar estoque" 
                />
                <Checkbox 
                  checked={allowBackorder} 
                  onChange={setAllowBackorder} 
                  label="Permitir venda sem estoque" 
                />
              </div>
            </div>
          </FormSection>

          {/* Weight & Dimensions - Lumi PREENCHE */}
          <FormSection title="Pesos e dimensões">
            <div className="pt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs text-neutral-text-low mb-1">Peso (kg)</label>
                <GradientBorder isActive={hasLumiData && !!weight}>
                  <input
                    type="text"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 text-sm border-0 rounded-lg focus:outline-none bg-white"
                  />
                </GradientBorder>
              </div>
              <div>
                <label className="block text-xs text-neutral-text-low mb-1">Altura (cm)</label>
                <GradientBorder isActive={hasLumiData && !!height}>
                  <input
                    type="text"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 text-sm border-0 rounded-lg focus:outline-none bg-white"
                  />
                </GradientBorder>
              </div>
              <div>
                <label className="block text-xs text-neutral-text-low mb-1">Largura (cm)</label>
                <GradientBorder isActive={hasLumiData && !!width}>
                  <input
                    type="text"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 text-sm border-0 rounded-lg focus:outline-none bg-white"
                  />
                </GradientBorder>
              </div>
              <div>
                <label className="block text-xs text-neutral-text-low mb-1">Profundidade (cm)</label>
                <GradientBorder isActive={hasLumiData && !!depth}>
                  <input
                    type="text"
                    value={depth}
                    onChange={(e) => setDepth(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-2 text-sm border-0 rounded-lg focus:outline-none bg-white"
                  />
                </GradientBorder>
              </div>
            </div>
          </FormSection>

          {/* Nota Fiscal - Lumi NÃO preenche */}
          <FormSection title="Nota fiscal" icon={<FileTextIcon className="w-4 h-4" />} defaultOpen={false}>
            <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-neutral-text-low mb-1">NCM (código fiscal)</label>
                <input
                  type="text"
                  value={ncm}
                  onChange={(e) => setNcm(e.target.value)}
                  placeholder="Ex: 6109.10.00"
                  className="w-full px-3 py-2 text-sm border border-neutral-surface-disabled rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-interactive"
                />
                <p className="text-xs text-neutral-text-low mt-1">Nomenclatura Comum do Mercosul</p>
              </div>
              <div>
                <label className="block text-xs text-neutral-text-low mb-1">Origem do produto</label>
                <select
                  value={productOrigin}
                  onChange={(e) => setProductOrigin(e.target.value as typeof productOrigin)}
                  className="w-full px-3 py-2 text-sm border border-neutral-surface-disabled rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-interactive bg-white"
                >
                  <option value="0">0 - Nacional</option>
                  <option value="1">1 - Estrangeira (importação direta)</option>
                  <option value="2">2 - Estrangeira (adquirida no mercado interno)</option>
                </select>
              </div>
            </div>
          </FormSection>

          {/* Instagram & Google Shopping - Lumi PREENCHE */}
          <FormSection 
            title="Instagram e Google Shopping"
            badge={
              <div className="flex gap-1">
                {instagramEnabled && <InstagramIcon className="w-4 h-4 text-pink-500" />}
                {googleShoppingEnabled && <GoogleIcon className="w-4 h-4 text-blue-500" />}
              </div>
            }
          >
            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-6">
                <ToggleSwitch 
                  enabled={instagramEnabled} 
                  onChange={setInstagramEnabled} 
                  label="Publicar no Instagram Shopping"
                />
                <ToggleSwitch 
                  enabled={googleShoppingEnabled} 
                  onChange={setGoogleShoppingEnabled} 
                  label="Publicar no Google Shopping"
                />
              </div>
              
              {googleShoppingEnabled && (
                <div className="space-y-3 pt-2 border-t border-neutral-surface-disabled">
                  <div>
                    <label className="block text-xs text-neutral-text-low mb-1">Categoria do Google</label>
                    <GradientBorder isActive={hasLumiData && !!googleProductCategory}>
                      <input
                        type="text"
                        value={googleProductCategory}
                        onChange={(e) => setGoogleProductCategory(e.target.value)}
                        placeholder="Ex: Vestuário e acessórios > Roupas"
                        className="w-full px-3 py-2 text-sm border-0 rounded-lg focus:outline-none bg-white"
                      />
                    </GradientBorder>
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-text-low mb-1">Condição</label>
                    <select
                      value={condition}
                      onChange={(e) => setCondition(e.target.value as 'new' | 'used' | 'refurbished')}
                      className="w-full px-3 py-2 text-sm border border-neutral-surface-disabled rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-interactive bg-white"
                    >
                      <option value="new">Novo</option>
                      <option value="used">Usado</option>
                      <option value="refurbished">Recondicionado</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </FormSection>

          {/* Categories - Lumi PREENCHE */}
          <FormSection title="Categorias">
            <div className="pt-4">
              <GradientBorder isActive={hasLumiData && categories.length > 0}>
                <div className="flex flex-wrap gap-1 p-2 rounded-lg min-h-[42px] bg-white">
                  {categories.map((cat, index) => (
                    <span 
                      key={index}
                      className="flex items-center gap-1 px-2 py-0.5 text-xs bg-primary-surface text-primary-text-high rounded-full"
                    >
                      {cat}
                      <button onClick={() => setCategories(categories.filter(c => c !== cat))} className="hover:text-primary-interactive">
                        <CloseIcon className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder={categories.length === 0 ? "Digite uma categoria e pressione Enter" : ''}
                    className="flex-1 min-w-[100px] text-sm border-none outline-none bg-transparent"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                        e.preventDefault()
                        const newCat = (e.target as HTMLInputElement).value.trim()
                        if (!categories.includes(newCat)) {
                          setCategories([...categories, newCat])
                        }
                        ;(e.target as HTMLInputElement).value = ''
                      }
                    }}
                  />
                </div>
              </GradientBorder>
              <p className="text-xs text-neutral-text-low mt-2">
                Use categorias para organizar seus produtos. Ex: Vestuário, Camisetas, Masculino
              </p>
            </div>
          </FormSection>

          {/* Variants - shown when multiple images */}
          {images.length > 1 && (
            <FormSection 
              title="Variantes"
              badge={<span className="text-xs text-primary-interactive">+{images.length} fotos detectadas</span>}
            >
              <div className="pt-4">
                <p className="text-sm text-neutral-text-low mb-3">
                  Detectamos várias imagens. Deseja criar variantes para este produto?
                </p>
                <div className="space-y-2">
                  {images.map((img, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 bg-neutral-surface/50 rounded-lg">
                      <img src={img} alt="" className="w-10 h-10 rounded object-cover" />
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <input
                          type="text"
                          placeholder="Cor"
                          className="px-2 py-1.5 text-sm border border-neutral-surface-disabled rounded focus:outline-none focus:ring-1 focus:ring-primary-interactive"
                        />
                        <input
                          type="text"
                          placeholder="Tamanho"
                          className="px-2 py-1.5 text-sm border border-neutral-surface-disabled rounded focus:outline-none focus:ring-1 focus:ring-primary-interactive"
                        />
                        <input
                          type="text"
                          placeholder="Estoque"
                          className="px-2 py-1.5 text-sm border border-neutral-surface-disabled rounded focus:outline-none focus:ring-1 focus:ring-primary-interactive"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button className="flex items-center gap-1 mt-3 text-sm text-primary-interactive hover:underline">
                  <PlusIcon className="w-4 h-4" />
                  Adicionar variante
                </button>
              </div>
            </FormSection>
          )}

          {/* Highlight & Visibility - Lumi NÃO preenche */}
          <FormSection title="Destaque e visibilidade" icon={<StarIcon className="w-4 h-4" />}>
            <div className="pt-4 space-y-4">
              <div className="flex flex-wrap gap-4">
                <Checkbox 
                  checked={showOnHomepage} 
                  onChange={setShowOnHomepage} 
                  label="Mostrar na página inicial" 
                />
                <Checkbox 
                  checked={isFeatured} 
                  onChange={setIsFeatured} 
                  label="Produto em destaque" 
                />
                <Checkbox 
                  checked={isFreeShipping} 
                  onChange={setIsFreeShipping} 
                  label="Frete grátis" 
                />
              </div>
              <div className="pt-2 border-t border-neutral-surface-disabled">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <EyeIcon className="w-4 h-4 text-neutral-text-low" />
                    <span className="text-sm text-neutral-text-high">Publicar na loja</span>
                  </div>
                  <ToggleSwitch 
                    enabled={isPublished} 
                    onChange={setIsPublished} 
                    label=""
                  />
                </div>
                <p className="text-xs text-neutral-text-low mt-1 ml-6">
                  {isPublished ? 'O produto estará visível para os clientes' : 'O produto ficará como rascunho'}
                </p>
              </div>
            </div>
          </FormSection>

          {/* Tags, Brand & SEO - Lumi PREENCHE */}
          <FormSection title="Tags, marca e SEO">
            <div className="pt-4 space-y-4">
              {/* Brand */}
              <div>
                <label className="block text-xs text-neutral-text-low mb-1">Marca</label>
                <GradientBorder isActive={hasLumiData && !!brand}>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Nome da marca"
                    className="w-full px-3 py-2 text-sm border-0 rounded-lg focus:outline-none bg-white"
                  />
                </GradientBorder>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs text-neutral-text-low mb-1">Tags</label>
                <GradientBorder isActive={hasLumiData && tags.length > 0}>
                  <div className="flex flex-wrap gap-1 p-2 rounded-lg min-h-[42px] bg-white">
                    {tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="flex items-center gap-1 px-2 py-0.5 text-xs bg-primary-surface text-primary-text-high rounded-full"
                      >
                        {tag}
                        <button onClick={() => setTags(tags.filter(t => t !== tag))} className="hover:text-primary-interactive">
                          <CloseIcon className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder={tags.length === 0 ? "Digite uma tag e pressione Enter" : ''}
                      className="flex-1 min-w-[100px] text-sm border-none outline-none bg-transparent"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && (e.target as HTMLInputElement).value.trim()) {
                          e.preventDefault()
                          const newTag = (e.target as HTMLInputElement).value.trim()
                          if (!tags.includes(newTag)) {
                            setTags([...tags, newTag])
                          }
                          ;(e.target as HTMLInputElement).value = ''
                        }
                      }}
                    />
                  </div>
                </GradientBorder>
              </div>

              {/* SEO Title */}
              <div>
                <label className="block text-xs text-neutral-text-low mb-1">Título SEO</label>
                <GradientBorder isActive={hasLumiData && !!seoTitle}>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={(e) => setSeoTitle(e.target.value)}
                    placeholder="Título para mecanismos de busca"
                    className="w-full px-3 py-2 text-sm border-0 rounded-lg focus:outline-none bg-white"
                  />
                </GradientBorder>
                <p className="text-xs text-neutral-text-low mt-1">{seoTitle.length}/60 caracteres</p>
              </div>

              {/* SEO Description */}
              <div>
                <label className="block text-xs text-neutral-text-low mb-1">Descrição SEO</label>
                <GradientBorder isActive={hasLumiData && !!seoDescription}>
                  <textarea
                    value={seoDescription}
                    onChange={(e) => setSeoDescription(e.target.value)}
                    placeholder="Descrição para mecanismos de busca"
                    rows={2}
                    className="w-full px-3 py-2 text-sm border-0 rounded-lg focus:outline-none resize-none bg-white"
                  />
                </GradientBorder>
                <p className="text-xs text-neutral-text-low mt-1">{seoDescription.length}/160 caracteres</p>
              </div>

              {/* SEO URL */}
              <div>
                <label className="block text-xs text-neutral-text-low mb-1">URL amigável</label>
                <GradientBorder isActive={hasLumiData && !!seoUrl}>
                  <div className="flex items-center bg-white rounded-lg">
                    <span className="px-3 py-2 text-sm text-neutral-text-low bg-neutral-surface rounded-l-lg">
                      sualoja.com.br/
                    </span>
                    <input
                      type="text"
                      value={seoUrl}
                      onChange={(e) => setSeoUrl(e.target.value)}
                      placeholder="url-do-produto"
                      className="flex-1 px-3 py-2 text-sm border-0 rounded-r-lg focus:outline-none bg-white"
                    />
                  </div>
                </GradientBorder>
              </div>

              {/* SEO Preview */}
              <div className="p-3 bg-neutral-surface rounded-lg">
                <p className="text-xs text-neutral-text-low mb-2">Pré-visualização no Google</p>
                <div className="p-3 bg-white rounded border border-neutral-surface-disabled">
                  <p className="text-sm text-[#1a0dab] truncate">{seoTitle || title || 'Título do produto'}</p>
                  <p className="text-xs text-[#006621] truncate">sualoja.com.br/{seoUrl || 'url-do-produto'}</p>
                  <p className="text-xs text-[#545454] line-clamp-2 mt-0.5">
                    {seoDescription || description || 'Descrição do produto para mecanismos de busca...'}
                  </p>
                </div>
              </div>
            </div>
          </FormSection>

        </div>
      </div>
    </div>
  )
}

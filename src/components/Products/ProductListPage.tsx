import { useState, useRef, useEffect } from 'react'
import { Button, ChangeHistoryPanel, HistoryButton, HistoryRowButton } from '../UI'
import type { ChangeHistoryEntry } from '../UI'
import { SearchIcon, FilterIcon, DownloadIcon, ChevronDownIcon, CloseIcon, CheckIcon, SparklesIcon } from '../Icons'
import starAnimation from '../../assets/star-animation.png'

// Icons
function ListIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M1 3h14v1H1V3zm0 4h14v1H1V7zm0 4h14v1H1v-1z" />
    </svg>
  )
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 4C5.5 4 3.5 5.5 2 8c1.5 2.5 3.5 4 6 4s4.5-1.5 6-4c-1.5-2.5-3.5-4-6-4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
    </svg>
  )
}

function DollarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1v2H6v1h2v8H6v1h2v2h1v-2h2v-1H9V4h2V3H9V1H8zM5 5h6v1H5V5zm0 5h6v1H5v-1z" />
    </svg>
  )
}

function TagIconSmall({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M2 2v5.586l6.707 6.707a1 1 0 001.414 0l4.172-4.172a1 1 0 000-1.414L7.586 2H2zm3 4a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
  )
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M6 9.5L10 12.5M6 6.5L10 3.5M3 8a2 2 0 104 0 2 2 0 00-4 0zM9 3.5a2 2 0 104 0 2 2 0 00-4 0zM9 12.5a2 2 0 104 0 2 2 0 00-4 0z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="5" y="5" width="8" height="9" rx="1" />
      <path d="M3 11V3h8" />
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

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="currentColor" opacity="0.3">
      <path d="M4 8h5l2-3h10l2 3h5v17H4V8zm12 14a5 5 0 100-10 5 5 0 000 10z" />
    </svg>
  )
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 4C5.5 4 3.5 5.5 2 8c1.5 2.5 3.5 4 6 4s4.5-1.5 6-4c-1.5-2.5-3.5-4-6-4zm0 6a2 2 0 110-4 2 2 0 010 4z" />
      <path d="M2 2l12 12" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  )
}

function InfinityIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M4.5 8c0 1.5 1 2.5 2.5 2.5S9.5 9.5 11 8s2-2.5 3.5-2.5S17 6.5 17 8s-1 2.5-2.5 2.5S12 9.5 11 8 9 5.5 7 5.5 4.5 6.5 4.5 8z" transform="translate(-2, 0)" strokeLinecap="round" />
    </svg>
  )
}

// Icons for Improve Catalog Modal
function AlignLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M1 3h14v1.5H1V3zm0 4h10v1.5H1V7zm0 4h14v1.5H1V11zm0 4h10v1.5H1v-1.5z" />
    </svg>
  )
}

function BrowserSearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M6.5 1a5.5 5.5 0 014.383 8.823l3.147 3.147a.75.75 0 01-1.06 1.06l-3.147-3.147A5.5 5.5 0 116.5 1zm0 1.5a4 4 0 100 8 4 4 0 000-8z" />
    </svg>
  )
}

function ThumbnailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M2 3a1 1 0 011-1h10a1 1 0 011 1v10a1 1 0 01-1 1H3a1 1 0 01-1-1V3zm1.5.5v9h9v-9h-9zM4 5h3v3H4V5zm4 0h4v1H8V5zm0 2h4v1H8V7zm-4 3h8v1H4v-1z" />
    </svg>
  )
}

// Icons for Review State
function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8 1a7 7 0 110 14A7 7 0 018 1zm3.03 4.97a.75.75 0 00-1.06 0L7 8.94 5.53 7.47a.75.75 0 00-1.06 1.06l2 2a.75.75 0 001.06 0l3.5-3.5a.75.75 0 000-1.06z" />
    </svg>
  )
}

function ThumbUpIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor">
      <path d="M8.864 2.004a.5.5 0 01.472.145l.009.01.007.009.01.012.034.049a4.162 4.162 0 01.503 1.063c.123.39.207.82.207 1.208 0 .386-.05.78-.15 1.154L14.5 5.5a.5.5 0 01.5.5v.5c0 .276-.224.5-.5.5l-.001.5a.5.5 0 01-.466.498L14 7.5v.5a.5.5 0 01-.467.498L13.5 8.5v.5a.5.5 0 01-.467.498L13 9.5H8.5l-.138.346a8.546 8.546 0 01-.745 1.436 5.847 5.847 0 01-1.08 1.315.5.5 0 01-.787-.41V10H4a1 1 0 01-1-1V5a1 1 0 011-1h2l.138-.346a8.54 8.54 0 01.745-1.436 5.847 5.847 0 011.08-1.315.5.5 0 01.901.101z" />
    </svg>
  )
}

function ThumbDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" style={{ transform: 'rotate(180deg)' }}>
      <path d="M8.864 2.004a.5.5 0 01.472.145l.009.01.007.009.01.012.034.049a4.162 4.162 0 01.503 1.063c.123.39.207.82.207 1.208 0 .386-.05.78-.15 1.154L14.5 5.5a.5.5 0 01.5.5v.5c0 .276-.224.5-.5.5l-.001.5a.5.5 0 01-.466.498L14 7.5v.5a.5.5 0 01-.467.498L13.5 8.5v.5a.5.5 0 01-.467.498L13 9.5H8.5l-.138.346a8.546 8.546 0 01-.745 1.436 5.847 5.847 0 01-1.08 1.315.5.5 0 01-.787-.41V10H4a1 1 0 01-1-1V5a1 1 0 011-1h2l.138-.346a8.54 8.54 0 01.745-1.436 5.847 5.847 0 011.08-1.315.5.5 0 01.901.101z" />
    </svg>
  )
}

// Mock product data
interface Product {
  id: string
  name: string
  image?: string
  status: 'published' | 'hidden' | 'draft'
  tags: string[]
  stock: number | 'infinite'
  price: number
  promotionalPrice?: number
  variants?: { name: string; stock: number | 'infinite' }[]
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Camiseta Básica Algodão Premium',
    status: 'hidden',
    tags: ['Vestuário', 'Camisetas', 'Masculino', 'Verão', 'Algodão'],
    stock: 'infinite',
    price: 0,
    promotionalPrice: 0,
  },
  {
    id: '2',
    name: 'Calça Jeans Slim Fit',
    status: 'published',
    tags: ['Vestuário', 'Calças', 'Jeans', 'Masculino'],
    stock: 'infinite',
    price: 0,
    promotionalPrice: 0,
    variants: [
      { name: '0,60 ANCHO x 0,80...', stock: 15 },
      { name: 'Melange claro / OO', stock: 'infinite' },
      { name: '4 / MASCULINO / Pr...', stock: 30 },
    ],
  },
  {
    id: '3',
    name: 'Tênis Esportivo Running',
    status: 'hidden',
    tags: ['Calçados', 'Esportivo', 'Running'],
    stock: 'infinite',
    price: 0,
    promotionalPrice: 0,
  },
  {
    id: '4',
    name: 'Vestido Floral Verão',
    status: 'hidden',
    tags: ['Vestuário', 'Vestidos', 'Feminino', 'Verão'],
    stock: 'infinite',
    price: 0,
    promotionalPrice: 0,
  },
  {
    id: '5',
    name: 'Bolsa de Couro Elegante',
    status: 'hidden',
    tags: ['Acessórios', 'Bolsas', 'Couro'],
    stock: 'infinite',
    price: 0,
    promotionalPrice: 0,
  },
  {
    id: '6',
    name: 'Relógio Analógico Clássico',
    status: 'hidden',
    tags: ['Acessórios', 'Relógios', 'Clássico'],
    stock: 'infinite',
    price: 0,
    promotionalPrice: 0,
  },
  {
    id: '7',
    name: 'Jaqueta de Couro Masculina',
    status: 'hidden',
    tags: ['Vestuário', 'Jaquetas', 'Masculino'],
    stock: 'infinite',
    price: 0,
    promotionalPrice: 0,
  },
]

// Product change history mock data (edits/alterations only)
const productChangeHistory: ChangeHistoryEntry[] = [
  {
    id: 'p1',
    entityId: '2',
    entityName: 'Calça Jeans Slim Fit',
    userName: 'Maria Silva',
    userInitials: 'MS',
    userColor: '#7C3AED',
    action: 'price_change',
    field: 'Preço',
    oldValue: 'R$ 189,90',
    newValue: 'R$ 159,90',
    timestamp: new Date(2026, 1, 10, 14, 32),
    description: 'Alterou o preço do produto'
  },
  {
    id: 'p2',
    entityId: '1',
    entityName: 'Camiseta Básica Algodão Premium',
    userName: 'Maria Silva',
    userInitials: 'MS',
    userColor: '#7C3AED',
    action: 'update',
    field: 'Descrição',
    oldValue: 'Camiseta básica algodão',
    newValue: 'Camiseta básica confeccionada em algodão premium 100% orgânico, com toque macio e acabamento superior.',
    timestamp: new Date(2026, 1, 10, 13, 15),
    description: 'Editou a descrição do produto',
    usedAI: true
  },
  {
    id: 'p3',
    entityId: '3',
    entityName: 'Tênis Esportivo Running',
    userName: 'João Oliveira',
    userInitials: 'JO',
    userColor: '#059669',
    action: 'status_change',
    field: 'Status',
    oldValue: 'Publicado',
    newValue: 'Oculto',
    timestamp: new Date(2026, 1, 10, 11, 45),
    description: 'Alterou o status do produto'
  },
  {
    id: 'p4',
    entityId: '4',
    entityName: 'Vestido Floral Verão',
    userName: 'Maria Silva',
    userInitials: 'MS',
    userColor: '#7C3AED',
    action: 'update',
    field: 'Tags',
    oldValue: 'Vestidos, Feminino',
    newValue: 'Vestuário, Vestidos, Feminino, Verão, Floral',
    timestamp: new Date(2026, 1, 10, 10, 20),
    description: 'Editou as tags do produto'
  },
  {
    id: 'p5',
    entityId: '1',
    entityName: 'Camiseta Básica Algodão Premium',
    userName: 'João Oliveira',
    userInitials: 'JO',
    userColor: '#059669',
    action: 'update',
    field: 'SEO',
    oldValue: '(vazio)',
    newValue: 'Camiseta Básica Algodão Premium - Conforto e Qualidade',
    timestamp: new Date(2026, 1, 10, 9, 50),
    description: 'Editou o título SEO do produto',
    usedAI: true
  },
  {
    id: 'p6',
    entityId: '5',
    entityName: 'Bolsa de Couro Elegante',
    userName: 'Ana Costa',
    userInitials: 'AC',
    userColor: '#DC2626',
    action: 'price_change',
    field: 'Preço promocional',
    oldValue: '(vazio)',
    newValue: 'R$ 249,90',
    timestamp: new Date(2026, 1, 9, 16, 30),
    description: 'Alterou o preço promocional'
  },
  {
    id: 'p7',
    entityId: '6',
    entityName: 'Relógio Analógico Clássico',
    userName: 'João Oliveira',
    userInitials: 'JO',
    userColor: '#059669',
    action: 'update',
    field: 'Estoque',
    oldValue: '∞ Infinito',
    newValue: '50 unid.',
    timestamp: new Date(2026, 1, 9, 14, 10),
    description: 'Alterou o estoque do produto'
  },
  {
    id: 'p8',
    entityId: '7',
    entityName: 'Jaqueta de Couro Masculina',
    userName: 'Maria Silva',
    userInitials: 'MS',
    userColor: '#7C3AED',
    action: 'update',
    field: 'Peso',
    oldValue: '0.5 kg',
    newValue: '1.2 kg',
    timestamp: new Date(2026, 1, 9, 11, 0),
    description: 'Editou o peso do produto'
  },
  {
    id: 'p9',
    entityId: '2',
    entityName: 'Calça Jeans Slim Fit',
    userName: 'Ana Costa',
    userInitials: 'AC',
    userColor: '#DC2626',
    action: 'update',
    field: 'Texto alternativo',
    oldValue: '(vazio)',
    newValue: 'Calça jeans slim fit masculina azul escuro com lavagem moderna',
    timestamp: new Date(2026, 1, 9, 9, 30),
    description: 'Editou o texto alternativo da imagem',
    usedAI: true
  },
  {
    id: 'p10',
    entityId: '3',
    entityName: 'Tênis Esportivo Running',
    userName: 'Ana Costa',
    userInitials: 'AC',
    userColor: '#DC2626',
    action: 'update',
    field: 'Variantes',
    oldValue: '2 variantes',
    newValue: '5 variantes',
    timestamp: new Date(2026, 1, 8, 15, 45),
    description: 'Editou as variantes do produto'
  },
]

const productHistoryFilters = [
  { key: 'all', label: 'Todos' },
  { key: 'update', label: 'Edições' },
  { key: 'price_change', label: 'Preço' },
  { key: 'status_change', label: 'Status' },
]

interface ProductListPageProps {
  onAddProduct: () => void
}

// Improve Catalog Modal Options
interface ImproveCatalogOption {
  id: string
  label: string
  icon: React.ReactNode
}

const improveCatalogOptions: ImproveCatalogOption[] = [
  { id: 'description', label: 'Descrição do produto', icon: <AlignLeftIcon className="w-4 h-4" /> },
  { id: 'seo', label: 'Melhorar SEO', icon: <BrowserSearchIcon className="w-4 h-4" /> },
  { id: 'tags', label: 'Melhorar tags', icon: <BrowserSearchIcon className="w-4 h-4" /> },
  { id: 'alt-text', label: 'Texto alternativo', icon: <ThumbnailIcon className="w-4 h-4" /> },
]

// Loading status messages based on selected options
const loadingMessages: Record<string, string> = {
  'description': 'Gerando descrição...',
  'seo': 'Otimizando SEO...',
  'tags': 'Melhorando tags...',
  'alt-text': 'Gerando texto alternativo...',
}

// Improve Catalog Modal Component
function ImproveCatalogModal({
  isOpen,
  onClose,
  onConfirm,
  selectedProductsCount
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: (selectedOptions: string[]) => void
  selectedProductsCount: number
}) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) {
      setSelectedOptions([])
      setIsLoading(false)
      setCurrentLoadingStep(0)
      setProgress(0)
    }
  }, [isOpen])

  // Loading animation
  useEffect(() => {
    if (!isLoading || selectedOptions.length === 0) return

    const totalSteps = selectedOptions.length
    const progressPerStep = 100 / totalSteps
    let currentStep = 0

    const stepInterval = setInterval(() => {
      if (currentStep < totalSteps) {
        setCurrentLoadingStep(currentStep)
        
        // Animate progress for each step
        const startProgress = currentStep * progressPerStep
        const endProgress = (currentStep + 1) * progressPerStep
        let currentProgress = startProgress
        
        const progressInterval = setInterval(() => {
          currentProgress += 2
          if (currentProgress >= endProgress) {
            clearInterval(progressInterval)
            currentProgress = endProgress
          }
          setProgress(currentProgress)
        }, 50)

        currentStep++
      } else {
        clearInterval(stepInterval)
        // Complete - close modal after a brief delay
        setTimeout(() => {
          onConfirm(selectedOptions)
          setIsLoading(false)
        }, 500)
      }
    }, 2000) // 2 seconds per step

    return () => clearInterval(stepInterval)
  }, [isLoading, selectedOptions, onConfirm])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (!isLoading) {
          onClose()
        }
      }
    }
    
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape' && !isLoading) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, isLoading, onClose])

  const toggleOption = (optionId: string) => {
    setSelectedOptions(prev => 
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    )
  }

  const handleConfirm = () => {
    if (selectedOptions.length > 0) {
      setIsLoading(true)
      setProgress(0)
      setCurrentLoadingStep(0)
    }
  }

  if (!isOpen) return null

  // Loading State View
  if (isLoading) {
    const currentOption = selectedOptions[currentLoadingStep]
    const loadingMessage = currentOption ? loadingMessages[currentOption] : 'Processando...'

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Loading Modal */}
        <div 
          ref={modalRef}
          className="relative bg-white rounded-lg shadow-xl w-[280px] p-6 flex flex-col items-center"
        >
          {/* Animated Sparkles Icon */}
          <div className="mb-4">
            <img 
              src={starAnimation} 
              alt="Loading animation" 
              className="w-16 h-16 object-contain"
            />
          </div>

          {/* Title */}
          <h2 className="text-base font-semibold text-neutral-text-high mb-1">
            Melhorar catálogo
          </h2>

          {/* Status Message */}
          <p className="text-sm text-neutral-text-disabled mb-4">
            {loadingMessage}
          </p>

          {/* Progress Bar */}
          <div className="w-full h-1.5 bg-neutral-surface rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #0050C3 0%, #4629BA 50%, #D8446E 100%)'
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Modal */}
      <div 
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-xl w-[556px] max-w-[90vw] p-4"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg hover:bg-neutral-surface transition-colors"
        >
          <CloseIcon className="w-4 h-4 text-neutral-text-high" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1.5">
            <h2 className="text-xl font-semibold text-neutral-text-high">Melhorar catálogo</h2>
            <span className="flex items-center gap-1 px-2 py-0.5 text-xs border border-primary-interactive rounded-full text-neutral-text-high">
              <SparklesIcon className="w-3 h-3" />
              IA
            </span>
          </div>
          <p className="text-sm text-neutral-text-disabled">
            Escolha o que deseja melhorar nos produtos.
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-4 mb-6">
          {improveCatalogOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => toggleOption(option.id)}
              className="flex items-center gap-2 p-4 bg-white rounded-lg shadow-[0px_0px_2px_0px_#888] hover:shadow-[0px_0px_4px_0px_#888] transition-shadow text-left"
            >
              {/* Checkbox */}
              <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                selectedOptions.includes(option.id) 
                  ? 'bg-primary-interactive border-primary-interactive' 
                  : 'border-neutral-interactive bg-white'
              }`}>
                {selectedOptions.includes(option.id) && (
                  <CheckIcon className="w-3 h-3 text-white" />
                )}
              </div>
              
              {/* Icon and Label */}
              <div className="flex items-center gap-2">
                <span className="text-neutral-text-high">{option.icon}</span>
                <span className="text-sm font-medium text-neutral-text-high">{option.label}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-sm font-medium text-neutral-text-high bg-neutral-surface border border-neutral-interactive rounded-lg hover:bg-neutral-surface-highlight transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedOptions.length === 0}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              selectedOptions.length > 0
                ? 'bg-primary-interactive text-white hover:bg-primary-interactive-hover'
                : 'bg-neutral-surface-disabled text-neutral-text-disabled border border-primary-surface-highlight cursor-not-allowed'
            }`}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}

// Complete Info Modal Options
interface CompleteInfoOption {
  id: string
  label: string
  icon: React.ReactNode
  count: number
  unit: string
}

// Complete Info Modal Component (3 steps: analyze, select, generate)
function CompleteInfoModal({
  isOpen,
  onClose,
  onConfirm,
  selectedProductsCount
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: (selectedOptions: string[]) => void
  selectedProductsCount: number
}) {
  const [step, setStep] = useState<'analyzing' | 'selecting' | 'generating'>('analyzing')
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const modalRef = useRef<HTMLDivElement>(null)
  
  // Mock data for options with counts (simulating what was found during analysis)
  const completeInfoOptions: CompleteInfoOption[] = [
    { id: 'description', label: 'Descrição do produto', icon: <AlignLeftIcon className="w-4 h-4" />, count: 1, unit: 'produtos' },
    { id: 'dimensions', label: 'Pesos e dimensões', icon: <BrowserSearchIcon className="w-4 h-4" />, count: 5, unit: 'produtos' },
    { id: 'seo-tag-brand', label: 'SEO, Tag e Marca', icon: <BrowserSearchIcon className="w-4 h-4" />, count: 10, unit: 'produtos' },
    { id: 'categories', label: 'Selecionar categorias', icon: <TagIconSmall className="w-4 h-4" />, count: 0, unit: 'produtos' },
    { id: 'alt-text', label: 'Texto alternativo', icon: <ThumbnailIcon className="w-4 h-4" />, count: 100, unit: 'imagens' },
  ]
  
  // Loading messages for generation step
  const generationMessages: Record<string, string> = {
    'description': 'Gerando descrição...',
    'dimensions': 'Gerando pesos e dimensões...',
    'seo-tag-brand': 'Gerando SEO, tags e marca...',
    'categories': 'Selecionando categorias...',
    'alt-text': 'Gerando texto alternativo...',
  }

  useEffect(() => {
    if (!isOpen) {
      setStep('analyzing')
      setSelectedOptions([])
      setCurrentLoadingStep(0)
      setProgress(0)
    }
  }, [isOpen])

  // Analysis loading animation
  useEffect(() => {
    if (!isOpen || step !== 'analyzing') return
    
    setProgress(0)
    const duration = 3000 // 3 seconds for analysis
    const interval = 50
    let currentProgress = 0
    
    const progressInterval = setInterval(() => {
      currentProgress += (100 / (duration / interval))
      if (currentProgress >= 100) {
        clearInterval(progressInterval)
        setProgress(100)
        setTimeout(() => setStep('selecting'), 500)
      } else {
        setProgress(currentProgress)
      }
    }, interval)
    
    return () => clearInterval(progressInterval)
  }, [isOpen, step])

  // Generation loading animation
  useEffect(() => {
    if (step !== 'generating' || selectedOptions.length === 0) return

    const totalSteps = selectedOptions.length
    const progressPerStep = 100 / totalSteps
    let currentStep = 0

    setProgress(0)
    setCurrentLoadingStep(0)

    const stepInterval = setInterval(() => {
      if (currentStep < totalSteps) {
        setCurrentLoadingStep(currentStep)
        
        const startProgress = currentStep * progressPerStep
        const endProgress = (currentStep + 1) * progressPerStep
        let currentProgress = startProgress
        
        const progressInterval = setInterval(() => {
          currentProgress += 2
          if (currentProgress >= endProgress) {
            clearInterval(progressInterval)
            currentProgress = endProgress
          }
          setProgress(currentProgress)
        }, 50)

        currentStep++
      } else {
        clearInterval(stepInterval)
        setTimeout(() => {
          onConfirm(selectedOptions)
        }, 500)
      }
    }, 2000)

    return () => clearInterval(stepInterval)
  }, [step, selectedOptions, onConfirm])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (step === 'selecting') {
          onClose()
        }
      }
    }
    
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape' && step === 'selecting') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, step, onClose])

  const toggleOption = (optionId: string) => {
    const option = completeInfoOptions.find(o => o.id === optionId)
    if (option && option.count === 0) return // Can't select options with 0 count
    
    setSelectedOptions(prev => 
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    )
  }

  const handleComplete = () => {
    if (selectedOptions.length > 0) {
      setStep('generating')
    }
  }

  if (!isOpen) return null

  // Step 1: Analyzing products
  if (step === 'analyzing') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" />
        <div 
          ref={modalRef}
          className="relative bg-white rounded-lg shadow-xl w-[280px] p-6 flex flex-col items-center"
        >
          <div className="mb-4">
            <img 
              src={starAnimation} 
              alt="Loading animation" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <h2 className="text-base font-semibold text-neutral-text-high mb-1">
            Analisar os produtos
          </h2>
          <p className="text-sm text-neutral-text-disabled mb-4">
            Analisando os {selectedProductsCount} produtos selecionados...
          </p>
          <div className="w-full h-1.5 bg-neutral-surface rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #0059d5, #8b5cf6)'
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  // Step 2: Selection modal
  if (step === 'selecting') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" />
        <div 
          ref={modalRef}
          className="relative bg-white rounded-lg shadow-xl w-[420px] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-surface">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-neutral-text-high">Completar informações</h2>
              <span className="flex items-center gap-1 px-2 py-0.5 text-xs bg-primary-surface text-primary-interactive rounded-full">
                <SparklesIcon className="w-3 h-3" />
                IA
              </span>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-neutral-surface rounded transition-colors"
            >
              <CloseIcon className="w-5 h-5 text-neutral-text-low" />
            </button>
          </div>
          
          {/* Description */}
          <div className="px-4 pt-3 pb-2">
            <p className="text-sm text-neutral-text-low">
              Selecione os tipos de dados que você quer gerar automaticamente do produto.
            </p>
          </div>
          
          {/* Options */}
          <div className="px-4 py-2">
            {completeInfoOptions.map((option) => (
              <label 
                key={option.id}
                className={`flex items-center justify-between py-3 cursor-pointer ${
                  option.count === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option.id)}
                    onChange={() => toggleOption(option.id)}
                    disabled={option.count === 0}
                    className="w-4 h-4 rounded border-neutral-interactive text-primary-interactive focus:ring-primary-interactive disabled:opacity-50"
                  />
                  <span className="text-neutral-text-low">{option.icon}</span>
                  <span className="text-sm text-neutral-text-high">{option.label}</span>
                </div>
                <span className="text-xs text-neutral-text-low bg-neutral-surface px-2 py-1 rounded">
                  {option.count} {option.unit}
                </span>
              </label>
            ))}
          </div>
          
          {/* Footer */}
          <div className="flex justify-end gap-2 p-4 border-t border-neutral-surface">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-neutral-text-high bg-white border border-neutral-interactive rounded-lg hover:bg-neutral-surface transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleComplete}
              disabled={selectedOptions.length === 0}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                selectedOptions.length > 0
                  ? 'bg-primary-interactive text-white hover:bg-primary-interactive-hover'
                  : 'bg-neutral-surface-disabled text-neutral-text-disabled cursor-not-allowed'
              }`}
            >
              Completar
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Step 3: Generating content
  const currentOption = selectedOptions[currentLoadingStep]
  const loadingMessage = currentOption ? generationMessages[currentOption] : 'Processando...'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />
      <div 
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-xl w-[280px] p-6 flex flex-col items-center"
      >
        <div className="mb-4">
          <img 
            src={starAnimation} 
            alt="Loading animation" 
            className="w-16 h-16 object-contain"
          />
        </div>
        <h2 className="text-base font-semibold text-neutral-text-high mb-1">
          Completar informações
        </h2>
        <p className="text-sm text-neutral-text-disabled mb-4">
          {loadingMessage}
        </p>
        <div className="w-full h-1.5 bg-neutral-surface rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{ 
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #0059d5, #8b5cf6)'
            }}
          />
        </div>
      </div>
    </div>
  )
}

// Fix Errors Modal Options
interface FixErrorOption {
  id: string
  label: string
  icon: React.ReactNode
  count: number
  severity: 'high' | 'medium' | 'low'
}

// Fix Errors Modal Component (3 steps: analyze, select, fix)
function FixErrorsModal({
  isOpen,
  onClose,
  onConfirm,
  selectedProductsCount
}: {
  isOpen: boolean
  onClose: () => void
  onConfirm: (selectedOptions: string[]) => void
  selectedProductsCount: number
}) {
  const [step, setStep] = useState<'analyzing' | 'selecting' | 'fixing'>('analyzing')
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [currentLoadingStep, setCurrentLoadingStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const modalRef = useRef<HTMLDivElement>(null)
  
  // Mock data for errors found during analysis
  const errorOptions: FixErrorOption[] = [
    { id: 'missing-description', label: 'Descrição muito curta ou ausente', icon: <AlignLeftIcon className="w-4 h-4" />, count: 8, severity: 'high' },
    { id: 'spelling-errors', label: 'Erros de ortografia', icon: <AlignLeftIcon className="w-4 h-4" />, count: 12, severity: 'medium' },
    { id: 'missing-images', label: 'Imagens ausentes', icon: <ThumbnailIcon className="w-4 h-4" />, count: 3, severity: 'high' },
    { id: 'missing-alt-text', label: 'Texto alternativo ausente', icon: <ThumbnailIcon className="w-4 h-4" />, count: 15, severity: 'medium' },
    { id: 'seo-issues', label: 'SEO incompleto ou inválido', icon: <BrowserSearchIcon className="w-4 h-4" />, count: 10, severity: 'medium' },
    { id: 'price-inconsistency', label: 'Inconsistência de preços', icon: <TagIconSmall className="w-4 h-4" />, count: 2, severity: 'high' },
    { id: 'missing-category', label: 'Produtos sem categoria', icon: <TagIconSmall className="w-4 h-4" />, count: 5, severity: 'low' },
    { id: 'duplicate-content', label: 'Conteúdo duplicado', icon: <AlignLeftIcon className="w-4 h-4" />, count: 4, severity: 'low' },
  ]
  
  // Loading messages for fix step
  const fixMessages: Record<string, string> = {
    'missing-description': 'Corrigindo descrições...',
    'spelling-errors': 'Corrigindo ortografia...',
    'missing-images': 'Verificando imagens...',
    'missing-alt-text': 'Gerando texto alternativo...',
    'seo-issues': 'Corrigindo SEO...',
    'price-inconsistency': 'Verificando preços...',
    'missing-category': 'Categorizando produtos...',
    'duplicate-content': 'Removendo duplicações...',
  }

  // Get severity color
  const getSeverityColor = (severity: 'high' | 'medium' | 'low') => {
    switch (severity) {
      case 'high': return 'bg-danger-surface text-danger-interactive'
      case 'medium': return 'bg-warning-surface text-warning-interactive'
      case 'low': return 'bg-neutral-surface text-neutral-text-low'
    }
  }

  // Get total errors count
  const totalErrors = errorOptions.reduce((sum, opt) => sum + opt.count, 0)

  useEffect(() => {
    if (!isOpen) {
      setStep('analyzing')
      setSelectedOptions([])
      setCurrentLoadingStep(0)
      setProgress(0)
    }
  }, [isOpen])

  // Analysis loading animation
  useEffect(() => {
    if (!isOpen || step !== 'analyzing') return
    
    setProgress(0)
    const duration = 3000 // 3 seconds for analysis
    const interval = 50
    let currentProgress = 0
    
    const progressInterval = setInterval(() => {
      currentProgress += (100 / (duration / interval))
      if (currentProgress >= 100) {
        clearInterval(progressInterval)
        setProgress(100)
        setTimeout(() => setStep('selecting'), 500)
      } else {
        setProgress(currentProgress)
      }
    }, interval)
    
    return () => clearInterval(progressInterval)
  }, [isOpen, step])

  // Fixing loading animation
  useEffect(() => {
    if (step !== 'fixing' || selectedOptions.length === 0) return

    const totalSteps = selectedOptions.length
    const progressPerStep = 100 / totalSteps
    let currentStep = 0

    setProgress(0)
    setCurrentLoadingStep(0)

    const stepInterval = setInterval(() => {
      if (currentStep < totalSteps) {
        setCurrentLoadingStep(currentStep)
        
        const startProgress = currentStep * progressPerStep
        const endProgress = (currentStep + 1) * progressPerStep
        let currentProgress = startProgress
        
        const progressInterval = setInterval(() => {
          currentProgress += 2
          if (currentProgress >= endProgress) {
            clearInterval(progressInterval)
            currentProgress = endProgress
          }
          setProgress(currentProgress)
        }, 50)

        currentStep++
      } else {
        clearInterval(stepInterval)
        setTimeout(() => {
          onConfirm(selectedOptions)
        }, 500)
      }
    }, 2000)

    return () => clearInterval(stepInterval)
  }, [step, selectedOptions, onConfirm])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        if (step === 'selecting') {
          onClose()
        }
      }
    }
    
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape' && step === 'selecting') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, step, onClose])

  const toggleOption = (optionId: string) => {
    const option = errorOptions.find(o => o.id === optionId)
    if (option && option.count === 0) return
    
    setSelectedOptions(prev => 
      prev.includes(optionId)
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    )
  }

  const handleSelectAll = () => {
    const selectableOptions = errorOptions.filter(o => o.count > 0).map(o => o.id)
    setSelectedOptions(selectableOptions)
  }

  const handleFix = () => {
    if (selectedOptions.length > 0) {
      setStep('fixing')
    }
  }

  if (!isOpen) return null

  // Step 1: Analyzing products for errors
  if (step === 'analyzing') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" />
        <div 
          ref={modalRef}
          className="relative bg-white rounded-lg shadow-xl w-[280px] p-6 flex flex-col items-center"
        >
          <div className="mb-4">
            <img 
              src={starAnimation} 
              alt="Loading animation" 
              className="w-16 h-16 object-contain"
            />
          </div>
          <h2 className="text-base font-semibold text-neutral-text-high mb-1">
            Analisar os produtos
          </h2>
          <p className="text-sm text-neutral-text-disabled mb-4 text-center">
            Buscando erros nos {selectedProductsCount} produtos selecionados...
          </p>
          <div className="w-full h-1.5 bg-neutral-surface rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-300 ease-out"
              style={{ 
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #0059d5, #8b5cf6)'
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  // Step 2: Selection modal showing found errors
  if (step === 'selecting') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" />
        <div 
          ref={modalRef}
          className="relative bg-white rounded-lg shadow-xl w-[480px] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-surface">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-neutral-text-high">Corrigir erros</h2>
              <span className="flex items-center gap-1 px-2 py-0.5 text-xs bg-primary-surface text-primary-interactive rounded-full">
                <SparklesIcon className="w-3 h-3" />
                IA
              </span>
            </div>
            <button 
              onClick={onClose}
              className="p-1 hover:bg-neutral-surface rounded transition-colors"
            >
              <CloseIcon className="w-5 h-5 text-neutral-text-low" />
            </button>
          </div>
          
          {/* Summary */}
          <div className="px-4 pt-3 pb-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-text-low">
                Encontramos <span className="font-semibold text-neutral-text-high">{totalErrors} erros</span> nos produtos selecionados.
              </p>
              <button 
                onClick={handleSelectAll}
                className="text-xs text-primary-interactive hover:underline"
              >
                Selecionar todos
              </button>
            </div>
          </div>
          
          {/* Error Options */}
          <div className="px-4 py-2 max-h-[400px] overflow-y-auto">
            {errorOptions.map((option) => (
              <label 
                key={option.id}
                className={`flex items-center justify-between py-3 cursor-pointer border-b border-neutral-surface last:border-b-0 ${
                  option.count === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedOptions.includes(option.id)}
                    onChange={() => toggleOption(option.id)}
                    disabled={option.count === 0}
                    className="w-4 h-4 rounded border-neutral-interactive text-primary-interactive focus:ring-primary-interactive disabled:opacity-50"
                  />
                  <span className="text-neutral-text-low">{option.icon}</span>
                  <span className="text-sm text-neutral-text-high">{option.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${getSeverityColor(option.severity)}`}>
                    {option.count}
                  </span>
                </div>
              </label>
            ))}
          </div>
          
          {/* Footer */}
          <div className="flex justify-end gap-2 p-4 border-t border-neutral-surface">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-neutral-text-high bg-white border border-neutral-interactive rounded-lg hover:bg-neutral-surface transition-colors"
            >
              Cancelar
            </button>
            <button 
              onClick={handleFix}
              disabled={selectedOptions.length === 0}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                selectedOptions.length > 0
                  ? 'bg-primary-interactive text-white hover:bg-primary-interactive-hover'
                  : 'bg-neutral-surface-disabled text-neutral-text-disabled cursor-not-allowed'
              }`}
            >
              Corrigir {selectedOptions.length > 0 ? `(${selectedOptions.length})` : ''}
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Step 3: Fixing errors
  const currentOption = selectedOptions[currentLoadingStep]
  const loadingMessage = currentOption ? fixMessages[currentOption] : 'Processando...'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" />
      <div 
        ref={modalRef}
        className="relative bg-white rounded-lg shadow-xl w-[280px] p-6 flex flex-col items-center"
      >
        <div className="mb-4">
          <img 
            src={starAnimation} 
            alt="Loading animation" 
            className="w-16 h-16 object-contain"
          />
        </div>
        <h2 className="text-base font-semibold text-neutral-text-high mb-1">
          Corrigir erros
        </h2>
        <p className="text-sm text-neutral-text-disabled mb-4">
          {loadingMessage}
        </p>
        <div className="w-full h-1.5 bg-neutral-surface rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{ 
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #0059d5, #8b5cf6)'
            }}
          />
        </div>
      </div>
    </div>
  )
}

// Before/After Comparison Component
function BeforeAfterComparison({
  title,
  beforeContent,
  afterContent,
  onChange,
  type = 'textarea',
  placeholder,
  showTitle = true,
  showToggle = true
}: {
  title: string
  beforeContent: string | string[]
  afterContent: string | string[]
  onChange: (value: string | string[]) => void
  type?: 'textarea' | 'input' | 'tags'
  placeholder?: string
  showTitle?: boolean
  showToggle?: boolean
}) {
  const [showBefore, setShowBefore] = useState(false)
  
  // Render the "before" content as a read-only gray box
  const renderBeforeContent = () => {
    if (type === 'tags' && Array.isArray(beforeContent)) {
      return (
        <div className="flex flex-wrap gap-2 p-2 bg-neutral-surface rounded-lg border border-neutral-surface-highlight min-h-[40px] items-center">
          {beforeContent.length > 0 ? beforeContent.map((tag, i) => (
            <span 
              key={i} 
              className="px-2 py-1 text-xs bg-neutral-surface border border-neutral-surface-highlight text-neutral-text-low rounded"
            >
              {tag}
            </span>
          )) : (
            <span className="text-sm text-neutral-text-disabled">Sem tags anteriores</span>
          )}
        </div>
      )
    }
    
    // Text/Input - render as a gray read-only box
    const content = beforeContent as string
    return (
      <div className="w-full px-3 py-2 text-sm bg-neutral-surface rounded-lg border border-neutral-surface-highlight text-neutral-text-low min-h-[36px]">
        {content || 'Sem conteúdo anterior'}
      </div>
    )
  }
  
  // Render the "after" content as editable with AI highlight
  const renderAfterContent = () => {
    if (type === 'tags' && Array.isArray(afterContent)) {
      return (
        <div className="flex flex-wrap gap-2 p-2 border border-primary-interactive rounded-lg bg-white min-h-[40px] ring-[3px] ring-[#e2dcfa] items-center">
          {afterContent.map((tag, i) => (
            <span 
              key={i}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-neutral-surface border border-primary-interactive rounded"
            >
              {tag}
              <button 
                onClick={() => {
                  const newTags = (afterContent as string[]).filter((_, index) => index !== i)
                  onChange(newTags)
                }} 
                className="hover:text-danger-interactive"
              >
                <CloseIcon className="w-3 h-3" />
              </button>
            </span>
          ))}
          <CloseIcon className="w-4 h-4 text-neutral-text-low ml-auto cursor-pointer hover:text-neutral-text-high" />
        </div>
      )
    }
    
    if (type === 'input') {
      return (
        <input
          type="text"
          value={afterContent as string}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm border border-primary-interactive rounded-lg focus:outline-none ring-[3px] ring-[#e2dcfa] bg-white"
        />
      )
    }
    
    return (
      <textarea
        value={afterContent as string}
        onChange={(e) => onChange(e.target.value)}
        rows={type === 'textarea' ? 3 : 1}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-primary-interactive rounded-lg focus:outline-none ring-[3px] ring-[#e2dcfa] bg-white resize-none"
      />
    )
  }
  
  return (
    <div className="flex flex-col gap-2">
      {/* Header with title and toggle */}
      {showTitle && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-lg font-semibold text-neutral-text-high">{title}</h4>
            <button className="flex items-center gap-1 text-xs text-primary-interactive hover:underline">
              <SparklesIcon className="w-3.5 h-3.5" />
              Gerar com IA
            </button>
          </div>
          {showToggle && (
            <button
              onClick={() => setShowBefore(!showBefore)}
              className="flex items-center gap-1 text-xs text-neutral-text-low hover:text-neutral-text-high transition-colors"
            >
              {showBefore ? (
                <EyeOffIcon className="w-3.5 h-3.5" />
              ) : (
                <EyeIcon className="w-3.5 h-3.5" />
              )}
              {showBefore ? 'Ocultar' : 'Ver anterior'}
            </button>
          )}
        </div>
      )}
      
      {/* Before content (collapsible) - gray box */}
      {showBefore && renderBeforeContent()}
      
      {/* After content (editable) - with AI highlight */}
      {renderAfterContent()}
    </div>
  )
}

// SEO Field Comparison Component (for sub-fields with small labels)
function SEOFieldComparison({
  label,
  beforeContent,
  afterContent,
  onChange,
  type = 'input',
  showToggle = true
}: {
  label: string
  beforeContent: string
  afterContent: string
  onChange: (value: string) => void
  type?: 'input' | 'textarea'
  showToggle?: boolean
}) {
  const [showBefore, setShowBefore] = useState(false)
  
  return (
    <div className="flex flex-col gap-2">
      {/* Before field (collapsible) */}
      {showBefore && (
        <div>
          <label className="block text-xs text-neutral-text-low mb-1">{label}</label>
          <div className="w-full px-3 py-2 text-sm bg-neutral-surface rounded-lg border border-neutral-surface-highlight text-neutral-text-low min-h-[36px]">
            {beforeContent || 'Sem conteúdo anterior'}
          </div>
        </div>
      )}
      
      {/* After field (editable) */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs text-neutral-text-low">{label}</label>
          {showToggle && (
            <button
              onClick={() => setShowBefore(!showBefore)}
              className="flex items-center gap-1 text-xs text-neutral-text-low hover:text-neutral-text-high transition-colors"
            >
              {showBefore ? (
                <EyeOffIcon className="w-3 h-3" />
              ) : (
                <EyeIcon className="w-3 h-3" />
              )}
              {showBefore ? 'Ocultar' : 'Ver anterior'}
            </button>
          )}
        </div>
        {type === 'input' ? (
          <input
            type="text"
            value={afterContent}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-primary-interactive rounded-lg focus:outline-none ring-[3px] ring-[#e2dcfa] bg-white"
          />
        ) : (
          <textarea
            value={afterContent}
            onChange={(e) => onChange(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 text-sm border border-primary-interactive rounded-lg focus:outline-none ring-[3px] ring-[#e2dcfa] bg-white resize-none"
          />
        )}
      </div>
    </div>
  )
}

// Product Review Modal Component (Slide-in Sidebar)
function ProductReviewModal({
  isOpen,
  onClose,
  onSave,
  onDiscard,
  product,
  reviewType = 'improve'
}: {
  isOpen: boolean
  onClose: () => void
  onSave: () => void
  onDiscard: () => void
  product: Product | null
  reviewType?: 'improve' | 'complete' | 'fix'
}) {
  const modalRef = useRef<HTMLDivElement>(null)
  
  // Original content (before AI improvement) - only used in 'improve' mode
  const originalContent = {
    description: 'Jaqueta coral feminina',
    tags: ['jaqueta', 'feminino'],
    seoTitle: '',
    seoDescription: '',
    altText: ''
  }
  
  // AI-generated content state
  const [description, setDescription] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [seoTitle, setSeoTitle] = useState('')
  const [seoDescription, setSeoDescription] = useState('')
  const [altText, setAltText] = useState('')
  
  // Additional fields for "complete" mode
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [width, setWidth] = useState('')
  const [depth, setDepth] = useState('')
  const [brand, setBrand] = useState('')
  
  // Additional fields for "fix" mode - showing corrections
  const [titleCorrected, setTitleCorrected] = useState('')
  const [originalTitle, setOriginalTitle] = useState('')
  const [spellingCorrections, setSpellingCorrections] = useState<{original: string, corrected: string}[]>([])
  const [priceCorrection, setPriceCorrection] = useState<{original: string, corrected: string} | null>(null)
  
  // Dynamic improvement tags based on review type
  const getImprovementTags = () => {
    switch (reviewType) {
      case 'improve':
        return ['Descrição', 'Tags', 'SEO', 'Texto alternativo']
      case 'fix':
        return ['Ortografia', 'Descrição', 'SEO', 'Texto alternativo']
      case 'complete':
        return ['Descrição', 'Pesos e dimensões', 'SEO', 'Tags', 'Texto alternativo']
      default:
        return []
    }
  }
  const improvementTags = getImprovementTags()
  
  useEffect(() => {
    if (product && isOpen) {
      // Simulate AI-generated content (the "after" state)
      setDescription(`Jaqueta biker feminina coral com zíper frontal, bolsos laterais e cinto ajustável na barra. Confeccionada em material sintético de alta qualidade, perfeita para looks urbanos e modernos.`)
      setTags(['jaqueta feminina', 'biker', 'outono', 'inverno', 'moda urbana', 'coral'])
      setSeoTitle('Jaqueta Biker Coral Feminina')
      setSeoDescription('Jaqueta biker coral feminina com zíper frontal, bolsos e cinto ajustável. Perfeita para um visual urbano moderno na meia-estação. Compre já!')
      setAltText('Mulher usando jaqueta biker rosa de couro com zíper e bolsos, combinada com calça preta')
      
      // Additional fields for "complete" mode
      if (reviewType === 'complete') {
        setWeight('0.8')
        setHeight('65')
        setWidth('50')
        setDepth('5')
        setBrand('Urban Style')
      }
      
      // Additional fields for "fix" mode - showing corrections
      if (reviewType === 'fix') {
        setOriginalTitle('Jaqueta coral feminna')
        setTitleCorrected('Jaqueta coral feminina')
        setSpellingCorrections([
          { original: 'feminna', corrected: 'feminina' },
          { original: 'ziper', corrected: 'zíper' },
          { original: 'bolssos', corrected: 'bolsos' },
        ])
        setPriceCorrection({ original: 'R$ 0', corrected: 'R$ 299,90' })
      }
    }
  }, [product, isOpen, reviewType])
  
  useEffect(() => {
    function handleEscKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscKey)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen || !product) return null
  
  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50" 
        onClick={onClose}
      />
      
      {/* Slide-in Sidebar */}
      <div 
        ref={modalRef}
        className="absolute right-0 top-0 h-full w-[482px] bg-white shadow-xl flex flex-col animate-in slide-in-from-right duration-300"
      >
        {/* Header - Back button */}
        <div className="flex items-center px-4 py-2 border-b border-neutral-surface">
          <button 
            onClick={onClose}
            className="flex items-center gap-1 px-2 py-2 text-sm font-medium text-neutral-text-high hover:bg-neutral-surface rounded-lg transition-colors"
          >
            <ChevronLeftIcon className="w-4 h-4" />
            Voltar
          </button>
        </div>
        
        {/* Product Info Bar */}
        <div className="flex gap-3 p-4 border-b border-neutral-surface-highlight">
          {/* Thumbnail */}
          <div className="w-[72px] h-[72px] bg-neutral-surface rounded-lg flex items-center justify-center overflow-hidden shrink-0">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            ) : (
              <CameraIcon className="w-10 h-10 text-neutral-text-disabled" />
            )}
          </div>
          
          {/* Product Details */}
          <div className="flex-1 flex flex-col gap-2">
            <h3 className="text-base font-medium text-neutral-text-high">{product.name}</h3>
            {/* Improvement Tags */}
            <div className="flex flex-wrap gap-1">
              {improvementTags.map((tag) => (
                <span 
                  key={tag}
                  className="px-2 py-0.5 text-xs bg-neutral-surface border border-neutral-surface-highlight text-neutral-text-high rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="flex flex-col gap-4">
            
            {/* Title Correction Card - Only for "fix" mode */}
            {reviewType === 'fix' && (
              <div className="bg-white rounded-lg border border-neutral-surface-highlight shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="text-lg font-semibold text-neutral-text-high">Título corrigido</h4>
                  <span className="px-2 py-0.5 text-xs bg-success-surface text-success-interactive rounded-full">
                    Corrigido
                  </span>
                </div>
                
                {/* Original title with error */}
                <div className="mb-3">
                  <label className="block text-xs text-neutral-text-low mb-1">Antes</label>
                  <div className="w-full px-3 py-2 text-sm bg-neutral-surface rounded-lg border border-neutral-surface-highlight text-neutral-text-low line-through">
                    {originalTitle}
                  </div>
                </div>
                
                {/* Corrected title */}
                <div>
                  <label className="block text-xs text-neutral-text-low mb-1">Depois</label>
                  <input
                    type="text"
                    value={titleCorrected}
                    onChange={(e) => setTitleCorrected(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-primary-interactive rounded-lg focus:outline-none ring-[3px] ring-[#e2dcfa] bg-white"
                  />
                </div>
              </div>
            )}
            
            {/* Spelling Corrections Card - Only for "fix" mode */}
            {reviewType === 'fix' && spellingCorrections.length > 0 && (
              <div className="bg-white rounded-lg border border-neutral-surface-highlight shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="text-lg font-semibold text-neutral-text-high">Correções de ortografia</h4>
                  <span className="px-2 py-0.5 text-xs bg-warning-surface text-warning-interactive rounded-full">
                    {spellingCorrections.length} correções
                  </span>
                </div>
                <p className="text-sm text-neutral-text-low mb-3">
                  Palavras corrigidas automaticamente:
                </p>
                <div className="flex flex-col gap-2">
                  {spellingCorrections.map((correction, index) => (
                    <div key={index} className="flex items-center gap-3 py-2 px-3 bg-neutral-surface rounded-lg">
                      <span className="text-sm text-danger-interactive line-through">{correction.original}</span>
                      <span className="text-neutral-text-disabled">→</span>
                      <span className="text-sm text-success-interactive font-medium">{correction.corrected}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Price Correction Card - Only for "fix" mode */}
            {reviewType === 'fix' && priceCorrection && (
              <div className="bg-white rounded-lg border border-neutral-surface-highlight shadow-sm p-4">
                <div className="flex items-center gap-2 mb-3">
                  <h4 className="text-lg font-semibold text-neutral-text-high">Preço corrigido</h4>
                  <span className="px-2 py-0.5 text-xs bg-danger-surface text-danger-interactive rounded-full">
                    Inconsistência
                  </span>
                </div>
                <p className="text-sm text-neutral-text-low mb-3">
                  O preço estava zerado ou inconsistente com as variantes:
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label className="block text-xs text-neutral-text-low mb-1">Antes</label>
                    <div className="w-full px-3 py-2 text-sm bg-neutral-surface rounded-lg border border-neutral-surface-highlight text-danger-interactive line-through">
                      {priceCorrection.original}
                    </div>
                  </div>
                  <span className="text-neutral-text-disabled mt-5">→</span>
                  <div className="flex-1">
                    <label className="block text-xs text-neutral-text-low mb-1">Depois</label>
                    <input
                      type="text"
                      value={priceCorrection.corrected}
                      onChange={(e) => setPriceCorrection({ ...priceCorrection, corrected: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-primary-interactive rounded-lg focus:outline-none ring-[3px] ring-[#e2dcfa] bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Description Card with Before/After */}
            <div className="bg-white rounded-lg border border-neutral-surface-highlight shadow-sm p-4">
              <BeforeAfterComparison
                title={reviewType === 'fix' ? 'Descrição corrigida' : 'Descrição'}
                beforeContent={reviewType === 'fix' ? 'Jaqueta coral feminna com ziper frontal e bolssos laterais.' : originalContent.description}
                afterContent={description}
                onChange={(val) => setDescription(val as string)}
                type="textarea"
                showToggle={reviewType !== 'complete'}
              />
            </div>
            
            {/* Weights and Dimensions Card - Only for "complete" mode */}
            {reviewType === 'complete' && (
              <div className="bg-white rounded-lg border border-neutral-surface-highlight shadow-sm p-4">
                <div className="flex items-center gap-2 mb-4">
                  <h4 className="text-lg font-semibold text-neutral-text-high">Pesos e dimensões</h4>
                  <button className="flex items-center gap-1 text-xs text-primary-interactive hover:underline">
                    <SparklesIcon className="w-3.5 h-3.5" />
                    Gerar com IA
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-neutral-text-low mb-1">Peso (kg)</label>
                    <input
                      type="text"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-primary-interactive rounded-lg focus:outline-none ring-[3px] ring-[#e2dcfa] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-text-low mb-1">Altura (cm)</label>
                    <input
                      type="text"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-primary-interactive rounded-lg focus:outline-none ring-[3px] ring-[#e2dcfa] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-text-low mb-1">Largura (cm)</label>
                    <input
                      type="text"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-primary-interactive rounded-lg focus:outline-none ring-[3px] ring-[#e2dcfa] bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-neutral-text-low mb-1">Profundidade (cm)</label>
                    <input
                      type="text"
                      value={depth}
                      onChange={(e) => setDepth(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-primary-interactive rounded-lg focus:outline-none ring-[3px] ring-[#e2dcfa] bg-white"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {/* Tags Card with Before/After - Not shown in "fix" mode */}
            {reviewType !== 'fix' && (
              <div className="bg-white rounded-lg border border-neutral-surface-highlight shadow-sm p-4">
                <div className="mb-3">
                  <BeforeAfterComparison
                    title="Tags"
                    beforeContent={originalContent.tags}
                    afterContent={tags}
                    onChange={(val) => setTags(val as string[])}
                    type="tags"
                    showToggle={reviewType !== 'complete'}
                  />
                </div>
                <p className="text-sm text-neutral-text-low -mt-1">
                  Crie palavras-chave e facilite a busca deste produto na sua loja e nos motores de busca do Google.
                </p>
              </div>
            )}
            
            {/* SEO Card with Before/After */}
            <div className="bg-white rounded-lg border border-neutral-surface-highlight shadow-sm p-4">
              {/* Card Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-semibold text-neutral-text-high">
                    {reviewType === 'fix' ? 'SEO corrigido' : 'SEO'}
                  </h4>
                  {reviewType === 'fix' && (
                    <span className="px-2 py-0.5 text-xs bg-success-surface text-success-interactive rounded-full">
                      Corrigido
                    </span>
                  )}
                  <button className="flex items-center gap-1 text-xs text-primary-interactive hover:underline">
                    <SparklesIcon className="w-3.5 h-3.5" />
                    Gerar com IA
                  </button>
                </div>
              </div>
              <p className="text-sm text-neutral-text-low mb-4">
                Aumente a relevância dos seus produtos nos buscadores Google.
              </p>
              
              {/* SEO Title */}
              <div className="mb-4">
                <SEOFieldComparison
                  label="Título SEO"
                  beforeContent={originalContent.seoTitle}
                  afterContent={seoTitle}
                  onChange={(val) => setSeoTitle(val)}
                  type="input"
                  showToggle={reviewType !== 'complete'}
                />
                <span className="text-xs text-neutral-text-disabled mt-1 block">{seoTitle.length}/70 caracteres</span>
              </div>
              
              {/* SEO Description */}
              <div>
                <SEOFieldComparison
                  label="Descrição SEO"
                  beforeContent={originalContent.seoDescription}
                  afterContent={seoDescription}
                  onChange={(val) => setSeoDescription(val)}
                  type="textarea"
                  showToggle={reviewType !== 'complete'}
                />
                <span className="text-xs text-neutral-text-disabled mt-1 block">{seoDescription.length}/320 caracteres</span>
              </div>
            </div>
            
            {/* Brand Card - Only for "complete" mode */}
            {reviewType === 'complete' && (
              <div className="bg-white rounded-lg border border-neutral-surface-highlight shadow-sm p-4">
                <div className="flex items-center gap-2 mb-4">
                  <h4 className="text-lg font-semibold text-neutral-text-high">Marca</h4>
                  <button className="flex items-center gap-1 text-xs text-primary-interactive hover:underline">
                    <SparklesIcon className="w-3.5 h-3.5" />
                    Gerar com IA
                  </button>
                </div>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Nome da marca"
                  className="w-full px-3 py-2 text-sm border border-primary-interactive rounded-lg focus:outline-none ring-[3px] ring-[#e2dcfa] bg-white"
                />
              </div>
            )}
            
            {/* Alt Text Card with Before/After */}
            <div className="bg-white rounded-lg border border-neutral-surface-highlight shadow-sm p-4">
              {/* Card Header */}
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-lg font-semibold text-neutral-text-high">Texto alternativo</h4>
                <button className="flex items-center gap-1 text-xs text-primary-interactive hover:underline">
                  <SparklesIcon className="w-3.5 h-3.5" />
                  Gerar com IA
                </button>
              </div>
              <p className="text-sm text-neutral-text-low mb-3">
                Descreva brevemente a imagem para ajudar buscadores como o Google a entender quando mostrá-la em uma pesquisa.
              </p>
              
              {/* Image Thumbnails */}
              <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div 
                    key={i}
                    className={`w-16 h-16 bg-neutral-surface rounded-lg flex-shrink-0 border-2 ${i === 1 ? 'border-primary-interactive' : 'border-transparent'}`}
                  >
                    <CameraIcon className="w-full h-full p-3 text-neutral-text-disabled" />
                  </div>
                ))}
              </div>
              
              {/* Alt text field with its own toggle */}
              <SEOFieldComparison
                label="Texto da imagem"
                beforeContent={originalContent.altText}
                afterContent={altText}
                onChange={(val) => setAltText(val)}
                type="textarea"
                showToggle={reviewType !== 'complete'}
              />
            </div>
            
            {/* Variants Section - Only for "complete" mode */}
            {reviewType === 'complete' && (
              <div className="bg-white rounded-lg border border-neutral-surface-highlight shadow-sm p-4">
                <h4 className="text-lg font-semibold text-neutral-text-high mb-4">Variantes</h4>
                <div className="flex flex-col">
                  {['P', 'M', 'G', 'Azul', 'Marrom'].map((variant) => (
                    <div
                      key={variant}
                      className="flex items-center justify-between py-3 border-b border-neutral-surface last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-neutral-surface rounded-lg flex items-center justify-center">
                          <CameraIcon className="w-6 h-6 text-neutral-text-disabled" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-neutral-text-high">{variant}</p>
                          <p className="text-xs text-neutral-text-low">SKU: JKT-CRL-{variant}</p>
                        </div>
                      </div>
                      <ChevronDownIcon className="w-4 h-4 text-neutral-text-low" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-surface bg-white">
          <button 
            onClick={onDiscard}
            className="flex items-center gap-1 text-sm text-neutral-text-low hover:text-neutral-text-high transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
            Descartar
          </button>
          <div className="flex gap-2">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-neutral-text-high bg-white border border-neutral-interactive rounded-lg hover:bg-neutral-surface transition-colors"
            >
              Fechar
            </button>
            <button 
              onClick={onSave}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-interactive rounded-lg hover:bg-primary-interactive-hover transition-colors"
            >
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Bulk Actions Dropdown Component
function BulkActionsDropdown({ 
  isOpen, 
  onClose, 
  onAction 
}: { 
  isOpen: boolean
  onClose: () => void
  onAction: (action: string) => void 
}) {
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-full left-0 mt-1 w-60 bg-white rounded-lg shadow-lg border border-neutral-surface-disabled z-50 overflow-hidden"
    >
      {/* First section - Regular actions */}
      <div className="p-2 border-b border-neutral-surface-disabled">
        <button 
          onClick={() => onAction('delete')}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-neutral-text-high hover:bg-neutral-surface rounded-lg transition-colors"
        >
          <TrashIcon className="w-4 h-4" />
          Excluir
        </button>
        <button 
          onClick={() => onAction('show')}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-neutral-text-high hover:bg-neutral-surface rounded-lg transition-colors"
        >
          <EyeIcon className="w-4 h-4" />
          Mostrar na loja
        </button>
        <button 
          onClick={() => onAction('hide')}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-neutral-text-high hover:bg-neutral-surface rounded-lg transition-colors"
        >
          <EyeOffIcon className="w-4 h-4" />
          Ocultar da loja
        </button>
        <button 
          onClick={() => onAction('edit-price')}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-neutral-text-high hover:bg-neutral-surface rounded-lg transition-colors"
        >
          <DollarIcon className="w-4 h-4" />
          Editar preço
        </button>
        <button 
          onClick={() => onAction('categories')}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-neutral-text-high hover:bg-neutral-surface rounded-lg transition-colors"
        >
          <TagIconSmall className="w-4 h-4" />
          Atribuir categorias
        </button>
      </div>

      {/* Second section - AI actions */}
      <div className="p-2">
        <button 
          onClick={() => onAction('improve-catalog')}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-neutral-text-high hover:bg-neutral-surface rounded-lg transition-colors"
        >
          <SparklesIcon className="w-4 h-4" />
          Melhorar catálogo
        </button>
        <button 
          onClick={() => onAction('complete-info')}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-neutral-text-high hover:bg-neutral-surface rounded-lg transition-colors"
        >
          <SparklesIcon className="w-4 h-4" />
          Completar informações
        </button>
        <button 
          onClick={() => onAction('fix-errors')}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-sm text-neutral-text-high hover:bg-neutral-surface rounded-lg transition-colors"
        >
          <SparklesIcon className="w-4 h-4" />
          Corrigir erros
        </button>
      </div>
    </div>
  )
}

export function ProductListPage({ onAddProduct }: ProductListPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [filterChips, setFilterChips] = useState<string[]>([])
  const [isActionsDropdownOpen, setIsActionsDropdownOpen] = useState(false)
  const [isImproveCatalogModalOpen, setIsImproveCatalogModalOpen] = useState(false)
  const [isCompleteInfoModalOpen, setIsCompleteInfoModalOpen] = useState(false)
  const [isFixErrorsModalOpen, setIsFixErrorsModalOpen] = useState(false)
  
  // Review mode states
  const [isInReviewMode, setIsInReviewMode] = useState(false)
  const [reviewModeType, setReviewModeType] = useState<'improve' | 'complete' | 'fix'>('improve')
  const [productsToReview, setProductsToReview] = useState<string[]>([])
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  
  // Product Review Modal states
  const [isProductReviewModalOpen, setIsProductReviewModalOpen] = useState(false)
  const [productToReview, setProductToReview] = useState<Product | null>(null)

  // Change History Panel states
  const [isChangeHistoryOpen, setIsChangeHistoryOpen] = useState(false)
  const [historyFilterProductId, setHistoryFilterProductId] = useState<string | null>(null)

  const totalProducts = mockProducts.length

  const handleBulkAction = (action: string) => {
    setIsActionsDropdownOpen(false)
    
    if (action === 'improve-catalog') {
      setIsImproveCatalogModalOpen(true)
    } else if (action === 'complete-info') {
      setIsCompleteInfoModalOpen(true)
    } else if (action === 'fix-errors') {
      setIsFixErrorsModalOpen(true)
    } else {
      console.log('Action:', action, 'on products:', selectedProducts)
    }
  }

  const handleImproveCatalogConfirm = (selectedOptions: string[]) => {
    console.log('Improving catalog with options:', selectedOptions, 'for products:', selectedProducts)
    setIsImproveCatalogModalOpen(false)
    
    // Enter review mode with the selected products
    setProductsToReview([...selectedProducts])
    setIsInReviewMode(true)
    setReviewModeType('improve')
    setShowSuccessToast(true)
    
    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      setShowSuccessToast(false)
    }, 5000)
  }
  
  const handleCompleteInfoConfirm = (selectedOptions: string[]) => {
    console.log('Completing info with options:', selectedOptions, 'for products:', selectedProducts)
    setIsCompleteInfoModalOpen(false)
    
    // Enter review mode with the selected products
    setProductsToReview([...selectedProducts])
    setIsInReviewMode(true)
    setReviewModeType('complete')
    setShowSuccessToast(true)
    
    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      setShowSuccessToast(false)
    }, 5000)
  }
  
  const handleFixErrorsConfirm = (selectedOptions: string[]) => {
    console.log('Fixing errors with options:', selectedOptions, 'for products:', selectedProducts)
    setIsFixErrorsModalOpen(false)
    
    // Enter review mode with the selected products
    setProductsToReview([...selectedProducts])
    setIsInReviewMode(true)
    setReviewModeType('fix')
    setShowSuccessToast(true)
    
    // Auto-hide toast after 5 seconds
    setTimeout(() => {
      setShowSuccessToast(false)
    }, 5000)
  }
  
  const handleDiscardAll = () => {
    setIsInReviewMode(false)
    setProductsToReview([])
    setSelectedProducts([])
  }
  
  const handleApplyAll = () => {
    console.log('Applying improvements to products:', productsToReview)
    setIsInReviewMode(false)
    setProductsToReview([])
    setSelectedProducts([])
  }
  
  const handleReviewProduct = (productId: string) => {
    const product = mockProducts.find(p => p.id === productId)
    if (product) {
      setProductToReview(product)
      setIsProductReviewModalOpen(true)
    }
  }
  
  const handleSaveProductReview = () => {
    if (productToReview) {
      // Remove the product from the review list
      const newProductsToReview = productsToReview.filter(id => id !== productToReview.id)
      setProductsToReview(newProductsToReview)
      
      // If no more products to review, exit review mode
      if (newProductsToReview.length === 0) {
        setIsInReviewMode(false)
        setSelectedProducts([])
      }
    }
    setIsProductReviewModalOpen(false)
    setProductToReview(null)
  }
  
  const handleDiscardProductReview = () => {
    if (productToReview) {
      // Remove the product from the review list
      const newProductsToReview = productsToReview.filter(id => id !== productToReview.id)
      setProductsToReview(newProductsToReview)
      
      // If no more products to review, exit review mode
      if (newProductsToReview.length === 0) {
        setIsInReviewMode(false)
        setSelectedProducts([])
      }
    }
    setIsProductReviewModalOpen(false)
    setProductToReview(null)
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(mockProducts.map(p => p.id))
    } else {
      setSelectedProducts([])
    }
  }

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId])
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId))
    }
  }

  const handleOpenHistory = (productId?: string) => {
    setHistoryFilterProductId(productId || null)
    setIsChangeHistoryOpen(true)
  }

  const isAllSelected = selectedProducts.length === mockProducts.length && mockProducts.length > 0
  const isSomeSelected = selectedProducts.length > 0 && selectedProducts.length < mockProducts.length

  const removeChip = (chip: string) => {
    setFilterChips(filterChips.filter(c => c !== chip))
  }

  return (
    <div className="min-h-full bg-neutral-background">
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-lg shadow-lg border border-neutral-surface">
            <div className="w-6 h-6 rounded-full bg-success-surface flex items-center justify-center">
              <CheckCircleIcon className="w-4 h-4 text-success-interactive" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-neutral-text-high">Conteúdo gerado com sucesso!</span>
              <span className="text-xs text-neutral-text-low">Revise e aprove os conteúdos gerados pela IA</span>
            </div>
            <button 
              onClick={() => setShowSuccessToast(false)}
              className="ml-4 p-1 hover:bg-neutral-surface rounded transition-colors"
            >
              <CloseIcon className="w-4 h-4 text-neutral-text-low" />
            </button>
          </div>
        </div>
      )}
      
      {/* Page Header */}
      <div className="px-6 py-4">
        {/* Title row */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <h1 className="text-[32px] font-semibold text-neutral-text-high leading-10">Produtos</h1>
          <div className="flex items-center gap-2">
            <HistoryButton onClick={() => handleOpenHistory()} />
            <Button variant="neutral">
              <ListIcon className="w-4 h-4 mr-1" />
              Organizar
            </Button>
            <Button variant="neutral">
              <DownloadIcon className="w-4 h-4 mr-1" />
              Exportar
            </Button>
            <div className="flex">
              <button
                onClick={onAddProduct}
                className="flex items-center gap-1 bg-primary-interactive text-white px-3 py-2 rounded-l-lg text-sm font-medium hover:bg-primary-interactive-hover transition-colors"
              >
                Adicionar produto
              </button>
              <button className="bg-primary-interactive text-white px-2 py-2 rounded-r-lg border-l border-primary-interactive-hover hover:bg-primary-interactive-hover transition-colors">
                <ChevronDownIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filter row */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-1">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-text-disabled" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search"
                className="w-full pl-10 pr-4 py-2 text-sm border border-neutral-interactive rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-interactive focus:border-transparent bg-white"
              />
            </div>
            <Button variant="neutral">
              <FilterIcon className="w-4 h-4 mr-1" />
              Filtrar
            </Button>
          </div>

          {/* Product count */}
          <div className="text-sm text-neutral-text-high">
            {totalProducts} produtos
          </div>

          {/* Filter chips */}
          {filterChips.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {filterChips.map((chip) => (
                <span
                  key={chip}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-neutral-surface border border-neutral-interactive rounded text-neutral-text-high"
                >
                  {chip}
                  <button onClick={() => removeChip(chip)} className="hover:text-neutral-text-high">
                    <CloseIcon className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Data Table */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-lg border border-neutral-surface-disabled overflow-hidden">
          {/* Table Header - Review Mode, Bulk Actions, or Normal state */}
          {isInReviewMode ? (
            // Review Bar
            <div className="bg-[#eef5ff] border-b border-primary-surface-highlight">
              <div className="flex items-center justify-between px-4 py-3">
                {/* Left side - Product count with feedback */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <SparklesIcon className="w-4 h-4 text-primary-interactive" />
                    <span className="text-sm font-medium text-neutral-text-high">
                      {productsToReview.length} {productsToReview.length === 1 ? 'produto' : 'produtos'} para revisar
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-neutral-text-low">
                    <span>|</span>
                    <span className="ml-1">Gostou do resultado?</span>
                    <button className="p-1 hover:bg-primary-surface rounded transition-colors">
                      <ThumbUpIcon className="w-4 h-4 text-neutral-text-low hover:text-primary-interactive" />
                    </button>
                    <button className="p-1 hover:bg-primary-surface rounded transition-colors">
                      <ThumbDownIcon className="w-4 h-4 text-neutral-text-low hover:text-danger-interactive" />
                    </button>
                  </div>
                </div>
                
                {/* Right side - Actions */}
                <div className="flex items-center gap-2">
                  <button 
                    onClick={handleDiscardAll}
                    className="px-3 py-1.5 text-sm font-medium text-neutral-text-high bg-white border border-neutral-interactive rounded-lg hover:bg-neutral-surface transition-colors"
                  >
                    Descartar todos
                  </button>
                  <button 
                    onClick={handleApplyAll}
                    className="px-3 py-1.5 text-sm font-medium text-white bg-primary-interactive rounded-lg hover:bg-primary-interactive-hover transition-colors"
                  >
                    Aplicar todos
                  </button>
                </div>
              </div>
            </div>
          ) : selectedProducts.length > 0 ? (
            // Bulk Actions Bar
            <div className="bg-neutral-surface border-b border-neutral-surface-disabled">
              <div className="flex items-center gap-4 px-2 py-2">
                {/* Checkbox with count */}
                <div className="flex items-center gap-1">
                  <div 
                    onClick={() => handleSelectAll(false)}
                    className="w-4 h-4 rounded bg-primary-interactive flex items-center justify-center cursor-pointer"
                  >
                    <CheckIcon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm text-neutral-text-high">{selectedProducts.length} selecionados</span>
                </div>

                {/* Select all link */}
                <button 
                  onClick={() => handleSelectAll(true)}
                  className="text-sm text-primary-interactive hover:underline"
                >
                  Selecionar todos ({totalProducts})
                </button>

                {/* Actions dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setIsActionsDropdownOpen(!isActionsDropdownOpen)}
                    className="flex items-center justify-between w-60 px-3 py-1.5 text-sm border border-neutral-interactive rounded-lg bg-white hover:border-neutral-text-low focus:outline-none focus:ring-2 focus:ring-primary-interactive"
                  >
                    <span className="text-neutral-text-disabled">Escolher uma ação</span>
                    <ChevronDownIcon className={`w-4 h-4 text-neutral-text-low transition-transform ${isActionsDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <BulkActionsDropdown 
                    isOpen={isActionsDropdownOpen}
                    onClose={() => setIsActionsDropdownOpen(false)}
                    onAction={handleBulkAction}
                  />
                </div>
              </div>
            </div>
          ) : null}

          {/* Responsive wrapper */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              {/* Normal Table Header - only show when not in review or bulk mode */}
              {!isInReviewMode && selectedProducts.length === 0 && (
                <thead>
                  <tr className="bg-neutral-surface border-b border-neutral-surface-disabled">
                    <th className="w-10 px-2 py-2.5 text-left">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          ref={(el) => {
                            if (el) el.indeterminate = isSomeSelected
                          }}
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          className="w-4 h-4 rounded border-neutral-interactive text-primary-interactive focus:ring-primary-interactive"
                        />
                      </div>
                    </th>
                    <th className="px-3 py-2.5 text-left">
                      <span className="text-xs font-medium text-neutral-text-high">Produto</span>
                    </th>
                    <th className="w-[100px] px-3 py-2.5 text-left">
                      <span className="text-xs font-medium text-neutral-text-high">Estoque</span>
                    </th>
                    <th className="w-[110px] px-3 py-2.5 text-left">
                      <span className="text-xs font-medium text-neutral-text-high">Preço</span>
                    </th>
                    <th className="w-[110px] px-3 py-2.5 text-left">
                      <span className="text-xs font-medium text-neutral-text-high">Promocional</span>
                    </th>
                    <th className="w-[130px] px-3 py-2.5 text-left">
                      <span className="text-xs font-medium text-neutral-text-high">Variantes</span>
                    </th>
                    <th className="w-[150px] px-3 py-2.5 text-left">
                      <span className="text-xs font-medium text-neutral-text-high">Ações</span>
                    </th>
                  </tr>
                </thead>
              )}

              {/* Table Body */}
              <tbody className="divide-y divide-neutral-surface-disabled">
                {mockProducts.map((product) => (
                  <ProductRow
                    key={product.id}
                    product={product}
                    selected={selectedProducts.includes(product.id)}
                    onSelect={(checked) => handleSelectProduct(product.id, checked)}
                    isReviewMode={isInReviewMode && productsToReview.includes(product.id)}
                    onReview={() => handleReviewProduct(product.id)}
                    onHistory={() => handleOpenHistory(product.id)}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-surface-disabled">
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-text-low">Itens por página:</span>
              <select className="px-2 py-1 text-sm border border-neutral-interactive rounded bg-white focus:outline-none focus:ring-2 focus:ring-primary-interactive">
                <option>20</option>
                <option>50</option>
                <option>100</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-neutral-text-low">1-{mockProducts.length} de {mockProducts.length}</span>
              <div className="flex gap-1">
                <button className="p-1.5 rounded-md hover:bg-neutral-surface disabled:opacity-50" disabled>
                  <svg className="w-4 h-4 text-neutral-text-low" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M10 12l-4-4 4-4" />
                  </svg>
                </button>
                <button className="p-1.5 rounded-md hover:bg-neutral-surface disabled:opacity-50" disabled>
                  <svg className="w-4 h-4 text-neutral-text-low" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M6 4l4 4-4 4" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Improve Catalog Modal */}
      <ImproveCatalogModal
        isOpen={isImproveCatalogModalOpen}
        onClose={() => setIsImproveCatalogModalOpen(false)}
        onConfirm={handleImproveCatalogConfirm}
        selectedProductsCount={selectedProducts.length}
      />
      
      {/* Complete Info Modal */}
      <CompleteInfoModal
        isOpen={isCompleteInfoModalOpen}
        onClose={() => setIsCompleteInfoModalOpen(false)}
        onConfirm={handleCompleteInfoConfirm}
        selectedProductsCount={selectedProducts.length}
      />
      
      {/* Fix Errors Modal */}
      <FixErrorsModal
        isOpen={isFixErrorsModalOpen}
        onClose={() => setIsFixErrorsModalOpen(false)}
        onConfirm={handleFixErrorsConfirm}
        selectedProductsCount={selectedProducts.length}
      />
      
      {/* Product Review Modal */}
      <ProductReviewModal
        isOpen={isProductReviewModalOpen}
        onClose={() => {
          setIsProductReviewModalOpen(false)
          setProductToReview(null)
        }}
        onSave={handleSaveProductReview}
        onDiscard={handleDiscardProductReview}
        product={productToReview}
        reviewType={reviewModeType}
      />

      {/* Change History Panel */}
      <ChangeHistoryPanel
        isOpen={isChangeHistoryOpen}
        onClose={() => {
          setIsChangeHistoryOpen(false)
          setHistoryFilterProductId(null)
        }}
        entries={productChangeHistory}
        filterEntityId={historyFilterProductId}
        filterEntityName={historyFilterProductId ? mockProducts.find(p => p.id === historyFilterProductId)?.name : null}
        filters={productHistoryFilters}
      />
    </div>
  )
}

// Product Row Component
interface ProductRowProps {
  product: Product
  selected: boolean
  onSelect: (checked: boolean) => void
  isReviewMode?: boolean
  onReview?: () => void
  onHistory?: () => void
}

function ProductRow({ product, selected, onSelect, isReviewMode, onReview, onHistory }: ProductRowProps) {
  const [price, setPrice] = useState(product.price.toString())
  const [promotionalPrice, setPromotionalPrice] = useState(product.promotionalPrice?.toString() || '')

  return (
    <>
      {/* Main product row */}
      <tr className={`transition-colors ${
        isReviewMode ? 'bg-primary-surface' : 
        selected ? 'bg-primary-surface' : 
        'hover:bg-neutral-surface/50'
      }`}>
        {/* Checkbox */}
        <td className="w-10 px-2 py-3">
          <div className="flex items-center justify-center">
            {selected ? (
              <div 
                onClick={() => onSelect(false)}
                className="w-4 h-4 rounded bg-primary-interactive flex items-center justify-center cursor-pointer"
              >
                <CheckIcon className="w-3 h-3 text-white" />
              </div>
            ) : (
              <input
                type="checkbox"
                checked={selected}
                onChange={(e) => onSelect(e.target.checked)}
                className="w-4 h-4 rounded border-neutral-interactive text-primary-interactive focus:ring-primary-interactive"
              />
            )}
          </div>
        </td>

        {/* Product info */}
        <td className="px-3 py-3">
          <div className="flex items-center gap-3">
            {/* Thumbnail */}
            <div className="w-14 h-14 bg-neutral-surface rounded-lg flex items-center justify-center overflow-hidden shrink-0">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <CameraIcon className="w-8 h-8 text-neutral-text-disabled" />
              )}
            </div>

            {/* Product details */}
            <div className="flex flex-col gap-1.5 min-w-0">
              <div className="flex flex-col gap-1">
                <a href="#" className="text-sm text-primary-interactive hover:underline truncate max-w-[250px]">
                  {product.name}
                </a>
                {product.status === 'hidden' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-warning-surface border border-warning-surface-highlight text-warning-text-low rounded-full w-fit">
                    <EyeOffIcon className="w-3 h-3" />
                    Oculto
                  </span>
                )}
              </div>

              {/* Tags */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {product.tags.slice(0, 4).map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-0.5 text-xs bg-neutral-surface border border-neutral-surface-highlight text-neutral-text-low rounded-full"
                  >
                    {tag}
                  </span>
                ))}
                {product.tags.length > 4 && (
                  <span className="text-xs text-neutral-text-low">+{product.tags.length - 4}</span>
                )}
              </div>
            </div>
          </div>
        </td>

        {/* Stock */}
        <td className="w-[100px] px-3 py-3">
          <span className="text-sm text-neutral-text-low whitespace-nowrap">
            {product.stock === 'infinite' ? '∞ Infinito' : `${product.stock} unid.`}
          </span>
        </td>

        {/* Price */}
        <td className="w-[110px] px-3 py-3">
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-neutral-text-disabled">R$</span>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full pl-8 pr-2 py-1.5 text-sm border border-neutral-surface-highlight rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-interactive bg-white"
              placeholder="0"
            />
          </div>
        </td>

        {/* Promotional Price */}
        <td className="w-[110px] px-3 py-3">
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-neutral-text-disabled">R$</span>
            <input
              type="text"
              value={promotionalPrice}
              onChange={(e) => setPromotionalPrice(e.target.value)}
              className="w-full pl-8 pr-2 py-1.5 text-sm border border-neutral-surface-highlight rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-interactive bg-white"
              placeholder="0"
            />
          </div>
        </td>

        {/* Variants */}
        <td className="w-[130px] px-3 py-3">
          {/* Empty for main row, variants shown in sub-rows */}
        </td>

        {/* Actions */}
        <td className="w-[150px] px-3 py-3">
          {isReviewMode ? (
            <button 
              onClick={onReview}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-primary-interactive bg-primary-surface border border-primary-surface-highlight rounded-lg hover:bg-primary-surface-highlight transition-colors"
            >
              Revisar
              <SparklesIcon className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <HistoryRowButton onClick={onHistory || (() => {})} />
              <button className="p-1.5 rounded-md hover:bg-neutral-surface-disabled text-neutral-text-low transition-colors">
                <ShareIcon className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-md hover:bg-neutral-surface-disabled text-neutral-text-low transition-colors">
                <CopyIcon className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-md hover:bg-neutral-surface-disabled text-neutral-text-low transition-colors">
                <TrashIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </td>
      </tr>

      {/* Variant rows */}
      {product.variants?.map((variant, index) => (
        <tr key={index} className="bg-neutral-surface/30 border-t border-neutral-surface-disabled">
          {/* Checkbox spacer */}
          <td className="w-10 px-2 py-2" />

          {/* Empty product cell with indent */}
          <td className="px-3 py-2 pl-24" />

          {/* Stock */}
          <td className="w-[100px] px-3 py-2">
            <span className="text-sm text-neutral-text-low whitespace-nowrap">
              {variant.stock === 'infinite' ? '∞ Infinito' : `${variant.stock} unid.`}
            </span>
          </td>

          {/* Price */}
          <td className="w-[110px] px-3 py-2">
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-neutral-text-disabled">R$</span>
              <input
                type="text"
                defaultValue="0"
                className="w-full pl-8 pr-2 py-1.5 text-sm border border-neutral-surface-highlight rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-interactive bg-white"
                placeholder="0"
              />
            </div>
          </td>

          {/* Promotional Price */}
          <td className="w-[110px] px-3 py-2">
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-neutral-text-disabled">R$</span>
              <input
                type="text"
                defaultValue=""
                className="w-full pl-8 pr-2 py-1.5 text-sm border border-neutral-surface-highlight rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-interactive bg-white"
                placeholder="0"
              />
            </div>
          </td>

          {/* Variant name */}
          <td className="w-[130px] px-3 py-2">
            <span className="text-sm text-neutral-text-low truncate block">{variant.name}</span>
          </td>

          {/* Empty actions */}
          <td className="w-[150px] px-3 py-2" />
        </tr>
      ))}
    </>
  )
}

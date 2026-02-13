/**
 * Icon wrappers around @nimbus-ds/icons.
 * Each wrapper maps the legacy { className } API to the Nimbus icon component,
 * keeping existing call-sites untouched.
 *
 * Brand-specific icons (NuvemshopLogo, LumiIcon) are kept as custom SVGs.
 */

import {
  HomeIcon as NimbusHomeIcon,
  StatsIcon as NimbusStatsIcon,
  ShoppingCartIcon as NimbusShoppingCartIcon,
  TagIcon as NimbusTagIcon,
  CashIcon as NimbusCashIcon,
  TruckIcon as NimbusTruckIcon,
  ChatDotsIcon as NimbusChatDotsIcon,
  UserGroupIcon as NimbusUserGroupIcon,
  DiscountCircleIcon as NimbusDiscountCircleIcon,
  StickyNoteIcon as NimbusStickyNoteIcon,
  OnlineStoreIcon as NimbusOnlineStoreIcon,
  CogIcon as NimbusCogIcon,
  SearchIcon as NimbusSearchIcon,
  NotificationIcon as NimbusNotificationIcon,
  QuestionCircleIcon as NimbusQuestionCircleIcon,
  ChevronDownIcon as NimbusChevronDownIcon,
  CheckIcon as NimbusCheckIcon,
  ExternalLinkIcon as NimbusExternalLinkIcon,
  PlusIcon as NimbusPlusIcon,
  DownloadIcon as NimbusDownloadIcon,
  SlidersIcon as NimbusSlidersIcon,
  GenerativeStarsIcon as NimbusGenerativeStarsIcon,
  PaperPlaneIcon as NimbusPaperPlaneIcon,
  CloseIcon as NimbusCloseIcon,
  PencilIcon as NimbusPencilIcon,
  ThumbsUpIcon as NimbusThumbsUpIcon,
  ThumbsDownIcon as NimbusThumbsDownIcon,
  CopyIcon as NimbusCopyIcon,
  EllipsisIcon as NimbusEllipsisIcon,
  RedoIcon as NimbusRedoIcon,
  AppsIcon as NimbusAppsIcon,
  TiendanubeIcon as NimbusTiendanubeIcon,
  ArrowupIcon as NimbusArrowupIcon,
  HistoryIcon as NimbusHistoryIcon,
  ChevronRightIcon as NimbusChevronRightIcon,
  InfoCircleIcon as NimbusInfoCircleIcon,
  CheckCircleIcon as NimbusCheckCircleIcon,
  ExclamationTriangleIcon as NimbusExclamationTriangleIcon,
  BoxPackedIcon as NimbusBoxPackedIcon,
  BoxUnpackedIcon as NimbusBoxUnpackedIcon,
  EyeIcon as NimbusEyeIcon,
  MoneyIcon as NimbusMoneyIcon,
  ArrowRightIcon as NimbusArrowRightIcon,
  ChevronLeftIcon as NimbusChevronLeftIcon,
  UserIcon as NimbusUserIcon,
  RepeatIcon as NimbusRepeatIcon,
  // v1.17.0 new icons
  ArrowsDiagonalOutIcon as NimbusArrowsDiagonalOutIcon,
  ArrowsDiagonalInIcon as NimbusArrowsDiagonalInIcon,
  GenerativePencilIcon as NimbusGenerativePencilIcon,
  ExclamationCircleIcon as NimbusExclamationCircleIcon,
  UndoIcon as NimbusUndoIcon,
} from '@nimbus-ds/icons'


interface IconProps {
  className?: string
}

export function HomeIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusHomeIcon className={className} />
}

export function StatsIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusStatsIcon className={className} />
}

export function CartIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusShoppingCartIcon className={className} />
}

export function TagIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusTagIcon className={className} />
}

export function CashIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusCashIcon className={className} />
}

export function TruckIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusTruckIcon className={className} />
}

export function ChatIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusChatDotsIcon className={className} />
}

export function UsersIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusUserGroupIcon className={className} />
}

export function DiscountIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusDiscountCircleIcon className={className} />
}

export function NewsIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusStickyNoteIcon className={className} />
}

export function StoreIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusOnlineStoreIcon className={className} />
}

export function CogIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusCogIcon className={className} />
}

export function SearchIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusSearchIcon className={className} />
}

export function BellIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusNotificationIcon className={className} />
}

export function HelpIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusQuestionCircleIcon className={className} />
}

export function ChevronDownIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusChevronDownIcon className={className} />
}

export function CheckIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusCheckIcon className={className} />
}

export function ExternalLinkIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusExternalLinkIcon className={className} />
}

export function PlusIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusPlusIcon className={className} />
}

export function DownloadIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusDownloadIcon className={className} />
}

export function FilterIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusSlidersIcon className={className} />
}

export function SparklesIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusGenerativeStarsIcon className={className} />
}

export function SendIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusPaperPlaneIcon className={className} />
}

export function CloseIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusCloseIcon className={className} />
}

export function EditIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusPencilIcon className={className} />
}

export function ThumbUpIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusThumbsUpIcon className={className} />
}

export function ThumbDownIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusThumbsDownIcon className={className} />
}

export function CopyIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusCopyIcon className={className} />
}

export function MoreVerticalIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusEllipsisIcon className={className} />
}

export function RefreshIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusRedoIcon className={className} />
}

export function AppsIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusAppsIcon className={className} />
}

export function ArrowUpIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusArrowupIcon className={className} />
}

export function HistoryIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusHistoryIcon className={className} />
}

export function ChevronRightIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusChevronRightIcon className={className} />
}

export function InfoCircleIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusInfoCircleIcon className={className} />
}

export function CheckCircleIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusCheckCircleIcon className={className} />
}

export function ExclamationTriangleIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusExclamationTriangleIcon className={className} />
}

export function BoxPackedIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusBoxPackedIcon className={className} />
}

export function BoxUnpackedIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusBoxUnpackedIcon className={className} />
}

export function EyeIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusEyeIcon className={className} />
}

export function MoneyIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusMoneyIcon className={className} />
}

export function ArrowsDiagonalOutIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusArrowsDiagonalOutIcon className={className} />
}

export function ArrowsDiagonalInIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusArrowsDiagonalInIcon className={className} />
}

export function GenerativePencilIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusGenerativePencilIcon className={className} />
}

export function ExclamationCircleIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusExclamationCircleIcon className={className} />
}

export function UndoIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusUndoIcon className={className} />
}

export function ArrowRightIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusArrowRightIcon className={className} />
}

export function ChevronLeftIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusChevronLeftIcon className={className} />
}

export function UserIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusUserIcon className={className} />
}

export function RepeatIcon({ className = 'w-4 h-4' }: IconProps) {
  return <NimbusRepeatIcon className={className} />
}

// ─── Brand-specific icons (custom SVGs with gradients) ────────────────

export function NuvemshopLogo({ className = 'w-7 h-5' }: IconProps) {
  return <NimbusTiendanubeIcon className={className} />
}

export function LumiIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none">
      <path
        d="M8 1l1.5 4.5L14 6l-4.5 1.5L8 12l-1.5-4.5L2 6l4.5-.5L8 1z"
        fill="url(#lumi-gradient)"
      />
      <path
        d="M3 12l.5 1.5L5 14l-1.5.5L3 16l-.5-1.5L1 14l1.5-.5L3 12z"
        fill="url(#lumi-gradient)"
      />
      <path
        d="M12 10l.5 1L14 11.5l-1.5.5-.5 1-.5-1.5L10 11l1.5-.5.5-1z"
        fill="url(#lumi-gradient)"
      />
      <defs>
        <linearGradient id="lumi-gradient" x1="1" y1="1" x2="14" y2="16" gradientUnits="userSpaceOnUse">
          <stop stopColor="#667eea" />
          <stop offset="1" stopColor="#764ba2" />
        </linearGradient>
      </defs>
    </svg>
  )
}

import { Button, IconButton } from '../UI'
import { BellIcon, HelpIcon, SparklesIcon } from '../Icons'

interface HeaderProps {
  onLumiClick?: () => void
  lumiActive?: boolean
}

export function Header({ onLumiClick, lumiActive }: HeaderProps) {
  return (
    <header className="h-12 bg-neutral-surface border-b border-neutral-surface-disabled flex items-center justify-end px-2 gap-2">
      {/* Lumi AI Button */}
      <Button
        variant="ai"
        size="medium"
        leftIcon={<SparklesIcon className="w-4 h-4" />}
        onClick={onLumiClick}
        className={lumiActive ? 'bg-primary-surface' : ''}
      >
        Lumi
      </Button>

      {/* Notification button */}
      <IconButton
        icon={<BellIcon className="w-4 h-4" />}
        aria-label="Notificações"
        variant="ghost"
      />

      {/* Help button */}
      <IconButton
        icon={<HelpIcon className="w-4 h-4" />}
        aria-label="Ajuda"
        variant="ghost"
      />

      {/* Store avatar */}
      <div className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-neutral-surface-disabled cursor-pointer">
        <div className="w-6 h-6 rounded-full bg-primary-surface flex items-center justify-center">
          <span className="text-xs font-medium text-primary-interactive">N</span>
        </div>
        <span className="text-sm text-neutral-text-high">Nome da loja</span>
      </div>
    </header>
  )
}

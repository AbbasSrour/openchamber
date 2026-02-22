import React from 'react';
import { RiSubtractLine, RiCheckboxLine, RiCloseLine } from '@remixicon/react';
import {
  desktopWindowMinimize,
  desktopWindowToggleMaximize,
  desktopWindowClose,
  desktopWindowIsMaximized,
  isCustomTitleBar,
  isTauriShell,
} from '@/lib/desktop';
import { cn } from '@/lib/utils';

const TITLE_BAR_HEIGHT = 32;

type WindowControlButtonProps = {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  title: string;
};

const WindowControlButton: React.FC<WindowControlButtonProps> = ({
  onClick,
  children,
  className,
  title,
}) => (
  <button
    onClick={onClick}
    title={title}
    className={cn(
      'flex items-center justify-center w-11 h-full transition-colors',
      'hover:bg-[var(--interactive-hover)] active:bg-[var(--interactive-selection)]',
      'text-[var(--surface-mutedForeground)] hover:text-[var(--surface-foreground)]',
      className
    )}
  >
    {children}
  </button>
);

export const DesktopTitleBar: React.FC = () => {
  const [isMaximized, setIsMaximized] = React.useState(false);
  const shouldRender = React.useMemo(() => isCustomTitleBar() && isTauriShell(), []);

  React.useEffect(() => {
    if (!shouldRender) return;

    const checkMaximized = async () => {
      const maximized = await desktopWindowIsMaximized();
      setIsMaximized(maximized);
    };

    checkMaximized();

    const handleResize = () => {
      void checkMaximized();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [shouldRender]);

  const handleMinimize = React.useCallback(() => {
    void desktopWindowMinimize();
  }, []);

  const handleToggleMaximize = React.useCallback(() => {
    void desktopWindowToggleMaximize();
    setIsMaximized((prev) => !prev);
  }, []);

  const handleClose = React.useCallback(() => {
    void desktopWindowClose();
  }, []);

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      data-tauri-drag-region
      className={cn(
        'flex items-center justify-between select-none shrink-0',
        'bg-[var(--surface-background)] border-b border-[var(--surface-subtle)]',
        'text-[var(--surface-foreground)] text-xs font-medium'
      )}
      style={{ height: TITLE_BAR_HEIGHT }}
    >
      <div
        data-tauri-drag-region
        className="flex-1 flex items-center px-3"
      >
        <span data-tauri-drag-region className="opacity-70">
          OpenChamber
        </span>
      </div>

      <div className="flex items-center h-full">
        <WindowControlButton onClick={handleMinimize} title="Minimize">
          <RiSubtractLine size={16} />
        </WindowControlButton>

        <WindowControlButton onClick={handleToggleMaximize} title={isMaximized ? 'Restore' : 'Maximize'}>
          {isMaximized ? (
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect
                x="2"
                y="4"
                width="6"
                height="6"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="none"
              />
              <path
                d="M4 4V2H10V8H8"
                stroke="currentColor"
                strokeWidth="1.2"
                fill="none"
              />
            </svg>
          ) : (
            <RiCheckboxLine size={16} />
          )}
        </WindowControlButton>

        <WindowControlButton
          onClick={handleClose}
          title="Close"
          className="hover:!bg-[var(--status-error)] hover:!text-white"
        >
          <RiCloseLine size={16} />
        </WindowControlButton>
      </div>
    </div>
  );
};

export const DESKTOP_TITLE_BAR_HEIGHT = TITLE_BAR_HEIGHT;

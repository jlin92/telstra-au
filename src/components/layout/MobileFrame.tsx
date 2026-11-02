import type { ReactNode } from 'react';
import { cn } from '@/hooks/utils';
import { Icon } from '@/components/ui/Icon';

interface MobileFrameProps {
  children: ReactNode;
  className?: string;
  /** Status bar colour scheme — light text over the blue Telstra header. */
  light?: boolean;
}

/** iPhone-style status bar: clock, cellular, wi-fi and battery. */
function StatusBar({ light }: { light?: boolean }) {
  return (
    <div
      className={cn(
        'relative z-40 flex h-12 shrink-0 items-center justify-between px-7 pt-2',
        light ? 'text-white' : 'text-on-surface',
      )}
    >
      <span className="font-heading text-sm font-semibold tracking-tight">9:41</span>
      <div className="flex items-center gap-1.5">
        <Icon name="signal_cellular_alt" filled className="text-[17px]" />
        <Icon name="wifi" filled className="text-[17px]" />
        <Icon name="battery_full" filled className="text-[19px] rotate-90" />
      </div>
    </div>
  );
}

/**
 * Renders an iPhone-style phone frame with a dynamic island, status bar and
 * home indicator. Children flow below the status bar; drawers/modals are
 * contained within the device viewport.
 */
export function MobileFrame({ children, className, light }: MobileFrameProps) {
  return (
    <div className={cn('relative mx-auto w-full max-w-[420px] select-none', className)}>
      <div className="relative rounded-[46px] bg-[#e9e9e9] p-[10px] shadow-frame">
        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[38px] bg-surface">
          <div className="pointer-events-none absolute left-1/2 top-2 z-50 h-7 w-28 -translate-x-1/2 rounded-full bg-black" />
          <div className="relative flex h-full flex-col">
            <div className={cn(light && 'telstra-header')}>
              <StatusBar light={light} />
            </div>
            {children}
          </div>
          <div className="pointer-events-none absolute bottom-1.5 left-1/2 z-50 h-1 w-28 -translate-x-1/2 rounded-full bg-black/70" />
        </div>
      </div>
    </div>
  );
}

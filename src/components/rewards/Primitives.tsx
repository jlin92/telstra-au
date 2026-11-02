import type { ReactNode } from 'react';
import { useDemo } from '@/app/DemoContext';
import type { Tier } from '@/types';
import { Icon } from '@/components/ui/Icon';
import { cn, formatPoints } from '@/hooks/utils';

const tierStyle: Record<Tier, { line: string; icon: string; text: string }> = {
  Member: { line: 'tier-line-member', icon: 'loyalty', text: 'text-primary' },
  Silver: { line: 'tier-line-silver', icon: 'workspace_premium', text: 'text-telstra-silver' },
  Gold: { line: 'tier-line-gold', icon: 'workspace_premium', text: 'text-telstra-gold' },
};

/**
 * The white Telstra Plus tier card from the My Telstra home screen:
 * "★ Gold · 208,090 pts >" with an "Updated just now" caption and a coloured
 * bottom edge for the tier.
 */
export function TierCard({ onClick, className }: { onClick?: () => void; className?: string }) {
  const { appUserProfile, points } = useDemo();
  const style = tierStyle[appUserProfile.tier];
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full flex-col rounded-md bg-white px-4 pb-4 pt-3 text-left shadow-card',
        style.line,
        className,
      )}
    >
      <span className="flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Icon name={style.icon} filled className={cn('text-[20px]', style.text)} />
          <span className="font-heading text-base font-bold text-on-surface">{appUserProfile.tier}</span>
        </span>
        <span className="flex items-center gap-1">
          <span className="font-heading text-base font-semibold text-on-surface">{formatPoints(points)} pts</span>
          <Icon name="chevron_right" className="text-[20px] text-on-surface" />
        </span>
      </span>
      <span className="mt-1 text-xs text-on-surface-variant">Updated just now</span>
    </button>
  );
}

/** Flat white list row with a leading icon, title/subtitle and trailing chevron (My Telstra list style). */
export function ListRow({
  icon,
  title,
  subtitle,
  trailing,
  onClick,
  tag,
  divider = true,
}: {
  icon?: string;
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  onClick?: () => void;
  tag?: string;
  divider?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 bg-white px-4 py-3.5 text-left',
        divider && 'border-b border-surface-container-high last:border-b-0',
      )}
    >
      {icon && (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center text-primary">
          <Icon name={icon} className="text-[28px]" />
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="text-[15px] font-semibold text-on-surface">{title}</span>
          {tag && (
            <span className="rounded-sm bg-telstra-gold-soft px-1.5 py-0.5 text-[10px] font-bold text-telstra-gold">{tag}</span>
          )}
        </span>
        {subtitle && <span className="mt-0.5 block text-[13px] leading-snug text-on-surface-variant">{subtitle}</span>}
      </span>
      {trailing ?? <Icon name="chevron_right" className="text-[22px] text-on-surface" />}
    </button>
  );
}

/** Section heading with optional "View all" link, as used throughout My Telstra. */
export function SectionHeader({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-heading text-[17px] font-bold text-on-surface">{title}</h2>
      {action && (
        <button type="button" onClick={onAction} className="flex items-center text-sm font-semibold text-primary">
          {action}
          <Icon name="chevron_right" className="text-[18px]" />
        </button>
      )}
    </div>
  );
}

/** Blue segmented pill control from the Shop screen ("Explore | For you"). */
export function SegmentedPills<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-full bg-surface-container-high p-1">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={cn(
            'flex-1 rounded-full py-2 text-[13px] font-semibold transition-colors',
            o.id === value ? 'border border-primary bg-white text-primary' : 'text-on-surface-variant',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

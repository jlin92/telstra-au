import { motion } from 'framer-motion';
import type { Product } from '@/types';
import { useDemo } from '@/app/DemoContext';
import { pointsPlusPay } from '@/mock-data/products';
import { Icon } from '@/components/ui/Icon';
import { cn, formatAud, formatPoints } from '@/hooks/utils';

interface RewardCardProps {
  product: Product;
  index?: number;
  /** Personalisation reason shown beneath the title (assistant / picks). */
  reason?: string;
  /** Compact horizontal layout for carousels and assistant results. */
  variant?: 'tile' | 'row';
}

/** A Rewards Store product card in the My Telstra visual style (white, square-ish, flat). */
export function RewardCard({ product, index = 0, reason, variant = 'tile' }: RewardCardProps) {
  const { openDetail, points } = useDemo();
  const within = product.points <= points;
  const ppp = pointsPlusPay(product, points);

  if (variant === 'row') {
    return (
      <motion.button
        type="button"
        onClick={() => openDetail(product)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 * index, duration: 0.3 }}
        className="flex w-full items-center gap-3 rounded-lg bg-white p-3 text-left shadow-card transition-transform active:scale-[0.99]"
      >
        <span className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white">
          <img src={product.image} alt="" className="h-14 w-14 object-contain" loading="lazy" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[11px] uppercase tracking-wide text-on-surface-variant">{product.brand}</span>
          <span className="line-clamp-2 text-sm font-semibold leading-snug text-on-surface">{product.name}</span>
          <span className="mt-1 flex items-center gap-2">
            <span className="font-heading text-sm font-bold text-on-surface">{formatPoints(product.points)} pts</span>
            <AvailabilityPill within={within} pppEligible={ppp.eligible} />
          </span>
          {reason && (
            <span className="mt-1 flex items-center gap-1 text-[11px] text-primary">
              <Icon name="auto_awesome" className="text-[13px]" />
              <span className="font-medium">{reason}</span>
            </span>
          )}
        </span>
        <Icon name="chevron_right" className="text-on-surface-variant" />
      </motion.button>
    );
  }

  return (
    <motion.button
      type="button"
      onClick={() => openDetail(product)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.3 }}
      className="flex w-full flex-col overflow-hidden rounded-lg bg-white text-left shadow-card transition-transform active:scale-[0.99]"
    >
      <span className="flex aspect-square w-full items-center justify-center bg-white p-4">
        <img src={product.image} alt="" className="h-full w-full object-contain" loading="lazy" />
      </span>
      <span className="flex flex-1 flex-col px-3 pb-3">
        <span className="truncate text-[10px] uppercase tracking-wide text-on-surface-variant">{product.brand}</span>
        <span className="line-clamp-2 min-h-[2.4em] text-[13px] font-semibold leading-snug text-on-surface">{product.name}</span>
        <span className="mt-1.5 font-heading text-sm font-bold text-on-surface">{formatPoints(product.points)} pts</span>
        {!within && ppp.eligible && (
          <span className="text-[11px] text-on-surface-variant">
            or {formatPoints(ppp.points)} pts + {formatAud(ppp.cash)}
          </span>
        )}
        <span className="mt-1.5">
          <AvailabilityPill within={within} pppEligible={ppp.eligible} />
        </span>
        {reason && (
          <span className="mt-1.5 flex items-start gap-1 text-[11px] leading-snug text-primary">
            <Icon name="auto_awesome" className="mt-px text-[13px]" />
            <span className="font-medium">{reason}</span>
          </span>
        )}
      </span>
    </motion.button>
  );
}

export function AvailabilityPill({ within, pppEligible }: { within: boolean; pppEligible: boolean }) {
  if (within)
    return (
      <span className="inline-flex items-center gap-1 rounded-sm bg-[#e8f3e8] px-1.5 py-0.5 text-[10px] font-semibold text-success">
        <Icon name="check" className="text-[12px]" />
        Within your points
      </span>
    );
  if (pppEligible)
    return (
      <span className="inline-flex items-center gap-1 rounded-sm bg-primary-fixed px-1.5 py-0.5 text-[10px] font-semibold text-primary">
        <Icon name="add" className="text-[12px]" />
        Points + Pay
      </span>
    );
  return (
    <span className={cn('inline-flex items-center rounded-sm bg-surface-container px-1.5 py-0.5 text-[10px] font-semibold text-on-surface-variant')}>
      Keep earning
    </span>
  );
}

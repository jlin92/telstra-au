import { useEffect, useMemo, useState } from 'react';
import type { Product } from '@/types';
import { Icon } from '@/components/ui/Icon';
import { cn, formatAud, formatPoints } from '@/hooks/utils';

export type PayChoice = 'pointsPlusPay' | 'card';

interface Props {
  product: Product;
  /** Points available to put toward this reward (balance minus other bag allocations). */
  available: number;
  onConfirm: (pointsToUse: number) => void;
}

/** Points step for the slider — keeps the thumb snappy on a small screen. */
const STEP = 100;

/**
 * "Use your Telstra Plus points" panel: a slider sets how many points to apply
 * (0 … min(balance, reward price)), the rest is paid by card. Members can also
 * keep their points and pay by card, earning 10 pts per $1.
 */
export function PointsPanel({ product, available, onConfirm }: Props) {
  const cashOnly = product.dollars == null; // gift cards / digital codes: points only
  const max = Math.min(available, product.points);
  const [pts, setPts] = useState(max);
  const [choice, setChoice] = useState<PayChoice>('pointsPlusPay');

  useEffect(() => {
    setPts(max);
    setChoice('pointsPlusPay');
  }, [product.id, max]);

  const split = useMemo(() => {
    const ratio = product.points ? pts / product.points : 1;
    const cash = product.dollars ? Math.round(product.dollars * (1 - ratio) * 100) / 100 : 0;
    return { pts, cash, earn: Math.floor(cash * 10) };
  }, [pts, product]);

  const fullyCovered = max >= product.points;
  const canRedeem = cashOnly ? fullyCovered : choice === 'card' || pts > 0 || split.cash > 0;

  const step = (delta: number) => setPts((v) => Math.min(max, Math.max(0, Math.round((v + delta) / STEP) * STEP)));

  return (
    <section className="rounded-md bg-white p-4 shadow-card">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
          <Icon name="database" className="text-[22px]" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-heading text-[15px] font-bold leading-tight text-on-surface">Use your Telstra Plus points</p>
          <p className="mt-0.5 text-[12px] text-on-surface-variant">
            {cashOnly ? 'This reward is redeemed with points only.' : 'Choose how many points to use for this reward.'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-on-surface-variant">Your balance</p>
          <p className="font-heading text-[15px] font-bold text-primary">{formatPoints(available)} pts</p>
        </div>
      </div>

      {cashOnly ? (
        <div className="mt-4 rounded-md border border-outline-variant px-3 py-3">
          <p className="font-heading text-[18px] font-bold text-on-surface">{formatPoints(product.points)} pts</p>
          <p className="text-[12px] text-on-surface-variant">
            {fullyCovered ? 'Fully covered by your points · nothing to pay' : `${formatPoints(product.points - available)} more pts needed`}
          </p>
        </div>
      ) : (
        <>
          {/* Slider */}
          <div className={cn('mt-4 transition-opacity', choice === 'card' && 'pointer-events-none opacity-40')}>
            <p className="text-center font-heading text-[18px] font-bold text-on-surface">
              {formatPoints(split.pts)} pts + {formatAud(split.cash)}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <button type="button" aria-label="Use fewer points" onClick={() => step(-STEP * 5)} className="flex h-8 w-8 items-center justify-center text-primary">
                <Icon name="remove" className="text-[22px]" />
              </button>
              <input
                type="range"
                min={0}
                max={max}
                step={STEP}
                value={pts}
                onChange={(e) => setPts(Number(e.target.value))}
                aria-label="Points to use"
                className="points-slider flex-1"
                style={{ ['--pct' as string]: `${max ? (pts / max) * 100 : 0}%` }}
              />
              <button type="button" aria-label="Use more points" onClick={() => step(STEP * 5)} className="flex h-8 w-8 items-center justify-center text-primary">
                <Icon name="add" className="text-[22px]" />
              </button>
            </div>
            <div className="mt-2 grid grid-cols-[1fr_auto_1fr] items-center gap-2">
              <div className="rounded-md border border-outline-variant px-3 py-2">
                <p className="font-heading text-[16px] font-bold text-primary">{formatPoints(split.pts)} pts</p>
                <p className="text-[11px] text-on-surface-variant">Points to use</p>
              </div>
              <Icon name="add" className="text-[18px] text-on-surface" />
              <div className="rounded-md border border-outline-variant px-3 py-2">
                <p className="font-heading text-[16px] font-bold text-primary">{formatAud(split.cash)}</p>
                <p className="text-[11px] text-on-surface-variant">Pay the rest by card</p>
              </div>
            </div>
            {!fullyCovered && (
              <p className="mt-2 text-[11px] text-on-surface-variant">
                Minimum is 0 pts + {formatAud(product.dollars ?? 0)}. You’re {formatPoints(product.points - available)} pts short of the full reward.
              </p>
            )}
          </div>

          {/* Choice */}
          <div className="mt-4 flex flex-col gap-2">
            <Choice
              active={choice === 'pointsPlusPay'}
              onClick={() => setChoice('pointsPlusPay')}
              icon="add_card"
              title="Points + Pay"
              body={split.cash > 0 ? 'Use your points and pay the rest by card.' : 'Fully covered by your points — nothing to pay.'}
              badge="Recommended"
            />
            <Choice
              active={choice === 'card'}
              onClick={() => setChoice('card')}
              icon="credit_card"
              title="Pay by card"
              body={
                <>
                  Keep your points and pay {formatAud(product.dollars ?? 0)}. You’ll also earn{' '}
                  <b className="text-primary">{formatPoints(Math.floor((product.dollars ?? 0) * 10))} pts</b>.
                </>
              }
            />
          </div>
        </>
      )}

      <button
        type="button"
        disabled={!canRedeem}
        onClick={() => onConfirm(cashOnly ? product.points : choice === 'card' ? 0 : pts)}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-md bg-primary py-3.5 text-sm font-semibold text-white disabled:opacity-40"
      >
        Add to bag
        <Icon name="shopping_bag" className="text-[18px]" />
      </button>
    </section>
  );
}

function Choice({
  active,
  onClick,
  icon,
  title,
  body,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  title: string;
  body: React.ReactNode;
  badge?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex items-center gap-3 rounded-md border px-3 py-3 text-left',
        active ? 'border-primary bg-primary-fixed' : 'border-outline-variant bg-white',
      )}
    >
      {badge && (
        <span className="absolute -top-2.5 right-3 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">{badge}</span>
      )}
      <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2', active ? 'border-primary' : 'border-outline')}>
        {active && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
      </span>
      <Icon name={icon} className="text-[26px] text-primary" />
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold text-on-surface">{title}</span>
        <span className="block text-[12px] leading-snug text-on-surface-variant">{body}</span>
      </span>
    </button>
  );
}

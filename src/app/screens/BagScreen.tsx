import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDemo } from '@/app/DemoContext';
import { chapterIdByKey } from '@/app/chapters';
import { Screen } from './Screen';
import { SectionHeader } from '@/components/rewards/Primitives';
import { Icon } from '@/components/ui/Icon';
import { Disclaimer } from '@/components/ui/Card';
import { settings } from '@/mock-data/settings';
import { products } from '@/mock-data/products';
import { cn, formatAud, formatPoints } from '@/hooks/utils';
import type { Product } from '@/types';

/** Cash owed for an item given the points applied to it (demo proportional split). */
function cashFor(p: Product, pts: number) {
  if (p.dollars == null) return 0;
  return Math.round(p.dollars * (1 - pts / p.points) * 100) / 100;
}

/** Chapter 5 — Bag, redemption and confirmation. */
export function BagScreen() {
  const { bag, allocations, removeFromBag, points, redeem, lastRedemption, goToChapter, appUserProfile, addToBag, openDetail } =
    useDemo();
  const [confirming, setConfirming] = useState(false);

  const lines = bag.map((x) => {
    const pts = Math.min(allocations[x.id] ?? 0, x.points);
    return { item: x, pts, cash: cashFor(x, pts) };
  });
  const pay = {
    points: lines.reduce((t, l) => t + l.pts, 0),
    cash: Math.round(lines.reduce((t, l) => t + l.cash, 0) * 100) / 100,
    earn: lines.reduce((t, l) => t + Math.floor(l.cash * 10), 0),
  };
  const canRedeem = pay.points <= points && lines.every((l) => l.pts > 0 || l.cash > 0);
  const addons = products(appUserProfile.bagAddons).filter((a) => !bag.some((b) => b.id === a.id)).slice(0, 3);
  const remaining = points - pay.points;

  if (lastRedemption && bag.length === 0) {
    const r = lastRedemption;
    return (
      <Screen>
        <div className="flex flex-col items-center gap-3 px-6 pt-10 text-center">
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e8f3e8] text-success"
          >
            <Icon name="task_alt" filled className="text-[44px]" />
          </motion.span>
          <h1 className="font-heading text-[24px] font-bold text-on-surface">You’re all set</h1>
          <p className="text-sm text-on-surface-variant">Your reward is on its way. We’ll email your confirmation shortly.</p>
          <div className="mt-2 w-full rounded-md bg-white p-4 text-left shadow-card">
            {r.items.map((x) => (
              <div key={x.id} className="flex items-center gap-3 py-1">
                <img src={x.image} alt="" className="h-12 w-12 object-contain" />
                <p className="flex-1 text-[14px] font-semibold text-on-surface">{x.name}</p>
              </div>
            ))}
            <div className="mt-3 divide-y divide-surface-container-high border-t border-surface-container-high text-[13px]">
              <Row label="Points used" value={`${formatPoints(r.pointsUsed)} pts`} />
              {r.cashPaid > 0 && <Row label="Paid by card (demo)" value={formatAud(r.cashPaid)} />}
              {r.pointsEarned > 0 && <Row label="Points earned (pending)" value={`+${formatPoints(r.pointsEarned)} pts`} />}
              <Row label="New balance" value={`${formatPoints(points)} pts`} bold />
            </div>
          </div>
          <div className="mt-2 w-full rounded-md bg-primary-fixed p-4 text-left">
            <p className="font-heading text-[15px] font-bold text-primary">What should you save for next?</p>
            <p className="mt-1 text-[13px] text-on-surface-variant">
              {appUserProfile.homeVariant === 'newMember'
                ? 'Your bill keeps earning ~650 pts a month. Pick a goal and we’ll track it.'
                : 'You still have plenty of points. The assistant can find the next thing for the family.'}
            </p>
            <button
              type="button"
              onClick={() => goToChapter(chapterIdByKey('muse'))}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-md bg-primary py-3 text-sm font-semibold text-white"
            >
              <Icon name="auto_awesome" filled className="text-[18px]" />
              Find my next reward
            </button>
          </div>
          <button type="button" onClick={() => goToChapter(chapterIdByKey('plus'))} className="py-2 text-sm font-semibold text-primary">
            Back to Telstra Plus
          </button>
        </div>
      </Screen>
    );
  }

  if (bag.length === 0) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-surface px-8 text-center">
        <Icon name="shopping_bag" className="text-[40px] text-primary" />
        <p className="font-heading text-lg font-bold text-on-surface">Your bag is empty</p>
        <button
          type="button"
          onClick={() => goToChapter(chapterIdByKey('rewards'))}
          className="mt-1 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white"
        >
          Browse rewards
        </button>
      </div>
    );
  }

  return (
    <Screen>
      <div className="flex flex-col gap-4 px-4 pt-4">
        <h1 className="font-heading text-[24px] font-bold text-on-surface">Your bag</h1>

        <section className="overflow-hidden rounded-md bg-white shadow-card">
          {lines.map(({ item: x, pts, cash }) => (
            <div key={x.id} className="flex items-center gap-3 border-b border-surface-container-high px-4 py-3 last:border-b-0">
              <img src={x.image} alt="" className="h-14 w-14 object-contain" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-semibold text-on-surface">{x.name}</p>
                <p className="text-[13px] text-on-surface-variant">
                  {formatPoints(pts)} pts{cash > 0 ? ` + ${formatAud(cash)}` : ''}
                  {pts === 0 && cash > 0 && ' · pay by card'}
                </p>
                <button type="button" onClick={() => openDetail(x)} className="text-[12px] font-semibold text-primary">
                  Change points
                </button>
              </div>
              <button type="button" onClick={() => removeFromBag(x.id)} aria-label={`Remove ${x.name}`} className="text-on-surface-variant">
                <Icon name="close" className="text-[20px]" />
              </button>
            </div>
          ))}
        </section>

        <section className="rounded-md bg-white p-4 shadow-card">
          <p className="font-heading text-[15px] font-bold text-on-surface">Summary</p>
          <div className="mt-2 divide-y divide-surface-container-high border-t border-surface-container-high text-[13px]">
            <Row label="Points to use" value={`${formatPoints(pay.points)} pts`} />
            <Row label="To pay by card" value={formatAud(pay.cash)} />
            {pay.earn > 0 && <Row label="You’ll earn" value={`+${formatPoints(pay.earn)} pts`} />}
            <Row label="Points after" value={`${formatPoints(Math.max(0, remaining))} pts`} bold />
          </div>
          <button
            type="button"
            disabled={!canRedeem}
            onClick={() => setConfirming(true)}
            className="mt-4 w-full rounded-md bg-primary py-3.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            Redeem now
          </button>
          <Disclaimer className="mt-2">No real payment is taken in this demo.</Disclaimer>
        </section>

        {addons.length > 0 && (
          <section>
            <SectionHeader title="A finishing touch" />
            <div className="mt-2 grid grid-cols-3 gap-2">
              {addons.map((a) => (
                <button key={a.id} type="button" onClick={() => addToBag(a, Math.min(a.points, Math.max(0, remaining)))} className="flex flex-col rounded-md bg-white p-2 text-left shadow-card">
                  <img src={a.image} alt="" className="h-16 w-full object-contain" />
                  <span className="mt-1 line-clamp-2 text-[11px] font-semibold leading-snug text-on-surface">{a.name}</span>
                  <span className="mt-1 text-[12px] font-bold text-primary">+ {formatPoints(a.points)} pts</span>
                </button>
              ))}
            </div>
          </section>
        )}

        <Disclaimer>{settings.disclaimers.pointsPlusPay}</Disclaimer>
      </div>

      <AnimatePresence>
        {confirming && (
          <div className="absolute inset-0 z-40 flex items-end">
            <motion.div className="absolute inset-0 bg-black/40" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setConfirming(false)} />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 w-full rounded-t-2xl bg-white p-5"
            >
              <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-black/15" />
              <p className="font-heading text-[18px] font-bold text-on-surface">Confirm redemption</p>
              <p className="mt-1 text-[13px] text-on-surface-variant">
                Use {formatPoints(pay.points)} pts{pay.cash > 0 ? ` and pay ${formatAud(pay.cash)}` : ''} for {bag.length} reward{bag.length > 1 ? 's' : ''}.
              </p>
              <button
                type="button"
                onClick={() => {
                  redeem({ items: bag, pointsUsed: pay.points, cashPaid: pay.cash, pointsEarned: pay.earn });
                  setConfirming(false);
                }}
                className="mt-4 w-full rounded-md bg-primary py-3.5 text-sm font-semibold text-white"
              >
                Confirm
              </button>
              <button type="button" onClick={() => setConfirming(false)} className="mt-1 w-full py-2 text-sm font-semibold text-primary">
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </Screen>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-on-surface-variant">{label}</span>
      <span className={cn('text-on-surface', bold ? 'font-bold' : 'font-semibold')}>{value}</span>
    </div>
  );
}

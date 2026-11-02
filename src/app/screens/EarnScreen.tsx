import { useState } from 'react';
import { useDemo } from '@/app/DemoContext';
import { Screen } from './Screen';
import { ListRow, SectionHeader } from '@/components/rewards/Primitives';
import { Icon } from '@/components/ui/Icon';
import { Drawer } from '@/components/ui/Drawer';
import { Disclaimer } from '@/components/ui/Card';
import { settings } from '@/mock-data/settings';
import { formatPoints } from '@/hooks/utils';

/** Chapter 6 — Earn points. Options and emphasis differ by persona. */
export function EarnScreen() {
  const { appUserProfile, points, goal, cardLinked, linkCard, showToast } = useDemo();
  const p = appUserProfile;
  const [linking, setLinking] = useState(false);

  return (
    <Screen>
      <div className="flex flex-col gap-4 px-4 pt-4">
        <div>
          <h1 className="font-heading text-[24px] font-bold text-on-surface">{p.earnTitle}</h1>
          <p className="mt-1 text-[13px] text-on-surface-variant">
            Earn 10 points for every $1 on eligible Telstra spend. {p.tier === 'Gold' ? 'As a Gold member you also have partner ways to earn.' : 'Here’s how to build your balance.'}
          </p>
        </div>

        {goal && (
          <section className="rounded-md bg-white p-4 shadow-card">
            <div className="flex items-center gap-3">
              <img src={goal.image} alt="" className="h-14 w-14 object-contain" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Your next reward</p>
                <p className="truncate text-[14px] font-bold text-on-surface">{goal.name}</p>
                <p className="text-[12px] text-on-surface-variant">
                  {formatPoints(Math.max(0, goal.points - points))} pts to go · about{' '}
                  {Math.max(1, Math.ceil(Math.max(0, goal.points - points) / (p.homeVariant === 'newMember' ? 650 : 3200)))} month(s) of bills
                </p>
              </div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-surface-container-high">
              <div className="h-full bg-primary" style={{ width: `${Math.min(100, (points / goal.points) * 100)}%` }} />
            </div>
          </section>
        )}

        <section className="overflow-hidden rounded-md shadow-card">
          {p.earnOptions.map((o) => {
            const isLink = o.title.toLowerCase().includes('link');
            return (
              <ListRow
                key={o.title}
                icon={o.icon}
                title={o.title}
                subtitle={o.body}
                tag={isLink && cardLinked ? 'Linked ✓' : o.tag}
                trailing={
                  o.value ? (
                    <span className="shrink-0 text-right text-[12px] font-bold text-success">{o.value}</span>
                  ) : undefined
                }
                onClick={() => (isLink && !cardLinked ? setLinking(true) : showToast(`${o.title}: opens the Telstra Plus partner journey`))}
              />
            );
          })}
        </section>

        <section>
          <SectionHeader title="Good to know" />
          <ul className="mt-2 flex flex-col gap-2 text-[13px] text-on-surface-variant">
            {[
              'Points are earned on eligible spend only — refunds, credits and late fees are excluded.',
              'Partner offers must start from Telstra Plus to track.',
              settings.disclaimers.expiry,
            ].map((t) => (
              <li key={t} className="flex gap-2 rounded-md bg-white p-3 shadow-card">
                <Icon name="info" className="mt-px shrink-0 text-[18px] text-primary" />
                {t}
              </li>
            ))}
          </ul>
        </section>

        <Disclaimer>{settings.disclaimers.programmeRules}</Disclaimer>
      </div>

      <Drawer open={linking} onClose={() => setLinking(false)} title="Link a card for Shop and Earn">
        <p className="text-[13px] text-on-surface-variant">
          Link an eligible Visa or Mastercard to earn Telstra Plus points at participating retailers. No card details are collected in this demo.
        </p>
        <div className="mt-4 flex items-center gap-3 rounded-md border border-outline-variant p-3">
          <Icon name="credit_card" className="text-[28px] text-primary" />
          <div className="flex-1">
            <p className="text-[14px] font-semibold text-on-surface">Mastercard •••• 4821</p>
            <p className="text-[12px] text-on-surface-variant">Demo card</p>
          </div>
          <Icon name="check_circle" filled className="text-[22px] text-success" />
        </div>
        <button
          type="button"
          onClick={() => {
            linkCard();
            setLinking(false);
            showToast('Card linked — you’ll earn at Shop and Earn retailers');
          }}
          className="mt-4 w-full rounded-md bg-primary py-3.5 text-sm font-semibold text-white"
        >
          Link card
        </button>
      </Drawer>
    </Screen>
  );
}

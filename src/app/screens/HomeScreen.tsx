import { motion } from 'framer-motion';
import { useDemo } from '@/app/DemoContext';
import { chapterIdByKey } from '@/app/chapters';
import { Screen } from './Screen';
import { SectionHeader } from '@/components/rewards/Primitives';
import { Icon } from '@/components/ui/Icon';
import { Disclaimer } from '@/components/ui/Card';
import { settings } from '@/mock-data/settings';
import type { ServiceSummary } from '@/types';
import { formatPoints } from '@/hooks/utils';

/** Usage ring as used on the My Telstra home "Your services" tiles. */
function UsageRing({ pct }: { pct: number }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90">
      <circle cx="28" cy="28" r={r} fill="none" stroke="#e3e6eb" strokeWidth="4" strokeDasharray="2 3" />
      <circle
        cx="28"
        cy="28"
        r={r}
        fill="none"
        stroke="#0d54ff"
        strokeWidth="4"
        strokeDasharray={`${(pct / 100) * c} ${c}`}
        strokeLinecap="round"
      />
      <text x="28" y="31" textAnchor="middle" className="rotate-90 origin-center fill-on-surface text-[11px] font-semibold">
        {pct}%
      </text>
    </svg>
  );
}

function ServiceTile({ s }: { s: ServiceSummary }) {
  return (
    <div className="flex w-[150px] shrink-0 flex-col items-center rounded-md bg-white px-3 py-4 text-center shadow-card">
      <UsageRing pct={s.usage} />
      <p className="mt-2 text-[14px] font-bold text-on-surface">{s.name}</p>
      <p className="mt-0.5 text-[12px] leading-snug text-on-surface-variant">{s.detail}</p>
    </div>
  );
}

/** Chapter 1 — My Telstra home. Only the Telstra Plus entry points are interactive. */
export function HomeScreen() {
  const { appUserProfile, goToChapter, openWhy, showToast, lastRedemption, points } = useDemo();
  const promo = lastRedemption
    ? {
        eyebrow: 'Telstra Plus',
        title: `${lastRedemption.items[0].name} is on its way`,
        body: `You have ${formatPoints(points)} pts left. Keep earning on every eligible payment and save for your next reward.`,
        cta: 'See what’s next',
        chapter: chapterIdByKey('plus'),
        icon: 'task_alt',
      }
    : appUserProfile.homePromo;
  const plus = chapterIdByKey('plus');

  return (
    <Screen>
      <div className="flex flex-col gap-5 px-4 pt-4">
        {/* Personalised promo card (DY) */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-md bg-white shadow-card"
        >
          <button
            type="button"
            onClick={openWhy}
            aria-label="Why is this shown now?"
            className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-surface px-2 py-1 text-[10px] font-semibold text-on-surface-variant"
          >
            <Icon name="info" className="text-[13px]" />
            Why this?
          </button>
          <div className="flex items-start gap-3 p-4 pr-20">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary-fixed text-primary">
              <Icon name={promo.icon} className="text-[26px]" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">{promo.eyebrow}</p>
              <p className="mt-0.5 font-heading text-[16px] font-bold leading-snug text-on-surface">{promo.title}</p>
              <p className="mt-1 text-[13px] leading-snug text-on-surface-variant">{promo.body}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => goToChapter(promo.chapter)}
            className="flex w-full items-center justify-between border-t border-surface-container-high px-4 py-3 text-sm font-semibold text-primary"
          >
            {promo.cta}
            <Icon name="chevron_right" className="text-[20px]" />
          </button>
          <span className="block h-1 w-full bg-primary" />
        </motion.section>

        {/* Your services */}
        <section>
          <SectionHeader title="Your services" action="View all" onAction={() => showToast('Services is outside this Telstra Plus demo')} />
          <div className="no-scrollbar -mx-4 mt-3 flex gap-3 overflow-x-auto px-4">
            {appUserProfile.services.map((s) => (
              <ServiceTile key={s.name} s={s} />
            ))}
            <button
              type="button"
              onClick={() => showToast('Services is outside this Telstra Plus demo')}
              className="flex w-[150px] shrink-0 flex-col items-center justify-center gap-2 rounded-md border border-dashed border-outline-variant bg-white/60 px-3 py-4 text-center text-on-surface-variant"
            >
              <Icon name="add_circle" className="text-[28px]" />
              <span className="text-[13px] font-semibold">Add a service</span>
            </button>
          </div>
        </section>

        {/* Telstra Plus entry list */}
        <section>
          <SectionHeader title="Telstra Plus" action="Open" onAction={() => goToChapter(plus)} />
          <div className="mt-3 overflow-hidden rounded-md shadow-card">
            {[
              { icon: 'redeem', title: 'Rewards Store', sub: 'Use your points on tech, gift cards and more', ch: chapterIdByKey('rewards') },
              { icon: 'trending_up', title: 'Earn points', sub: '10 points per $1 on eligible Telstra spend', ch: chapterIdByKey('earn') },
              { icon: 'confirmation_number', title: 'Tickets and benefits', sub: 'Movies, pre-sales and member offers', ch: chapterIdByKey('benefits') },
            ].map((row) => (
              <button
                key={row.title}
                type="button"
                onClick={() => goToChapter(row.ch)}
                className="flex w-full items-center gap-3 border-b border-surface-container-high bg-white px-4 py-3.5 text-left last:border-b-0"
              >
                <Icon name={row.icon} className="text-[26px] text-primary" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[15px] font-semibold text-on-surface">{row.title}</span>
                  <span className="block text-[12px] text-on-surface-variant">{row.sub}</span>
                </span>
                <Icon name="chevron_right" className="text-[22px] text-on-surface" />
              </button>
            ))}
          </div>
        </section>

        {/* Security card, as on the live home screen */}
        <section className="flex items-center gap-3 rounded-md bg-white p-4 shadow-card">
          <div className="flex-1">
            <p className="font-heading text-[15px] font-bold text-on-surface">Enable security features</p>
            <p className="mt-0.5 text-[13px] text-on-surface-variant">Protect your account with multi-factor authentication</p>
          </div>
          <Icon name="phonelink_lock" className="text-[40px] text-primary" />
        </section>

        <Disclaimer>{settings.disclaimers.illustrative}</Disclaimer>
      </div>
    </Screen>
  );
}

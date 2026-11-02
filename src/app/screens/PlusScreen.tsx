import { motion } from 'framer-motion';
import { useDemo } from '@/app/DemoContext';
import { chapterIdByKey } from '@/app/chapters';
import { Screen } from './Screen';
import { RewardCard } from '@/components/rewards/RewardCard';
import { SectionHeader } from '@/components/rewards/Primitives';
import { Icon } from '@/components/ui/Icon';
import { Disclaimer } from '@/components/ui/Card';
import { settings } from '@/mock-data/settings';
import { affinityPicks, categoryLabel, products } from '@/mock-data/products';
import { musePromptsByUser } from '@/mock-data/muse';
import { cn, formatPoints } from '@/hooks/utils';

/** Points summary band at the top of Telstra Plus (blue, like the Shop "Explore" banner). */
function PointsBand() {
  const { appUserProfile, points, pendingPoints, goToChapter, lastRedemption } = useDemo();
  const p = appUserProfile;
  const gold = p.tier === 'Gold';
  const expiring = p.expiringPoints && (!lastRedemption || lastRedemption.pointsUsed < p.expiringPoints.amount);
  return (
    <section className="telstra-header px-4 pb-6 pt-4 text-white">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] text-white/85">Your Telstra Plus points</p>
          <p className="font-heading text-[34px] font-bold leading-tight">{formatPoints(points)}</p>
          {pendingPoints > 0 && (
            <p className="text-[12px] text-white/85">+{formatPoints(pendingPoints)} pts pending</p>
          )}
        </div>
        <span
          className={cn(
            'mt-1 flex items-center gap-1 rounded-full px-2.5 py-1 text-[12px] font-bold',
            gold ? 'bg-[#fff3d6] text-[#8a6a1f]' : 'bg-white text-primary',
          )}
        >
          <Icon name={gold ? 'workspace_premium' : 'loyalty'} filled className="text-[16px]" />
          {p.tier}
        </span>
      </div>
      {expiring && p.expiringPoints && (
        <div className="mt-3 flex items-center gap-2 rounded-md bg-white/15 px-3 py-2">
          <Icon name="hourglass_top" className="text-[18px]" />
          <p className="text-[12px] font-medium">
            {formatPoints(p.expiringPoints.amount)} pts expire on {p.expiringPoints.when}
          </p>
        </div>
      )}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {[
          { icon: 'redeem', label: 'Use points', ch: chapterIdByKey('rewards') },
          { icon: 'trending_up', label: 'Earn points', ch: chapterIdByKey('earn') },
          { icon: 'workspace_premium', label: 'Benefits', ch: chapterIdByKey('benefits') },
        ].map((a) => (
          <button
            key={a.label}
            type="button"
            onClick={() => goToChapter(a.ch)}
            className="flex flex-col items-center gap-1 rounded-md bg-white py-2.5 text-primary"
          >
            <Icon name={a.icon} className="text-[24px]" />
            <span className="text-[12px] font-semibold">{a.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

/** New-member onboarding checklist (persona 1). */
function OnboardingCard() {
  const { appUserProfile, goToChapter, cardLinked, lastRedemption } = useDemo();
  const steps = (appUserProfile.onboarding ?? []).map((s) => ({
    ...s,
    done: s.done || (s.label.includes('Link') && cardLinked) || (s.label.includes('Redeem') && !!lastRedemption),
  }));
  const done = steps.filter((s) => s.done).length;
  return (
    <section className="rounded-md bg-white p-4 shadow-card">
      <div className="flex items-center justify-between">
        <p className="font-heading text-[15px] font-bold text-on-surface">Get set up</p>
        <span className="text-[12px] font-semibold text-on-surface-variant">
          {done} of {steps.length} complete
        </span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-container-high">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(done / steps.length) * 100}%` }} />
      </div>
      <ul className="mt-3 flex flex-col divide-y divide-surface-container-high">
        {steps.map((s) => (
          <li key={s.label} className="flex items-center gap-3 py-2.5">
            <Icon
              name={s.done ? 'check_circle' : 'radio_button_unchecked'}
              filled={s.done}
              className={cn('text-[22px]', s.done ? 'text-success' : 'text-outline')}
            />
            <span className={cn('flex-1 text-[14px]', s.done ? 'text-on-surface-variant line-through' : 'font-semibold text-on-surface')}>
              {s.label}
            </span>
            {!s.done && (
              <button type="button" onClick={() => goToChapter(s.chapter)} className="text-[13px] font-semibold text-primary">
                Start
              </button>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Three education tiles for new members. */
function EducationRow() {
  const { appUserProfile, goToChapter } = useDemo();
  if (!appUserProfile.education) return null;
  return (
    <section>
      <SectionHeader title="How Telstra Plus works" />
      <div className="mt-3 grid grid-cols-3 gap-2">
        {appUserProfile.education.map((e) => (
          <button
            key={e.title}
            type="button"
            onClick={() => goToChapter(e.chapter)}
            className="flex flex-col items-start gap-2 rounded-md bg-white p-3 text-left shadow-card"
          >
            <Icon name={e.icon} className="text-[26px] text-primary" />
            <span className="text-[13px] font-bold text-on-surface">{e.title}</span>
            <span className="text-[11px] leading-snug text-on-surface-variant">{e.body}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

/** Chapter 2 — Telstra Plus "For you" hub, personalised per member. */
export function PlusScreen() {
  const { appUser, appUserProfile, goToChapter, openWhy, goal, points, lastRedemption, topAffinity } = useDemo();
  const p = appUserProfile;
  const hero = lastRedemption
    ? {
        eyebrow: 'Nice one',
        title: p.homeVariant === 'newMember' ? 'Your first reward is on its way' : 'Great choice — what’s next for the family?',
        body:
          p.homeVariant === 'newMember'
            ? `You have ${formatPoints(points)} pts left and your bill earns around 650 pts a month. Save a goal and we’ll track it for you.`
            : `You still have ${formatPoints(points)} pts to use. The assistant can line up the next thing — or put points toward a family movie night.`,
        cta: 'Find my next reward',
        chapter: chapterIdByKey('muse'),
        icon: 'auto_awesome',
      }
    : p.plusHero;
  const prompts = musePromptsByUser[appUser].slice(0, 3);

  // New members start with generic popular picks; in-session browsing re-ranks them in real time.
  const live = p.homeVariant === 'newMember' && topAffinity ? affinityPicks(topAffinity, points) : null;
  const basePicks = products(p.picks);
  const picks = live && live.length ? [...live, ...basePicks.filter((b) => !live.some((l) => l.id === b.id))] : basePicks;
  const liveLabel = topAffinity ? (categoryLabel[topAffinity] ?? topAffinity).toLowerCase() : '';
  const picksTitle = live ? `Picked for your ${liveLabel}` : p.picksTitle;
  const picksSubtitle = live ? `Updated just now from what you’ve browsed · ${formatPoints(points)} pts available` : p.picksSubtitle;

  return (
    <Screen>
      <PointsBand />

      <div className="flex flex-col gap-5 px-4 pt-4">
        {/* Post-redemption / goal continuity */}
        {lastRedemption && (
          <section className="flex items-center gap-3 rounded-md border border-success/30 bg-[#eef7ee] p-3">
            <Icon name="task_alt" filled className="text-[26px] text-success" />
            <div className="flex-1">
              <p className="text-[14px] font-bold text-on-surface">Reward on its way</p>
              <p className="text-[12px] text-on-surface-variant">
                {lastRedemption.items[0].name} · {formatPoints(lastRedemption.pointsUsed)} pts used
              </p>
            </div>
          </section>
        )}
        {goal && (
          <section className="flex items-center gap-3 rounded-md bg-white p-3 shadow-card">
            <img src={goal.image} alt="" className="h-12 w-12 object-contain" />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Saving for</p>
              <p className="truncate text-[14px] font-bold text-on-surface">{goal.name}</p>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-container-high">
                <div className="h-full bg-primary" style={{ width: `${Math.min(100, (points / goal.points) * 100)}%` }} />
              </div>
              <p className="mt-0.5 text-[11px] text-on-surface-variant">
                {formatPoints(points)} of {formatPoints(goal.points)} pts
              </p>
            </div>
            <button type="button" onClick={() => goToChapter(chapterIdByKey('earn'))} className="text-[13px] font-semibold text-primary">
              Earn
            </button>
          </section>
        )}

        {/* Persona hero */}
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
          <div className="p-4 pr-20">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">{hero.eyebrow}</p>
            <h2 className="mt-1 font-heading text-[20px] font-bold leading-tight text-on-surface">{hero.title}</h2>
            <p className="mt-2 text-[13px] leading-snug text-on-surface-variant">{hero.body}</p>
          </div>
          <div className="px-4 pb-4">
            <button
              type="button"
              onClick={() => goToChapter(hero.chapter)}
              className="flex w-full items-center justify-center gap-1.5 rounded-md bg-primary py-3 text-sm font-semibold text-white"
            >
              {hero.cta}
              <Icon name="arrow_forward" className="text-[18px]" />
            </button>
          </div>
        </motion.section>

        {p.homeVariant === 'newMember' && <OnboardingCard />}
        {p.homeVariant === 'newMember' && <EducationRow />}

        {/* Personalised picks */}
        <section>
          <SectionHeader title={picksTitle} action="View all" onAction={() => goToChapter(chapterIdByKey('rewards'))} />
          <p className="mt-0.5 flex items-center gap-1 text-[12px] text-on-surface-variant">
            {live && <Icon name="bolt" filled className="text-[14px] text-primary" />}
            {picksSubtitle}
          </p>
          <motion.div key={topAffinity ?? 'generic'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-3 grid grid-cols-2 gap-3">
            {picks.slice(0, 4).map((pr, i) => (
              <RewardCard
                key={pr.id}
                product={pr}
                index={i}
                reason={
                  live
                    ? pr.points <= points
                      ? 'Within your points'
                      : pr.dollars
                        ? 'Points + Pay gets you there'
                        : 'Save toward this'
                    : undefined
                }
              />
            ))}
          </motion.div>
        </section>

        {/* Assistant entry */}
        <section className="rounded-md bg-white p-4 shadow-card">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full muse-gradient text-white">
              <Icon name="auto_awesome" filled className="text-[22px]" />
            </span>
            <div className="flex-1">
              <p className="font-heading text-[15px] font-bold text-on-surface">Ask Telstra Plus</p>
              <p className="text-[12px] text-on-surface-variant">
                {p.homeVariant === 'newMember' ? 'New here? Ask anything about points.' : 'Find rewards in your own words.'}
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {prompts.map((pr) => (
              <button
                key={pr.id}
                type="button"
                onClick={() => goToChapter(chapterIdByKey('muse'))}
                className="flex items-center gap-1.5 rounded-full border border-primary/40 bg-white px-3 py-1.5 text-[12px] font-semibold text-primary"
              >
                <Icon name={pr.icon} className="text-[15px]" />
                {pr.label}
              </button>
            ))}
          </div>
        </section>

        {/* Benefits teaser (differs by tier) */}
        <section className="overflow-hidden rounded-md bg-white shadow-card">
          <div className="flex items-center justify-between px-4 pt-4">
            <h3 className="font-heading text-[15px] font-bold text-on-surface">
              {p.tier === 'Gold' ? 'Your Gold benefits' : 'Member benefits'}
            </h3>
            <button type="button" onClick={() => goToChapter(chapterIdByKey('benefits'))} className="text-[13px] font-semibold text-primary">
              View all
            </button>
          </div>
          <ul className="mt-2">
            {p.benefits.slice(0, 2).map((b) => (
              <li key={b.title} className="flex items-center gap-3 border-t border-surface-container-high px-4 py-3">
                <Icon name={b.icon} className="text-[24px] text-primary" />
                <span className="flex-1">
                  <span className="block text-[14px] font-semibold text-on-surface">{b.title}</span>
                  <span className="block text-[12px] text-on-surface-variant">{b.body}</span>
                </span>
                {b.tag && <span className="rounded-sm bg-telstra-gold-soft px-1.5 py-0.5 text-[10px] font-bold text-telstra-gold">{b.tag}</span>}
              </li>
            ))}
          </ul>
        </section>

        <Disclaimer>{settings.disclaimers.programmeRules}</Disclaimer>
      </div>
    </Screen>
  );
}

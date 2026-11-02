import { useMemo, useState } from 'react';
import { useDemo } from '@/app/DemoContext';
import { Screen } from './Screen';
import { RewardCard } from '@/components/rewards/RewardCard';
import { SegmentedPills } from '@/components/rewards/Primitives';
import { Icon } from '@/components/ui/Icon';
import { Disclaimer } from '@/components/ui/Card';
import { settings } from '@/mock-data/settings';
import { catalogue, products } from '@/mock-data/products';
import { cn, formatPoints } from '@/hooks/utils';

type Mode = 'foryou' | 'explore';

/** Chapter 3 — Rewards Store. Category order, defaults and ranking are persona-aware. */
export function RewardsScreen() {
  const { appUserProfile, points, storeCategory, setStoreCategory, topAffinity } = useDemo();
  const p = appUserProfile;
  // Live affinity pulls the member's hottest category to the front for new members.
  const categories = useMemo(() => {
    if (p.homeVariant !== 'newMember' || !topAffinity) return p.rewardCategories;
    const hot = p.rewardCategories.find((c) => c.id === topAffinity);
    if (!hot) return p.rewardCategories;
    return [p.rewardCategories[0], hot, ...p.rewardCategories.filter((c) => c.id !== 'all' && c.id !== topAffinity)];
  }, [p, topAffinity]);
  const [mode, setMode] = useState<Mode>('foryou');
  const [within, setWithin] = useState(p.withinPointsDefault);
  const [query, setQuery] = useState('');

  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    const affinity = new Set(topAffinity ? [topAffinity, ...p.rewardCategories.map((c) => c.id)] : p.rewardCategories.map((c) => c.id));
    const list = catalogue.filter(
      (x) =>
        (!within || x.points <= points) &&
        (storeCategory === 'all' || x.category === storeCategory) &&
        (!q || `${x.name} ${x.brand} ${x.category}`.toLowerCase().includes(q)),
    );
    // "For you" ranks persona picks first, then affinity categories, then price proximity to balance.
    const pickRank = new Map(p.picks.map((id, i) => [id, i]));
    return list
      .slice()
      .sort((a, b) => {
        if (mode === 'foryou') {
          const pa = pickRank.has(a.id) ? pickRank.get(a.id)! : 99;
          const pb = pickRank.has(b.id) ? pickRank.get(b.id)! : 99;
          if (pa !== pb) return pa - pb;
          const aa = topAffinity && a.category === topAffinity ? -1 : affinity.has(a.category) ? 0 : 1;
          const ab = topAffinity && b.category === topAffinity ? -1 : affinity.has(b.category) ? 0 : 1;
          if (aa !== ab) return aa - ab;
          // New members: cheapest first. Returning Gold: higher-value within reach first.
          return p.homeVariant === 'newMember' ? a.points - b.points : b.points - a.points;
        }
        return a.name.localeCompare(b.name);
      })
      .slice(0, 40);
  }, [query, within, storeCategory, points, mode, p, topAffinity]);

  const picks = products(p.picks);

  return (
    <Screen>
      <div className="flex flex-col gap-4 px-4 pt-4">
        <div>
          <h1 className="font-heading text-[26px] font-bold text-on-surface">Rewards Store</h1>
          <p className="text-[13px] text-on-surface-variant">{formatPoints(points)} pts available</p>
        </div>

        <SegmentedPills
          options={[
            { id: 'foryou', label: 'For you' },
            { id: 'explore', label: 'Explore' },
          ]}
          value={mode}
          onChange={setMode}
        />

        {/* Search */}
        <label className="flex items-center gap-2 rounded-md border border-outline-variant bg-white px-3 py-2.5">
          <Icon name="search" className="text-[22px] text-on-surface-variant" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search rewards"
            aria-label="Search rewards"
            className="w-full bg-transparent text-sm outline-none placeholder:text-on-surface-variant"
          />
        </label>

        {/* Category chips — order differs by persona */}
        <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setStoreCategory(c.id)}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-semibold',
                c.id === storeCategory ? 'border-primary bg-primary text-white' : 'border-outline-variant bg-white text-on-surface',
              )}
            >
              <Icon name={c.icon} className="text-[16px]" />
              {c.label}
            </button>
          ))}
        </div>

        {/* Within-points toggle */}
        <div className="flex items-center justify-between rounded-md bg-white px-4 py-3 shadow-card">
          <div>
            <p className="text-[14px] font-semibold text-on-surface">Within my points</p>
            <p className="text-[12px] text-on-surface-variant">
              {within ? 'Only rewards you can get today' : 'Including Points + Pay options'}
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={within}
            onClick={() => setWithin((w) => !w)}
            className={cn('relative h-7 w-12 shrink-0 rounded-full transition-colors', within ? 'bg-primary' : 'bg-outline-variant')}
          >
            <span className={cn('absolute left-0 top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform', within ? 'translate-x-[22px]' : 'translate-x-0.5')} />
          </button>
        </div>

        {mode === 'foryou' && storeCategory === 'all' && !query && (
          <section className="rounded-md bg-primary-fixed p-3">
            <p className="flex items-center gap-1.5 text-[12px] font-semibold text-primary">
              <Icon name="auto_awesome" className="text-[15px]" />
              {p.picksTitle}
            </p>
            <div className="no-scrollbar -mx-3 mt-2 flex gap-3 overflow-x-auto px-3">
              {picks.map((pr, i) => (
                <div key={pr.id} className="w-[150px] shrink-0">
                  <RewardCard product={pr} index={i} />
                </div>
              ))}
            </div>
          </section>
        )}

        <p className="text-[12px] text-on-surface-variant">{items.length} rewards</p>
        <div className="grid grid-cols-2 gap-3">
          {items.map((x, i) => (
            <RewardCard key={x.id} product={x} index={Math.min(i, 8)} />
          ))}
        </div>
        {items.length === 0 && (
          <div className="rounded-md bg-white p-6 text-center shadow-card">
            <Icon name="search_off" className="text-[32px] text-on-surface-variant" />
            <p className="mt-2 text-sm font-semibold text-on-surface">No rewards match</p>
            <p className="text-[12px] text-on-surface-variant">Try another category or turn off “Within my points”.</p>
          </div>
        )}

        <Disclaimer>{settings.disclaimers.programmeRules}</Disclaimer>
      </div>
    </Screen>
  );
}

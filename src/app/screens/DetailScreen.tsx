import { useDemo } from '@/app/DemoContext';
import { chapterIdByKey } from '@/app/chapters';
import { Screen } from './Screen';
import { RewardCard } from '@/components/rewards/RewardCard';
import { SectionHeader } from '@/components/rewards/Primitives';
import { PointsPanel } from '@/components/rewards/PointsPanel';
import { Icon } from '@/components/ui/Icon';
import { Disclaimer } from '@/components/ui/Card';
import { settings } from '@/mock-data/settings';
import { products } from '@/mock-data/products';
import { formatPoints } from '@/hooks/utils';

/** Chapter 4 — Reward detail with a balance-aware points slider and Points + Pay. */
export function DetailScreen() {
  const { detailItem, points, bag, allocations, addToBag, goToChapter, appUserProfile, goal, setGoal, showToast } = useDemo();

  if (!detailItem) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3 bg-surface px-8 text-center">
        <Icon name="redeem" className="text-[40px] text-primary" />
        <p className="font-heading text-lg font-bold text-on-surface">No reward selected</p>
        <p className="text-sm text-on-surface-variant">Pick a reward from the Rewards Store or the assistant.</p>
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

  const item = detailItem;
  const within = item.points <= points;
  // Points already committed to other items in the bag are not available here.
  const committed = bag.filter((x) => x.id !== item.id).reduce((t, x) => t + (allocations[x.id] ?? 0), 0);
  const available = Math.max(0, points - committed);
  const related = products(appUserProfile.completeTheSet).filter((x) => x.id !== item.id).slice(0, 3);
  const isGoal = goal?.id === item.id;

  return (
    <Screen>
      <div className="bg-white px-6 pb-4 pt-4">
        <div className="flex aspect-square items-center justify-center">
          <img src={item.image} alt={item.name} className="h-full w-full object-contain" />
        </div>
      </div>

      <div className="flex flex-col gap-4 px-4 pt-4">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-on-surface-variant">{item.brand}</p>
          <h1 className="mt-0.5 font-heading text-[20px] font-bold leading-snug text-on-surface">{item.name}</h1>
          <p className="mt-2 font-heading text-[24px] font-bold text-on-surface">
            {formatPoints(item.points)} <span className="text-base font-semibold">pts</span>
          </p>
          <p className="mt-1 flex items-center gap-1 text-[12px] text-on-surface-variant">
            <Icon name="group" className="text-[15px]" />
            {appUserProfile.homeVariant === 'newMember' ? '1,240 members redeemed this in the last 30 days' : '86 Gold members redeemed this in the last week'}
            <span className="text-outline">· illustrative</span>
          </p>
        </div>

        {/* Points panel */}
        <PointsPanel product={item} available={available} onConfirm={(pts) => addToBag(item, pts)} />
        <div className="-mt-2">
          <button
            type="button"
            onClick={() => {
              setGoal(isGoal ? null : item);
              showToast(isGoal ? 'Removed from your goals' : 'Saved — we’ll track your progress');
              if (!isGoal) goToChapter(chapterIdByKey('earn'));
            }}
            className="flex w-full items-center justify-center gap-1.5 py-2 text-[13px] font-semibold text-primary"
          >
            <Icon name={isGoal ? 'favorite' : 'favorite_border'} filled={isGoal} className="text-[18px]" />
            {isGoal ? 'Saved as your next reward' : 'Keep earning toward this'}
          </button>
          <Disclaimer>{settings.disclaimers.pointsPlusPay}</Disclaimer>
        </div>

        {/* Compact assistant prompt */}
        <button
          type="button"
          onClick={() => goToChapter(chapterIdByKey('muse'))}
          className="flex items-center gap-3 rounded-md bg-white px-4 py-3 text-left shadow-card"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full muse-gradient text-white">
            <Icon name="auto_awesome" filled className="text-[18px]" />
          </span>
          <span className="flex-1 text-[13px] font-semibold text-on-surface">
            {within ? 'Is this right for me? Ask Telstra Plus' : 'Show me something similar within my points'}
          </span>
          <Icon name="chevron_right" className="text-on-surface-variant" />
        </button>

        {/* Complete your set-up (standard recs) */}
        <section>
          <SectionHeader title={appUserProfile.homeVariant === 'newMember' ? 'Complete your set-up' : 'Goes well with this'} />
          <div className="mt-3 flex flex-col gap-2">
            {related.map((r, i) => (
              <RewardCard key={r.id} product={r} index={i} variant="row" />
            ))}
          </div>
        </section>

        <Disclaimer>{settings.disclaimers.programmeRules}</Disclaimer>
      </div>
    </Screen>
  );
}

import { useDemo } from '@/app/DemoContext';
import { chapterById, chapterIdByKey } from '@/app/chapters';
import { Icon } from '@/components/ui/Icon';
import { TierCard } from '@/components/rewards/Primitives';
import { cn } from '@/hooks/utils';

/** Telstra "T" mark as rendered in the top-left of the My Telstra home header. */
export function TelstraMark({ className }: { className?: string }) {
  return <img src="/telstra/t-logo.svg" alt="Telstra" className={cn('h-8 w-8', className)} />;
}

/**
 * Top app bar, matching the My Telstra app:
 *  - Home: flat Telstra-blue header with the T mark, profile icon and
 *    "G'day, {name}" greeting. The tier card overlaps the header bottom.
 *  - Sub-screens: blue bar with back chevron and centred title.
 *  - Assistant: compact bar with its own title.
 */
export function HeaderBar() {
  const { chapter, goToChapter, appUserProfile, bag } = useDemo();
  const isHome = chapter === 1;
  const meta = chapterById(chapter);

  if (isHome) {
    return (
      <header className="relative z-30 text-white">
        <div className="telstra-header px-5 pb-12 pt-1">
          <div className="flex items-center justify-between">
            <TelstraMark />
            <button type="button" aria-label="Profile" className="text-white">
              <Icon name="person" className="text-[30px]" />
            </button>
          </div>
          <p className="mt-5 text-[15px] font-medium text-white/90">{appUserProfile.greeting}</p>
          <h1 className="font-heading text-[30px] font-bold leading-tight">{appUserProfile.firstName}</h1>
        </div>
        {/* Tier card straddles the header's bottom edge, as in the live app. */}
        <div className="-mt-9 px-4">
          <TierCard onClick={() => goToChapter(chapterIdByKey('plus'))} />
        </div>
      </header>
    );
  }

  const backTarget = (() => {
    switch (meta.key) {
      case 'plus':
        return 1;
      case 'detail':
        return chapterIdByKey('rewards');
      case 'bag':
        return chapterIdByKey('rewards');
      default:
        return chapterIdByKey('plus');
    }
  })();

  return (
    <header className="telstra-header relative z-30 flex h-12 items-center justify-between px-2 text-white">
      <button
        type="button"
        onClick={() => goToChapter(backTarget)}
        aria-label="Back"
        className="flex h-10 w-10 items-center justify-center"
      >
        <Icon name="arrow_back_ios_new" className="text-[22px]" />
      </button>
      <span className="font-heading text-[17px] font-semibold">{meta.title}</span>
      <button
        type="button"
        onClick={() => goToChapter(chapterIdByKey('bag'))}
        aria-label={`Bag, ${bag.length} items`}
        className="relative flex h-10 w-10 items-center justify-center"
      >
        <Icon name="shopping_bag" className="text-[24px]" />
        {bag.length > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-telstra-coral px-1 text-[10px] font-bold text-white">
            {bag.length}
          </span>
        )}
      </button>
    </header>
  );
}

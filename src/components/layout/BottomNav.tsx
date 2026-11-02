import { useDemo } from '@/app/DemoContext';
import { chapterById, chapterIdByKey } from '@/app/chapters';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/hooks/utils';

interface Tab {
  label: string;
  icon: string;
  /** Chapter to open; undefined = outside the scope of this demo. */
  chapter?: number;
}

/** Chapters that belong to the Rewards Store (highlight the Shop tab). */
const shopKeys = new Set(['rewards', 'detail', 'bag']);

/** The five My Telstra tabs, exactly as in the live app. */
const tabs: Tab[] = [
  { label: 'Home', icon: 'home', chapter: 1 },
  { label: 'Services', icon: 'data_usage' },
  { label: 'Payments', icon: 'receipt_long' },
  { label: 'Get help', icon: 'help' },
  { label: 'Shop', icon: 'shopping_bag', chapter: chapterIdByKey('rewards') },
];

/** Bottom tab bar. Rewards Store screens highlight Shop; everything else in Telstra Plus sits under Home. */
export function BottomNav() {
  const { chapter, goToChapter, showToast } = useDemo();
  const inShop = shopKeys.has(chapterById(chapter).key);

  return (
    <nav aria-label="Primary" className="relative z-30 border-t border-surface-container-high bg-white px-1 pb-5 pt-1.5">
      <ul className="flex items-end justify-between">
        {tabs.map((tab) => {
          const active = tab.label === 'Shop' ? inShop : tab.label === 'Home' ? !inShop : false;
          return (
            <li key={tab.label} className="flex-1">
              <button
                type="button"
                onClick={() =>
                  tab.chapter ? goToChapter(tab.chapter) : showToast(`${tab.label} is outside this Telstra Plus demo`)
                }
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex w-full flex-col items-center gap-0.5 px-1 py-1',
                  active ? 'text-primary' : 'text-on-surface',
                )}
              >
                <span
                  className={cn(
                    'flex h-8 w-9 items-center justify-center rounded-lg',
                    active && 'bg-primary text-white',
                  )}
                >
                  <Icon name={tab.icon} filled={active} className="text-[26px]" />
                </span>
                <span className={cn('text-[11px]', active ? 'font-semibold' : 'font-normal')}>{tab.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

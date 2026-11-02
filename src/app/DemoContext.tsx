import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AppUserId, AppUserProfile, Product } from '@/types';
import { appUserProfileById } from '@/mock-data/appUsers';
import { chapterIdByKey, totalChapters } from './chapters';

export type AppUser = AppUserId;

interface Redemption {
  items: Product[];
  pointsUsed: number;
  cashPaid: number;
  pointsEarned: number;
}

interface DemoContextValue {
  /** Current chapter (1-8). */
  chapter: number;
  goToChapter: (id: number) => void;
  nextChapter: () => void;
  prevChapter: () => void;

  /** Selected persona and its full Telstra Plus experience definition. */
  appUser: AppUser;
  setAppUser: (u: AppUser) => void;
  appUserProfile: AppUserProfile;

  /** Live points balance for the selected persona (decrements on redemption). */
  points: number;
  pendingPoints: number;

  /** "Why shown now" left panel visibility (opens from a "Why this?" affordance). */
  whyOpen: boolean;
  openWhy: () => void;
  closeWhy: () => void;

  /** Presenter panel visibility (hidden by default; reveal with "P"). */
  presenterOpen: boolean;
  setPresenterOpen: (open: boolean) => void;
  togglePresenter: () => void;

  /** Reward currently shown on the Detail screen. */
  detailItem: Product | null;
  openDetail: (item: Product) => void;

  /** Rewards bag + redemption. `allocations` = points applied per bag item (rest paid by card). */
  bag: Product[];
  allocations: Record<string, number>;
  addToBag: (item: Product, pointsToUse: number) => void;
  removeFromBag: (id: string) => void;
  setAllocation: (id: string, pts: number) => void;
  lastRedemption: Redemption | null;
  redeem: (r: Redemption) => void;

  /** In-session category affinity built from browsing (drives real-time picks). */
  affinity: Record<string, number>;
  trackAffinity: (category: string, weight?: number) => void;
  topAffinity: string | null;

  /** Saved "next reward" goal. */
  goal: Product | null;
  setGoal: (p: Product | null) => void;

  /** Rewards Store filter state so persona switches reset it. */
  storeCategory: string;
  setStoreCategory: (c: string) => void;

  /** Demo card-link state (Alex starts unlinked, Sarah linked). */
  cardLinked: boolean;
  linkCard: () => void;

  /** Bottom-nav toast for sections outside this demo. */
  toast: string | null;
  showToast: (t: string) => void;

  /** Reset the whole demo back to its initial state. */
  resetDemo: () => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [chapter, setChapter] = useState(1);
  const [appUser, setAppUserState] = useState<AppUser>(1);
  const [presenterOpen, setPresenterOpen] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<Product | null>(null);
  const [bag, setBag] = useState<Product[]>([]);
  const [allocations, setAllocations] = useState<Record<string, number>>({});
  const [affinity, setAffinity] = useState<Record<string, number>>({});
  const [spent, setSpent] = useState<Record<AppUser, number>>({ 1: 0, 2: 0 });
  const [pending, setPending] = useState<Record<AppUser, number>>({ 1: 0, 2: 0 });
  const [lastRedemption, setLastRedemption] = useState<Redemption | null>(null);
  const [goal, setGoal] = useState<Product | null>(null);
  const [storeCategory, setStoreCategoryState] = useState('all');
  const setStoreCategory = useCallback((c: string) => {
    setStoreCategoryState(c);
    if (c !== 'all') setAffinity((a) => ({ ...a, [c]: (a[c] ?? 0) + 1 }));
  }, []);
  const [linked, setLinked] = useState<Record<AppUser, boolean>>({ 1: false, 2: true });
  const [toast, setToast] = useState<string | null>(null);

  const appUserProfile = useMemo(() => appUserProfileById(appUser), [appUser]);
  const points = appUserProfile.points - spent[appUser];
  const pendingPoints = pending[appUser];

  const goToChapter = useCallback((id: number) => {
    setChapter(Math.min(Math.max(1, id), totalChapters));
  }, []);
  const nextChapter = useCallback(() => setChapter((c) => Math.min(c + 1, totalChapters)), []);
  const prevChapter = useCallback(() => setChapter((c) => Math.max(c - 1, 1)), []);

  const setAppUser = useCallback((u: AppUser) => {
    setAppUserState(u);
    setChapter(1);
    setDetailItem(null);
    setBag([]);
    setAllocations({});
    setAffinity({});
    setLastRedemption(null);
    setGoal(null);
    setStoreCategory('all');
    setWhyOpen(false);
  }, []);

  const trackAffinity = useCallback((category: string, weight = 1) => {
    if (!category) return;
    setAffinity((a) => ({ ...a, [category]: (a[category] ?? 0) + weight }));
  }, []);

  const openDetail = useCallback(
    (item: Product) => {
      setDetailItem(item);
      trackAffinity(item.category, 2);
      setChapter(chapterIdByKey('detail'));
    },
    [trackAffinity],
  );

  const addToBag = useCallback((item: Product, pointsToUse: number) => {
    setBag((b) => (b.some((x) => x.id === item.id) ? b : [...b, item]));
    setAllocations((a) => ({ ...a, [item.id]: pointsToUse }));
    setChapter(chapterIdByKey('bag'));
  }, []);
  const removeFromBag = useCallback((id: string) => {
    setBag((b) => b.filter((x) => x.id !== id));
    setAllocations((a) => {
      const next = { ...a };
      delete next[id];
      return next;
    });
  }, []);
  const setAllocation = useCallback((id: string, pts: number) => setAllocations((a) => ({ ...a, [id]: pts })), []);

  const redeem = useCallback(
    (r: Redemption) => {
      setSpent((s) => ({ ...s, [appUser]: s[appUser] + r.pointsUsed }));
      setPending((p) => ({ ...p, [appUser]: p[appUser] + r.pointsEarned }));
      setLastRedemption(r);
      setBag([]);
      setAllocations({});
    },
    [appUser],
  );

  const topAffinity = useMemo(() => {
    const entries = Object.entries(affinity);
    if (!entries.length) return null;
    return entries.sort((a, b) => b[1] - a[1])[0][0];
  }, [affinity]);

  const linkCard = useCallback(() => setLinked((l) => ({ ...l, [appUser]: true })), [appUser]);

  const togglePresenter = useCallback(() => setPresenterOpen((o) => !o), []);
  const openWhy = useCallback(() => setWhyOpen(true), []);
  const closeWhy = useCallback(() => setWhyOpen(false), []);

  const showToast = useCallback((t: string) => {
    setToast(t);
    window.setTimeout(() => setToast(null), 2200);
  }, []);

  const resetDemo = useCallback(() => {
    setChapter(1);
    setAppUserState(1);
    setWhyOpen(false);
    setDetailItem(null);
    setBag([]);
    setAllocations({});
    setAffinity({});
    setSpent({ 1: 0, 2: 0 });
    setPending({ 1: 0, 2: 0 });
    setLastRedemption(null);
    setGoal(null);
    setStoreCategory('all');
    setLinked({ 1: false, 2: true });
  }, []);

  const value: DemoContextValue = {
    chapter,
    goToChapter,
    nextChapter,
    prevChapter,
    appUser,
    setAppUser,
    appUserProfile,
    points,
    pendingPoints,
    whyOpen,
    openWhy,
    closeWhy,
    presenterOpen,
    setPresenterOpen,
    togglePresenter,
    detailItem,
    openDetail,
    bag,
    allocations,
    addToBag,
    removeFromBag,
    setAllocation,
    lastRedemption,
    redeem,
    affinity,
    trackAffinity,
    topAffinity,
    goal,
    setGoal,
    storeCategory,
    setStoreCategory,
    cardLinked: linked[appUser],
    linkCard,
    toast,
    showToast,
    resetDemo,
  };

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within a DemoProvider');
  return ctx;
}

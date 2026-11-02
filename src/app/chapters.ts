import type { Chapter } from '@/types';

/**
 * Customer-facing app steps for the Telstra Plus demo. Only the Telstra Plus
 * section of My Telstra is built out; the rest of the app is represented by
 * the bottom navigation only.
 */
export const chapters: Chapter[] = [
  { id: 1, key: 'home', title: 'Home', copy: 'My Telstra home with your Telstra Plus tier card.', icon: 'home' },
  { id: 2, key: 'plus', title: 'Telstra Plus', copy: 'Your personalised Telstra Plus hub.', icon: 'loyalty' },
  { id: 3, key: 'rewards', title: 'Rewards Store', copy: 'Browse rewards you can get with points.', icon: 'storefront' },
  { id: 4, key: 'detail', title: 'Reward', copy: 'Reward detail, points and Points + Pay.', icon: 'redeem' },
  { id: 5, key: 'bag', title: 'Bag', copy: 'Review and redeem.', icon: 'shopping_bag' },
  { id: 6, key: 'earn', title: 'Earn points', copy: 'Ways to earn Telstra Plus points.', icon: 'trending_up' },
  { id: 7, key: 'benefits', title: 'Benefits', copy: 'Your member benefits by tier.', icon: 'workspace_premium' },
  { id: 8, key: 'muse', title: 'Assistant', copy: 'Telstra Plus assistant, powered by Shopping Muse.', icon: 'auto_awesome' },
];

export const chapterById = (id: number): Chapter =>
  chapters.find((c) => c.id === id) ?? chapters[0];

export const chapterIdByKey = (key: Chapter['key']): number =>
  chapters.find((c) => c.key === key)?.id ?? 1;

export const totalChapters = chapters.length;

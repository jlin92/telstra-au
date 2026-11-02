import type { Product } from '@/types';
import raw from './catalogue.json';

/**
 * Telstra Plus Rewards Store catalogue, generated from the supplied enriched
 * product feed (in-stock items, de-duplicated by name). Images are served
 * from telstra.com.au.
 */
export const catalogue: Product[] = raw as Product[];

const byId = new Map(catalogue.map((p) => [p.id, p]));

/** Look up a product by SKU. Throws in dev if a scripted SKU is missing. */
export function product(id: string): Product {
  const p = byId.get(id);
  if (!p) throw new Error(`Unknown catalogue SKU ${id}`);
  return p;
}

export const products = (ids: string[]): Product[] => ids.map(product);

/**
 * Curated "most redeemed" sets per category (feed categorisation is noisy, e.g.
 * landline handsets under Home Office). Used first; the generic pull fills gaps.
 */
const curatedByCategory: Record<string, string[]> = {
  'Home Office': ['23170', '27349', '25869', '27351'],
  Gaming: ['26165', '25125', '23034', '23031'],
  Headphones: ['25250', '27447', '23746', '27448'],
  Speakers: ['25408', '26729', '25450', '25445'],
  'Mobiles Accessories': ['23014', '27666', '24069', '20980'],
  'Gift Cards': ['24785', '23146', '26346', '23805'],
};

/**
 * Real-time picks for a category the member has shown affinity for: rewards
 * fully within balance first, then Points + Pay-eligible items. Deduped by name.
 */
export function affinityPicks(category: string, balance: number, count = 4): Product[] {
  const curated = (curatedByCategory[category] ?? []).map(product);
  const seen = new Set(curated.map((p) => p.name));
  const inCat = catalogue.filter((p) => p.category === category && !seen.has(p.name) && seen.add(p.name));
  // Curated order first (most-redeemed story), then within-balance, then Points + Pay-eligible fillers.
  const fill = [
    ...inCat.filter((p) => p.points <= balance).sort((a, b) => b.points - a.points),
    ...inCat.filter((p) => p.points > balance && p.dollars).sort((a, b) => a.points - b.points),
  ];
  return [...curated, ...fill].slice(0, count);
}

/** Map feed categories onto the shorter labels used in the Rewards Store. */
export const categoryLabel: Record<string, string> = {
  'Mobiles Accessories': 'Accessories',
  Headphones: 'Headphones',
  'Fitness Health and Wellbeing': 'Fitness & health',
  Gaming: 'Gaming',
  Speakers: 'Speakers',
  'Smart Home': 'Smart home',
  'Home Office': 'Home office',
  'Home Appliances': 'Home',
  'Tablets iPads and e-Readers': 'Tablets',
  'Kids and Toys': 'Kids & toys',
  'Drones Cameras and Accessories': 'Cameras',
  'Gift Cards': 'Gift cards',
  'Car Accessories': 'Car',
  Internet: 'Internet',
  'Smart Glasses': 'Smart glasses',
  'Prepaid Mobile Services': 'Pre-Paid',
  'Streaming Services': 'Streaming',
  'Backpacks and Travel Accessories': 'Travel',
  Laptops: 'Laptops',
  'Pet Accessories': 'Pets',
  'SIM Only Mobile Services': 'SIM plans',
  'Support a cause': 'Donate',
};

/**
 * Demo-only Points + Pay split: use up to the member's balance in points and
 * pay the proportional remainder in cash. Minimum 5,000 points.
 */
export function pointsPlusPay(p: Product, balance: number) {
  const points = Math.min(balance, p.points);
  const cash = p.dollars ? Math.round(p.dollars * (1 - points / p.points) * 100) / 100 : 0;
  return {
    points,
    cash,
    earn: Math.floor(cash * 10),
    eligible: points >= Math.min(5000, p.points) && (p.dollars ?? 0) > 0,
  };
}

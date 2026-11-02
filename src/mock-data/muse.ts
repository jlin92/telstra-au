import type { AppUserId, MusePrompt, MuseReply, ProactiveNudge } from '@/types';

/* ================================================================== */
/* PERSONA 1 — Alex · NEW MEMBER (education + guided discovery)         */
/* ================================================================== */

const alexScripts: Record<string, MuseReply> = {
  'how-it-works': {
    kind: 'support',
    text: 'Welcome to Telstra Plus, Alex. Here’s how it works in three steps:',
    bullets: [
      'Earn 10 points for every $1 on eligible Telstra spend — your monthly bill counts.',
      'Use points in the Rewards Store on tech, gift cards, movie tickets and more.',
      'Not enough points yet? Points + Pay lets you combine points with a payment on selected rewards.',
    ],
    chips: ['New member', 'Points basics'],
    followups: ['What can I get with my points?', 'How do I earn points faster?', 'What is Points + Pay?'],
  },
  within: {
    kind: 'commerce',
    text: 'Here are popular first rewards that are fully covered by your 12,400 points — no payment needed.',
    chips: ['Within 12,400 pts', 'Popular with new members'],
    results: ['25250', '24785', '27666'],
    reasons: ['Top first redemption for new members', 'Everyday value, 6,500 pts', 'Handy for your desk set-up'],
    followups: ['Upgrade my home office', 'Show me gaming rewards', 'What is Points + Pay?'],
  },
  'home-office': {
    kind: 'commerce',
    text: 'Happy to help with your home office. Which part would you like to improve first?',
    chips: ['Guided discovery'],
    followups: ['A better keyboard and mouse', 'Headphones for calls', 'Tidy up my desk'],
  },
  'office-input': {
    kind: 'commerce',
    text: 'These are the most-redeemed home-office picks. The Logitech set is above your balance today, but Points + Pay lets you use all 12,400 points and pay the rest.',
    chips: ['Home office', 'Points + Pay available'],
    results: ['27349', '27350', '27666'],
    reasons: ['Most redeemed mouse in Home Office', 'Pairs with the MX Anywhere', 'Fully covered by your points'],
    followups: ['What is Points + Pay?', 'Show me something within my points', 'Headphones for calls'],
  },
  'office-audio': {
    kind: 'commerce',
    text: 'For calls and focus, these headphones are popular with members who work from home.',
    chips: ['Home office', 'Headphones'],
    results: ['25250', '23746', '27448'],
    reasons: ['Within your points today', 'Lightweight for all-day calls', 'Over-ear, Points + Pay available'],
    followups: ['A better keyboard and mouse', 'How do I earn points faster?'],
  },
  'office-desk': {
    kind: 'commerce',
    text: 'Small upgrades that make a desk feel finished — all within your points.',
    chips: ['Within 12,400 pts', 'Home office'],
    results: ['23014', '27666', '24069'],
    reasons: ['Fully covered by points', 'Replace that frayed cable', 'Useful adaptor, 7,000 pts'],
    followups: ['A better keyboard and mouse', 'What is Points + Pay?'],
  },
  gaming: {
    kind: 'commerce',
    text: 'Gamers on Telstra Plus often start with digital codes and memberships — they’re low-points and instant.',
    chips: ['Gaming', 'Instant delivery'],
    results: ['26165', '25125', '23031'],
    reasons: ['4,900 pts · instant code', 'Within your points', 'Points + Pay available'],
    followups: ['Upgrade my home office', 'How do I earn points faster?'],
  },
  'points-plus-pay': {
    kind: 'support',
    text: 'Points + Pay lets you use the points you have and pay the remaining amount on selected rewards.',
    bullets: [
      'Apply your available points at checkout and pay the balance by card.',
      'You still earn 10 points per $1 on the eligible cash part.',
      'Minimum points apply and it’s not available on every reward.',
    ],
    chips: ['Points + Pay', 'Earn while you redeem'],
    followups: ['Show me rewards with Points + Pay', 'Show me something within my points'],
  },
  'ppp-rewards': {
    kind: 'commerce',
    text: 'These are popular rewards where Points + Pay would get you there today.',
    chips: ['Points + Pay', 'Use all 12,400 pts'],
    results: ['27349', '23746', '27687'],
    reasons: ['12,400 pts + $109 (demo)', '12,400 pts + $69 (demo)', '12,400 pts + $49 (demo)'],
    followups: ['What is Points + Pay?', 'How do I earn points faster?'],
  },
  earn: {
    kind: 'support',
    text: 'The simplest way to build your balance is through your Telstra bill — then add a few boosters:',
    bullets: [
      'Your bill earns 10 points per $1 automatically (around 650 points a month on your plan).',
      'Link an eligible Visa or Mastercard to earn at Shop and Earn retailers.',
      'Earn 10 points per $1 on eligible discounted movie tickets.',
      'Watch for bonus-point offers in the app.',
    ],
    chips: ['Earn faster', 'Shop and Earn'],
    action: { label: 'See ways to earn', chapter: 6 },
    followups: ['What can I get with my points?', 'What is Points + Pay?'],
  },
  expiry: {
    kind: 'support',
    text: 'Telstra Plus points expire three years after they’re earned, so your new balance is safe for a long while.',
    chips: ['Points expiry'],
    followups: ['What can I get with my points?', 'How do I earn points faster?'],
  },
};

const alexRules: { match: RegExp; key: string }[] = [
  { match: /(how.*(work|start)|what is telstra plus|new member|explain)/i, key: 'how-it-works' },
  { match: /(what is points \+ pay|points \+ pay\?|what.*points.*pay|explain.*pay)/i, key: 'points-plus-pay' },
  { match: /(with points \+ pay|rewards with points|points \+ pay rewards)/i, key: 'ppp-rewards' },
  { match: /(keyboard|mouse|input)/i, key: 'office-input' },
  { match: /(headphone|call|audio|focus)/i, key: 'office-audio' },
  { match: /(desk|tidy|cable|mat)/i, key: 'office-desk' },
  { match: /(home office|office|work from home|wfh|setup|set up)/i, key: 'home-office' },
  { match: /(gaming|game|xbox|playstation|nintendo|switch)/i, key: 'gaming' },
  { match: /(earn|faster|build|more points|link)/i, key: 'earn' },
  { match: /(expire|expiry)/i, key: 'expiry' },
  { match: /(within|under|afford|what can i get|my points|balance|cheap)/i, key: 'within' },
];

/* ================================================================== */
/* PERSONA 2 — Sarah · GOLD FAMILY MEMBER (reactivation + value)        */
/* ================================================================== */

const sarahScripts: Record<string, MuseReply> = {
  expiring: {
    kind: 'commerce',
    text: 'You have 22,000 points expiring on 31 Dec and 186,500 in total — plenty for something the whole family will use. These are fully covered by points:',
    chips: ['22,000 pts expiring', 'Gold member', 'Fully covered by points'],
    results: ['27738', '27689', '27609'],
    reasons: ['Top smart-home pick for families', 'Backyard and holidays', 'For Liam · popular kids’ tech'],
    followups: ['Something for the kids', 'Plan a family movie night', 'Can I use points on my bill?'],
  },
  kids: {
    kind: 'commerce',
    text: 'Here are kids’ rewards families like yours redeem most. All within your points, so nothing to pay.',
    chips: ['Kids & toys', 'Fully covered by points'],
    results: ['27609', '25870', '27106'],
    reasons: ['Most-redeemed kids’ tech this month', 'Learning bundle, 32,600 pts', 'Great for camping trips'],
    followups: ['Upgrade our smart home', 'Plan a family movie night', 'Tech for our next trip'],
  },
  'smart-home': {
    kind: 'commerce',
    text: 'A few smart-home upgrades that fit a busy household — you could get all three and still have 100,000+ points left.',
    chips: ['Smart home', 'Fully covered by points'],
    results: ['27738', '25876', '22431'],
    reasons: ['See who’s at the door from anywhere', 'Pairs with the Ring doorbell', 'Schedule lights and devices'],
    followups: ['Something for the kids', 'Tech for our next trip', 'What are my Gold benefits?'],
  },
  movies: {
    kind: 'commerce',
    text: 'As a Gold member you get up to 50% off tickets at participating cinemas, and you can cover tickets with points too.',
    chips: ['Gold benefit', 'Family night out'],
    results: ['26346', '24785', '23146'],
    reasons: ['Tickets from 6,500 pts', 'Snacks for movie night at home', 'Dinner delivered first'],
    action: { label: 'See all member benefits', chapter: 7 },
    followups: ['Something for the kids', 'What are my Gold benefits?'],
  },
  travel: {
    kind: 'commerce',
    text: 'Planning a trip? Start your booking from Telstra Plus to earn 10 points per $1 with TRAVLR, and pack these — all within your points.',
    chips: ['Travel', 'Earn 10 pts per $1 on bookings'],
    results: ['27114', '25721', '27033'],
    reasons: ['Carry-on friendly backpack', 'Charge on the go', 'Waterproof, for the beach'],
    action: { label: 'See travel earning', chapter: 6 },
    followups: ['What are my Gold benefits?', 'Upgrade our smart home'],
  },
  'gold-benefits': {
    kind: 'support',
    text: 'As a Gold member you have a few benefits that others don’t:',
    bullets: [
      'SmartDelay — free airport lounge access if a registered international flight is delayed 60+ minutes.',
      'VIP service by messaging us in the My Telstra app.',
      'Earlier access to selected pre-sales, and 50% off selected Fetch titles.',
      'Plus everything members get: discounted movie tickets and the 7-Eleven fuel offer.',
    ],
    chips: ['Gold only'],
    action: { label: 'See all benefits', chapter: 7 },
    followups: ['Tech for our next trip', 'Plan a family movie night'],
  },
  bill: {
    kind: 'support',
    text: 'Yes — eligible members can use points for a monthly discount on an eligible Telstra service.',
    bullets: [
      'Minimum points and eligibility criteria apply.',
      'The discount ends early if you cancel or change the service outside its plan family.',
      'Many Gold members prefer rewards for the family and keep bills earning points.',
    ],
    chips: ['Bill discounts'],
    followups: ['Something for the kids', 'Show me rewards fully covered by points'],
  },
  earn: {
    kind: 'support',
    text: 'Your household already earns around 3,200 points a month. To boost it:',
    bullets: [
      'Book travel through Telstra Plus and TRAVLR for 10 points per $1.',
      'Convert ALL Accor Reward points (minimum 2,000) into Telstra Plus points.',
      'Your linked Mastercard earns at Shop and Earn retailers automatically.',
    ],
    chips: ['Earn faster', 'Partners'],
    action: { label: 'See ways to earn', chapter: 6 },
    followups: ['Tech for our next trip', 'What are my Gold benefits?'],
  },
  expiry: {
    kind: 'support',
    text: 'Points expire three years after they’re earned. Your oldest 22,000 points expire on 31 Dec — using them first is the smart move.',
    chips: ['Points expiry'],
    followups: ['Show me rewards fully covered by points', 'Something for the kids'],
  },
};

const sarahRules: { match: RegExp; key: string }[] = [
  { match: /(kid|child|liam|toy|school|learn)/i, key: 'kids' },
  { match: /(smart home|doorbell|camera|security|plug|home)/i, key: 'smart-home' },
  { match: /(movie|cinema|night out|film)/i, key: 'movies' },
  { match: /(travel|trip|holiday|flight|hotel|accor|pack)/i, key: 'travel' },
  { match: /(gold|benefit|lounge|vip|smartdelay)/i, key: 'gold-benefits' },
  { match: /(bill|discount|service)/i, key: 'bill' },
  { match: /(earn|faster|more points)/i, key: 'earn' },
  { match: /(expire|expiry|lose)/i, key: 'expiry' },
  { match: /(within|covered|use my points|what can i get|spend|idle)/i, key: 'expiring' },
];

/* ================================================================== */
/* Exports                                                             */
/* ================================================================== */

const scriptsByUser: Record<AppUserId, Record<string, MuseReply>> = { 1: alexScripts, 2: sarahScripts };
const rulesByUser: Record<AppUserId, { match: RegExp; key: string }[]> = { 1: alexRules, 2: sarahRules };

export const musePromptsByUser: Record<AppUserId, MusePrompt[]> = {
  1: [
    { id: 'a1', label: 'How does Telstra Plus work?', icon: 'school', intent: 'how-it-works' },
    { id: 'a2', label: 'What can I get with my points?', icon: 'redeem', intent: 'within' },
    { id: 'a3', label: 'Upgrade my home office', icon: 'desk', intent: 'home-office' },
    { id: 'a4', label: 'What is Points + Pay?', icon: 'payments', intent: 'points-plus-pay' },
    { id: 'a5', label: 'Show me gaming rewards', icon: 'sports_esports', intent: 'gaming' },
    { id: 'a6', label: 'How do I earn points faster?', icon: 'trending_up', intent: 'earn' },
  ],
  2: [
    { id: 's1', label: 'Use my expiring points', icon: 'hourglass_top', intent: 'expiring' },
    { id: 's2', label: 'Something for the kids', icon: 'toys', intent: 'kids' },
    { id: 's3', label: 'Upgrade our smart home', icon: 'home_iot_device', intent: 'smart-home' },
    { id: 's4', label: 'Plan a family movie night', icon: 'local_movies', intent: 'movies' },
    { id: 's5', label: 'Tech for our next trip', icon: 'luggage', intent: 'travel' },
    { id: 's6', label: 'What are my Gold benefits?', icon: 'workspace_premium', intent: 'gold-benefits' },
  ],
};

export const proactiveNudgeByUser: Record<AppUserId, ProactiveNudge> = {
  1: {
    text: 'Hi Alex, welcome to Telstra Plus! You’ve already got 12,400 points. Want a quick tour of how to earn and use them?',
    cta: 'Show me how it works',
    intent: 'how-it-works',
  },
  2: {
    text: 'Hi Sarah — 22,000 of your points expire on 31 Dec. Want me to find rewards for the family that are fully covered by your points?',
    cta: 'Find rewards for my family',
    intent: 'expiring',
  },
};

const fallbackByUser: Record<AppUserId, MuseReply> = {
  1: {
    kind: 'support',
    text: 'I can explain how Telstra Plus works, find rewards within your points, or help you set up your home office. Try one of these:',
    followups: ['How does Telstra Plus work?', 'What can I get with my points?', 'Upgrade my home office'],
  },
  2: {
    kind: 'support',
    text: 'I can find rewards fully covered by your points, show your Gold benefits, or help plan a trip or movie night. Try one of these:',
    followups: ['Use my expiring points', 'Something for the kids', 'What are my Gold benefits?'],
  },
};

/** Resolve an assistant reply for a starter-prompt intent, per persona. */
export function replyForIntent(userId: AppUserId, intent: string): MuseReply {
  return scriptsByUser[userId]?.[intent] ?? fallbackByUser[userId];
}

/** Resolve an assistant reply for free-typed text, per persona. */
export function replyForText(userId: AppUserId, text: string): MuseReply {
  const rule = rulesByUser[userId]?.find((r) => r.match.test(text));
  if (rule) return scriptsByUser[userId][rule.key];
  return fallbackByUser[userId];
}

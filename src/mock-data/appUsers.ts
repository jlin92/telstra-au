import type { AppUserId, AppUserProfile } from '@/types';

/**
 * Two contrasting Telstra Plus members who share the same journey structure
 * (Home → Telstra Plus → discover → reward → redeem → earn) but see very
 * different content, recommendations and emphasis on every screen.
 *
 *  - Persona 1 (Alex): NEW member, 11 days in, Member tier, small balance.
 *    Lives alone, works from home, gamer. Needs education: how to earn, how to
 *    use points, what Points + Pay is. Sees starter rewards within reach and a
 *    home-office / gaming slant.
 *
 *  - Persona 2 (Sarah): LONG-STANDING Gold member with a family account and a
 *    large, idle balance (no redemption in 14 months, points expiring soon).
 *    Family, home and travel interests. Sees "use it or lose it" reactivation,
 *    family and smart-home rewards, Gold-only benefits and partner earning.
 *
 * All values are illustrative for demonstration only.
 */
export const appUserProfiles: Record<AppUserId, AppUserProfile> = {
  /* ------------------------------------------------------------------ */
  /* Persona 1 — Alex · New Telstra Plus member                          */
  /* ------------------------------------------------------------------ */
  1: {
    id: 1,
    name: 'Alex Nguyen',
    firstName: 'Alex',
    greeting: "G'day,",
    context: 'Joined Telstra Plus 11 days ago · One mobile plan · First visit to Telstra Plus · No browsing history yet.',
    tier: 'Member',
    points: 12400,
    yearSpend: 118,
    memberSince: 'Oct 2026',
    lastRedemption: 'Never redeemed',
    services: [
      { icon: 'smartphone', name: "Alex's iPhone", detail: '18.2GB/50GB used · 12 days left', usage: 36 },
    ],
    homeVariant: 'newMember',
    homePromo: {
      eyebrow: 'New to Telstra Plus',
      title: 'You’ve already earned 12,400 points',
      body: 'Your first bill payment and welcome bonus have landed. See how Telstra Plus works and what your points can get you.',
      cta: 'Explore Telstra Plus',
      chapter: 2,
      icon: 'celebration',
    },
    plusHero: {
      eyebrow: 'Welcome to Telstra Plus',
      title: 'Turn your points into something you’ll love',
      body: 'You earn 10 points for every $1 on eligible Telstra spend. Finish setting up to get the most out of your membership.',
      cta: 'See how it works',
      chapter: 8,
      icon: 'school',
    },
    onboarding: [
      { label: 'Join Telstra Plus', done: true, icon: 'loyalty', chapter: 2 },
      { label: 'Earn your first points', done: true, icon: 'paid', chapter: 6 },
      { label: 'Link a card for Shop and Earn', done: false, icon: 'credit_card', chapter: 6 },
      { label: 'Redeem your first reward', done: false, icon: 'redeem', chapter: 3 },
    ],
    education: [
      { icon: 'paid', title: 'Earn points', body: '10 points per $1 on eligible Telstra spend, like your monthly bill.', chapter: 6 },
      { icon: 'redeem', title: 'Use points', body: 'Redeem tech, gift cards and more in the Rewards Store.', chapter: 3 },
      { icon: 'payments', title: 'Points + Pay', body: 'Not enough points yet? Combine points with a payment on selected rewards.', chapter: 3 },
    ],
    picksTitle: 'Popular rewards within your 12,400 points',
    picksSubtitle: 'What new members redeem first — we’ll tailor these as you browse',
    // Generic cold-start set: gift cards, cinema, charger, cable, earbuds — no category lean.
    picks: ['24785', '26346', '23014', '27666', '25250', '23146'],
    rewardCategories: [
      { id: 'all', label: 'All', icon: 'apps' },
      { id: 'Gift Cards', label: 'Gift cards', icon: 'card_giftcard' },
      { id: 'Mobiles Accessories', label: 'Accessories', icon: 'cable' },
      { id: 'Headphones', label: 'Headphones', icon: 'headphones' },
      { id: 'Home Office', label: 'Home office', icon: 'desk' },
      { id: 'Gaming', label: 'Gaming', icon: 'sports_esports' },
      { id: 'Speakers', label: 'Speakers', icon: 'speaker' },
    ],
    withinPointsDefault: true,
    completeTheSet: ['27666', '27349', '23014'],
    bagAddons: ['27666', '23014', '24069'],
    earnTitle: 'Start building your balance',
    earnOptions: [
      { icon: 'receipt_long', title: 'Pay your Telstra bill', body: 'Earn 10 points per $1 on eligible mobile, internet and device payments — automatically.', tag: 'Every month', value: '≈ +650 pts/mth' },
      { icon: 'credit_card', title: 'Link a card for Shop and Earn', body: 'Link an eligible Visa or Mastercard in My Telstra and earn at participating retailers.', tag: 'Set up once' },
      { icon: 'storefront', title: 'Shop with Telstra', body: 'Earn 10 points per $1 on eligible accessories and devices, including Points + Pay purchases.', tag: 'Rewards Store' },
      { icon: 'local_movies', title: 'Discounted movie tickets', body: 'Save on tickets at participating cinemas and earn 10 points per $1 on eligible tickets.', tag: 'Member benefit' },
      { icon: 'bolt', title: 'Bonus-point offers', body: 'Keep an eye out for bonus points in the app and Rewards Store.', tag: 'Limited time' },
    ],
    benefits: [
      { icon: 'local_movies', title: 'Discounted movie tickets', body: 'Up to 50% off at HOYTS, Event, Village and independent cinemas.', tier: 'All' },
      { icon: 'confirmation_number', title: 'Pre-sale tickets', body: 'Early access to selected concerts, sport and theatre.', tier: 'All' },
      { icon: 'local_gas_station', title: '7-Eleven fuel offer', body: '6c per litre off Mobil fuel at eligible 7-Eleven stores.', tier: 'All' },
      { icon: 'emoji_events', title: 'Competitions', body: 'Go in the running to win tickets and bonus points.', tier: 'All' },
      { icon: 'lock', title: 'Silver & Gold benefits', body: 'Unlock earlier pre-sales, Fetch discounts and more as your eligible spend grows.', tier: 'Silver', tag: 'Spend $1,499+' },
    ],
    whyShownNow:
      'Alex joined Telstra Plus 11 days ago and this is his first look at the hub. With no behaviour yet, the experience leads with education and popular cold-start rewards that are fully within 12,400 points. As he browses in this session, his category affinity is updated in real time and the picks on the hub re-rank the moment he returns.',
    why: [
      { icon: 'celebration', label: 'Joined 11 days ago', detail: 'New-member audience; education before promotion.' },
      { icon: 'account_balance_wallet', label: '12,400 pts balance', detail: 'Rewards filtered to what Alex can get today.' },
      { icon: 'history_toggle_off', label: 'No browsing history', detail: 'Cold start on popularity until he browses.' },
      { icon: 'bolt', label: 'Real-time affinity', detail: 'Products viewed and categories tapped re-rank the hub picks instantly.' },
    ],
    brief: 'New member, Member tier, one mobile service, 12,400 pts. First visit — no affinity yet; builds it live as he browses.',
    demoObjectives: [
      'Educate a new member on earn / use / Points + Pay in context.',
      'Cold-start picks within a small balance, then real-time re-ranking from in-session browsing.',
      'Guided discovery with the assistant (home-office setup).',
      'First redemption via the Points + Pay slider, then a next-reward goal.',
    ],
  },

  /* ------------------------------------------------------------------ */
  /* Persona 2 — Sarah · Gold member with idle points                    */
  /* ------------------------------------------------------------------ */
  2: {
    id: 2,
    name: 'Sarah Mitchell',
    firstName: 'Sarah',
    greeting: "G'day,",
    context: 'Gold member for 6 years · Family account (3 mobiles, nbn, Foxtel) · No redemption in 14 months.',
    tier: 'Gold',
    points: 186500,
    expiringPoints: { amount: 22000, when: '31 Dec' },
    yearSpend: 3860,
    memberSince: 'Mar 2020',
    lastRedemption: '14 months ago',
    services: [
      { icon: 'smartphone', name: "Sarah's iPhone", detail: '41GB/180GB used · 6 days left', usage: 23 },
      { icon: 'wifi', name: 'Home internet', detail: 'nbn · Unlimited data', usage: 100 },
      { icon: 'smartphone', name: "Liam's phone", detail: '27GB/40GB used · 6 days left', usage: 68 },
    ],
    homeVariant: 'returning',
    homePromo: {
      eyebrow: 'Telstra Plus · Gold',
      title: '22,000 points expire on 31 Dec',
      body: 'You have 186,500 points ready to use. Don’t let them go to waste — see rewards picked for your family.',
      cta: 'Use my points',
      chapter: 2,
      icon: 'hourglass_top',
    },
    plusHero: {
      eyebrow: 'Your points are ready',
      title: '186,500 points could get the whole family something',
      body: 'It’s been a while since your last reward. Smart home, kids’ tech and family nights out — all fully covered by points.',
      cta: 'See rewards for your family',
      chapter: 3,
      icon: 'family_restroom',
    },
    picksTitle: 'Picked for your family, fully covered by points',
    picksSubtitle: 'Based on your household, Gold status and what you’ve browsed',
    picks: ['27738', '27609', '27033', '26346', '25870', '27689'],
    rewardCategories: [
      { id: 'all', label: 'All', icon: 'apps' },
      { id: 'Kids and Toys', label: 'Kids & toys', icon: 'toys' },
      { id: 'Smart Home', label: 'Smart home', icon: 'home_iot_device' },
      { id: 'Speakers', label: 'Speakers', icon: 'speaker' },
      { id: 'Gift Cards', label: 'Gift cards', icon: 'card_giftcard' },
      { id: 'Backpacks and Travel Accessories', label: 'Travel', icon: 'luggage' },
      { id: 'Fitness Health and Wellbeing', label: 'Fitness', icon: 'fitness_center' },
    ],
    withinPointsDefault: true,
    completeTheSet: ['25876', '22431', '27754'],
    bagAddons: ['22431', '24785', '26346'],
    earnTitle: 'More ways to earn as a Gold member',
    earnOptions: [
      { icon: 'flight_takeoff', title: 'Travel bookings with TRAVLR', body: 'Earn 10 points per $1 on eligible hotels, flights and car hire when you start from Telstra Plus.', tag: 'Partner', value: '≈ +32,000 pts on a $3,200 trip' },
      { icon: 'hotel', title: 'Convert ALL Accor points', body: 'Turn ALL Accor Reward points into Telstra Plus points (min 2,000 Accor points).', tag: 'Partner' },
      { icon: 'local_movies', title: 'Family movie nights', body: 'Discounted tickets at participating cinemas, plus 10 points per $1 on eligible tickets.', tag: 'Gold benefit' },
      { icon: 'credit_card', title: 'Shop and Earn', body: 'Your linked Mastercard earns at participating retailers — the best points offer is applied automatically.', tag: 'Linked ✓' },
      { icon: 'receipt_long', title: 'Your household bills', body: 'Three mobiles, nbn and Foxtel already earn you around 3,200 points a month.', tag: 'Every month', value: '≈ +3,200 pts/mth' },
    ],
    benefits: [
      { icon: 'flight', title: 'SmartDelay lounge access', body: 'Free airport lounge access if your registered international flight is delayed 60+ minutes.', tier: 'Gold', tag: 'Gold only' },
      { icon: 'support_agent', title: 'VIP service', body: 'Priority support by messaging us in the My Telstra app.', tier: 'Gold', tag: 'Gold only' },
      { icon: 'confirmation_number', title: 'Earlier pre-sale access', body: 'Get in first for selected concerts and events.', tier: 'Gold', tag: 'Gold only' },
      { icon: 'live_tv', title: 'Fetch Store discounts', body: '50% off selected movies and shows on Fetch.', tier: 'Gold' },
      { icon: 'local_movies', title: 'Discounted movie tickets', body: 'Up to 50% off at HOYTS, Event, Village and independent cinemas.', tier: 'All' },
      { icon: 'local_gas_station', title: '7-Eleven fuel offer', body: '6c per litre off Mobil fuel at eligible 7-Eleven stores.', tier: 'All' },
    ],
    whyShownNow:
      'Sarah is a six-year Gold member with a family account and 186,500 unused points, 22,000 of which expire soon. She has not redeemed in 14 months, so the experience leads with reactivation and “use it or lose it” urgency, surfaces family, smart-home and entertainment rewards that are fully covered by points, and promotes Gold-only benefits and partner earning (travel, Accor) that match her household.',
    why: [
      { icon: 'hourglass_top', label: '22,000 pts expiring', detail: 'Expiry drives urgency and the home promo.' },
      { icon: 'history_toggle_off', label: 'No redemption in 14 months', detail: 'Lapsed-redeemer audience; reactivation treatment.' },
      { icon: 'family_restroom', label: 'Family household', detail: '3 mobiles + nbn + Foxtel; kids & smart-home affinity.' },
      { icon: 'workspace_premium', label: 'Gold tier · $3,860 spend', detail: 'Gold benefits and partner earning surfaced.' },
    ],
    brief: 'Gold member, family account, 186,500 pts idle with 22,000 expiring. Family, smart home and travel interests. Needs a reason to redeem.',
    demoObjectives: [
      'Reactivate a lapsed redeemer with expiry urgency.',
      'Show high-value family & smart-home rewards fully covered by points.',
      'Surface Gold-only benefits and partner earning (travel, Accor).',
      'Full-points redemption and a “what next” goal.',
    ],
  },
};

export const appUserProfileById = (id: AppUserId): AppUserProfile => appUserProfiles[id];

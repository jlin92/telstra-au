import type { Settings } from '@/types';

/** Global demo settings and compliant disclaimer copy for the Telstra Plus prototype. */
export const settings: Settings = {
  appName: 'My Telstra',
  poweredBy: 'Telstra Plus assistant, powered by Dynamic Yield Shopping Muse',
  disclaimers: {
    illustrative:
      'All balances, tiers, rewards, points prices and offers shown are illustrative and for demonstration only.',
    programmeRules:
      'Eligibility criteria apply to join Telstra Plus. Rewards, availability and points prices can change. Telstra Plus T&Cs apply.',
    pointsPlusPay:
      'Points + Pay is available on selected rewards. Minimum points apply. Earn 10 points per $1 on the eligible cash component. Demo calculation only.',
    expiry: 'Telstra Plus points expire three years after they are earned.',
  },
};

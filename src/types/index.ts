/* ------------------------------------------------------------------ */
/* Demo chapters                                                       */
/* ------------------------------------------------------------------ */

export type ChapterKey =
  | 'home'
  | 'plus'
  | 'rewards'
  | 'detail'
  | 'bag'
  | 'earn'
  | 'benefits'
  | 'muse';

export interface Chapter {
  id: number;
  key: ChapterKey;
  title: string;
  copy: string;
  icon: string;
}

/* ------------------------------------------------------------------ */
/* Personas                                                            */
/* ------------------------------------------------------------------ */

export type AppUserId = 1 | 2;
export type Tier = 'Member' | 'Silver' | 'Gold';

/** A single "Why shown now" reason surfaced in the left panel. */
export interface WhyReason {
  icon: string;
  label: string;
  detail: string;
}

export interface ServiceSummary {
  icon: string;
  name: string;
  detail: string;
  /** Usage percentage for the ring (0-100). */
  usage: number;
}

export interface OnboardingStep {
  label: string;
  done: boolean;
  icon: string;
  /** Chapter to jump to when tapping Start. */
  chapter: number;
}

export interface HeroModule {
  eyebrow: string;
  title: string;
  body: string;
  cta: string;
  /** Chapter opened by the CTA. */
  chapter: number;
  icon: string;
}

export interface EducationCard {
  icon: string;
  title: string;
  body: string;
  chapter: number;
}

export interface EarnOption {
  icon: string;
  title: string;
  body: string;
  tag: string;
  /** Optional illustrative points value, e.g. "+6,100 pts". */
  value?: string;
}

export interface BenefitItem {
  icon: string;
  title: string;
  body: string;
  tier: Tier | 'All';
  /** Shown as a small pill, e.g. "Gold only". */
  tag?: string;
}

export interface RewardCategory {
  id: string;
  label: string;
  icon: string;
}

/** Full Telstra Plus experience definition for one persona. */
export interface AppUserProfile {
  id: AppUserId;
  name: string;
  firstName: string;
  greeting: string;
  /** One-line situational context shown in presenter / why panel. */
  context: string;
  tier: Tier;
  points: number;
  /** Points expiring soon (illustrative). */
  expiringPoints?: { amount: number; when: string };
  /** Eligible spend this membership year, illustrative. */
  yearSpend: number;
  memberSince: string;
  lastRedemption: string;
  services: ServiceSummary[];
  homeVariant: 'newMember' | 'returning';
  /** Home-screen promo card beneath the tier card. */
  homePromo: HeroModule;
  /** Telstra Plus "For you" hero. */
  plusHero: HeroModule;
  onboarding?: OnboardingStep[];
  education?: EducationCard[];
  /** Section title above the personalised reward picks. */
  picksTitle: string;
  picksSubtitle: string;
  /** Catalogue SKUs for the personalised picks. */
  picks: string[];
  /** Ordered Rewards Store categories for this persona. */
  rewardCategories: RewardCategory[];
  /** Default "within my points" toggle on the Rewards Store. */
  withinPointsDefault: boolean;
  /** Complementary SKUs shown on the reward detail page. */
  completeTheSet: string[];
  /** Low-point add-ons shown in the bag. */
  bagAddons: string[];
  earnTitle: string;
  earnOptions: EarnOption[];
  benefits: BenefitItem[];
  /** Presenter: narrative + signals. */
  whyShownNow: string;
  why: WhyReason[];
  brief: string;
  demoObjectives: string[];
}

/* ------------------------------------------------------------------ */
/* Catalogue                                                           */
/* ------------------------------------------------------------------ */

export interface Product {
  id: string;
  name: string;
  brand: string;
  image: string;
  points: number;
  dollars: number | null;
  category: string;
  type: string;
  context: string;
}

/* ------------------------------------------------------------------ */
/* Shopping Muse (Telstra Plus assistant)                              */
/* ------------------------------------------------------------------ */

export interface MuseReply {
  /** 'support' renders as an FAQ answer; 'commerce' renders reward cards. */
  kind?: 'support' | 'commerce';
  text: string;
  bullets?: string[];
  chips?: string[];
  /** Catalogue SKUs to render as result cards. */
  results?: string[];
  /** Per-result personalisation reason (parallel to results). */
  reasons?: string[];
  followups?: string[];
  /** Optional action that jumps to a chapter. */
  action?: { label: string; chapter: number };
}

export interface MusePrompt {
  id: string;
  label: string;
  icon: string;
  intent: string;
}

export interface ProactiveNudge {
  text: string;
  cta: string;
  intent: string;
}

export interface MuseMessage extends MuseReply {
  id: string;
  role: 'user' | 'assistant';
}

/* ------------------------------------------------------------------ */
/* Settings                                                            */
/* ------------------------------------------------------------------ */

export interface Settings {
  appName: string;
  poweredBy: string;
  disclaimers: {
    illustrative: string;
    programmeRules: string;
    pointsPlusPay: string;
    expiry: string;
  };
}

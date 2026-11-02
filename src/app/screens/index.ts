import type { ComponentType } from 'react';
import { HomeScreen } from './HomeScreen';
import { PlusScreen } from './PlusScreen';
import { RewardsScreen } from './RewardsScreen';
import { DetailScreen } from './DetailScreen';
import { BagScreen } from './BagScreen';
import { EarnScreen } from './EarnScreen';
import { BenefitsScreen } from './BenefitsScreen';
import { MuseScreen } from './MuseScreen';

/** Chapter id → screen component. */
export const screenByChapter: Record<number, ComponentType> = {
  1: HomeScreen,
  2: PlusScreen,
  3: RewardsScreen,
  4: DetailScreen,
  5: BagScreen,
  6: EarnScreen,
  7: BenefitsScreen,
  8: MuseScreen,
};

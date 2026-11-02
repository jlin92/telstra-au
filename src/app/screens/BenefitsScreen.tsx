import { useDemo } from '@/app/DemoContext';
import { Screen } from './Screen';
import { ListRow } from '@/components/rewards/Primitives';
import { Icon } from '@/components/ui/Icon';
import { Disclaimer } from '@/components/ui/Card';
import { settings } from '@/mock-data/settings';
import { cn, formatAud } from '@/hooks/utils';

const tiers = [
  { name: 'Member', range: '$0 – $1,499', min: 0 },
  { name: 'Silver', range: '$1,499 – $2,999', min: 1499 },
  { name: 'Gold', range: '$3,000+', min: 3000 },
];

/** Chapter 7 — Member benefits, by tier. */
export function BenefitsScreen() {
  const { appUserProfile, showToast } = useDemo();
  const p = appUserProfile;
  const gold = p.tier === 'Gold';

  return (
    <Screen>
      <div className="flex flex-col gap-4 px-4 pt-4">
        <h1 className="font-heading text-[24px] font-bold text-on-surface">Your member benefits</h1>

        {/* Tier status */}
        <section className={cn('rounded-md p-4 shadow-card', gold ? 'bg-[#fff8e6]' : 'bg-white')}>
          <div className="flex items-center gap-3">
            <Icon name={gold ? 'workspace_premium' : 'loyalty'} filled className={cn('text-[36px]', gold ? 'text-telstra-gold' : 'text-primary')} />
            <div className="flex-1">
              <p className="font-heading text-[18px] font-bold text-on-surface">{p.tier} tier</p>
              <p className="text-[12px] text-on-surface-variant">
                {formatAud(p.yearSpend)} eligible spend this membership year · member since {p.memberSince}
              </p>
            </div>
          </div>
          <div className="mt-4 flex gap-1">
            {tiers.map((t) => {
              const reached = p.yearSpend >= t.min;
              return (
                <div key={t.name} className="flex-1">
                  <div className={cn('h-1.5 rounded-full', reached ? (gold ? 'bg-telstra-gold' : 'bg-primary') : 'bg-surface-container-high')} />
                  <p className={cn('mt-1 text-[11px] font-semibold', reached ? 'text-on-surface' : 'text-on-surface-variant')}>{t.name}</p>
                  <p className="text-[10px] text-on-surface-variant">{t.range}</p>
                </div>
              );
            })}
          </div>
          {!gold && (
            <p className="mt-3 text-[12px] text-on-surface-variant">
              Spend {formatAud(1499 - p.yearSpend)} more on eligible services this year to reach Silver.
            </p>
          )}
        </section>

        <section className="overflow-hidden rounded-md shadow-card">
          {p.benefits.map((b) => (
            <ListRow key={b.title} icon={b.icon} title={b.title} subtitle={b.body} tag={b.tag} onClick={() => showToast(`${b.title}: opens the benefit details`)} />
          ))}
        </section>

        <Disclaimer>
          Tier is based on eligible Telstra spend during your membership year. Benefits vary by tier and may change. {settings.disclaimers.programmeRules}
        </Disclaimer>
      </div>
    </Screen>
  );
}

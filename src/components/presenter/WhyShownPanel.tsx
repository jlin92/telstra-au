import { useDemo } from '@/app/DemoContext';
import { chapterById } from '@/app/chapters';
import { categoryLabel } from '@/mock-data/products';
import { Icon } from '@/components/ui/Icon';

/**
 * Left-side "Why shown now" panel. Opens when the customer taps "Why this?"
 * on a personalised module and explains the signals behind what the
 * currently selected member is seeing.
 */
export function WhyShownPanel({ onClose }: { onClose?: () => void }) {
  const { appUserProfile, chapter, affinity } = useDemo();
  const { name, context, why, whyShownNow } = appUserProfile;
  const screen = chapterById(chapter);
  const liveSignals = Object.entries(affinity).sort((a, b) => b[1] - a[1]);

  const treatment = (() => {
    const isNew = appUserProfile.homeVariant === 'newMember';
    switch (screen.key) {
      case 'home':
        return isNew ? 'New-member welcome card · points-balance personalisation' : 'Expiry-urgency promo · lapsed-redeemer audience';
      case 'plus':
        return isNew
          ? liveSignals.length
            ? `Education-led hub · picks re-ranked in real time to ${categoryLabel[liveSignals[0][0]] ?? liveSignals[0][0]} from this session's browsing`
            : 'Education-led hub · onboarding checklist · generic popularity picks within balance (no affinity yet)'
          : 'Reactivation hero · family & smart-home picks · Gold benefits';
      case 'rewards':
        return isNew ? 'Category order by early affinity · cheapest-first within balance' : 'Category order by household · high-value within balance first';
      case 'detail':
        return isNew ? 'Balance-aware PDP · Points + Pay default · complete-your-set recs' : 'Full-points redemption · goes-well-with recs';
      case 'bag':
        return 'Low-point add-ons · compatibility rules · post-redemption next goal';
      case 'earn':
        return isNew ? 'Bill-first earning · card-link nudge' : 'Partner earning (TRAVLR, Accor) · Gold benefits';
      case 'benefits':
        return 'Tier-aware benefit list and progress';
      default:
        return isNew ? 'Proactive education nudge · guided discovery prompts' : 'Proactive expiry nudge · affinity-led prompts';
    }
  })();

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wide text-primary">Why shown now</p>
          <h2 className="text-lg font-extrabold text-ink">{name}</h2>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close why shown now"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/[0.06] text-ink"
          >
            ✕
          </button>
        )}
      </div>

      <p className="text-xs leading-relaxed text-muted">{context}</p>

      <div className="rounded-2xl border border-primary/20 bg-primary-fixed p-3">
        <p className="text-xs font-bold text-primary">On this screen · {screen.title}</p>
        <p className="mt-1 text-xs leading-relaxed text-ink">{treatment}</p>
      </div>

      <div className="rounded-2xl border border-black/[0.06] bg-white p-3">
        <p className="text-xs font-bold text-ink">Why this, right now</p>
        <p className="mt-1 text-xs leading-relaxed text-muted">{whyShownNow}</p>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Live session signals</p>
        {liveSignals.length === 0 ? (
          <p className="rounded-xl border border-dashed border-black/[0.12] bg-white/60 p-3 text-[11px] text-muted">
            Nothing yet — picks are generic / popularity-based. Browse a reward or category and come back.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-1.5">
            {liveSignals.map(([cat, score], i) => (
              <li
                key={cat}
                className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold ${i === 0 ? 'bg-primary text-white' : 'bg-white text-ink shadow-sm'}`}
              >
                <Icon name="bolt" filled className="text-[12px]" />
                {categoryLabel[cat] ?? cat} · {score}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-[11px] font-bold uppercase tracking-wide text-muted">Signals considered</p>
        {why.map((reason) => (
          <div key={reason.label} className="flex items-start gap-3 rounded-xl border border-black/[0.06] bg-white p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-fixed text-primary">
              <Icon name={reason.icon} filled className="text-lg" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-ink">{reason.label}</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-muted">{reason.detail}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-auto text-[10px] leading-relaxed text-muted">
        Reasoning is illustrative. Dynamic Yield selects and tests the experience; Shopping Muse handles conversational discovery against the Rewards Store feed.
      </p>
    </div>
  );
}

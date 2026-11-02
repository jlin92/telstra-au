import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDemo } from '@/app/DemoContext';
import type { MuseMessage, MuseReply } from '@/types';
import { musePromptsByUser, proactiveNudgeByUser, replyForIntent, replyForText } from '@/mock-data/muse';
import { products } from '@/mock-data/products';
import { RewardCard } from '@/components/rewards/RewardCard';
import { Icon } from '@/components/ui/Icon';
import { cn } from '@/hooks/utils';

let msgSeq = 0;
const nextId = () => `m-${++msgSeq}`;

/** Assistant intents that signal a category interest. */
const intentCategory: Record<string, string> = {
  'home-office': 'Home Office',
  'office-input': 'Home Office',
  'office-desk': 'Home Office',
  'office-audio': 'Headphones',
  gaming: 'Gaming',
  kids: 'Kids and Toys',
  'smart-home': 'Smart Home',
  travel: 'Backpacks and Travel Accessories',
};

/** Chapter 8 — Telstra Plus assistant (Shopping Muse): education + guided reward discovery. */
export function MuseScreen() {
  const { appUser, appUserProfile, goToChapter, trackAffinity } = useDemo();
  const prompts = musePromptsByUser[appUser];
  const nudge = proactiveNudgeByUser[appUser];
  const [messages, setMessages] = useState<MuseMessage[]>([]);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  // Fresh conversation whenever the persona changes.
  useEffect(() => {
    setMessages([]);
    setTyping(false);
    setInput('');
  }, [appUser]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text: string, reply: MuseReply, intent?: string) => {
    if (intent && intentCategory[intent]) trackAffinity(intentCategory[intent], 1);
    setMessages((prev) => [...prev, { id: nextId(), role: 'user', text }]);
    setInput('');
    setTyping(true);
    const t = window.setTimeout(() => {
      setTyping(false);
      setMessages((prev) => [...prev, { id: nextId(), role: 'assistant', ...reply }]);
    }, 1000);
    timers.current.push(t);
  };

  const onPrompt = (label: string, intent: string) => send(label, replyForIntent(appUser, intent), intent);
  const onFollowup = (label: string) => {
    const reply = replyForText(appUser, label);
    const intent = Object.keys(intentCategory).find((k) => replyForIntent(appUser, k) === reply);
    send(label, reply, intent);
  };
  const onSubmit = () => {
    const q = input.trim();
    if (!q) return;
    const reply = replyForText(appUser, q);
    const intent = Object.keys(intentCategory).find((k) => replyForIntent(appUser, k) === reply);
    send(q, reply, intent);
  };

  const empty = messages.length === 0 && !typing;

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-surface">
      <div ref={scrollRef} className="no-scrollbar flex-1 overflow-y-auto px-4 py-4">
        <div className="mb-4 flex flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full muse-gradient text-white shadow-float">
            <Icon name="auto_awesome" filled className="text-[28px]" />
          </span>
          <h2 className="mt-2 font-heading text-[20px] font-bold text-on-surface">Telstra Plus assistant</h2>
          <p className="mt-0.5 max-w-[17rem] text-xs text-on-surface-variant">
            Ask about points, benefits or find rewards — in your own words.
          </p>
          <span className="mt-1.5 rounded-full bg-white px-2.5 py-0.5 text-[10px] font-semibold text-on-surface-variant shadow-card">
            Powered by Dynamic Yield Shopping Muse
          </span>
        </div>

        {empty && (
          <div className="flex flex-col gap-4">
            <div className="flex items-start gap-2">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full muse-gradient text-white">
                <Icon name="auto_awesome" filled className="text-[15px]" />
              </span>
              <div className="flex flex-col items-start gap-2 rounded-2xl rounded-tl-md bg-white px-4 py-3 shadow-card">
                <p className="text-sm text-on-surface">{nudge.text}</p>
                <button
                  type="button"
                  onClick={() => onPrompt(nudge.cta, nudge.intent)}
                  className="rounded-md bg-primary px-3.5 py-2 text-[12px] font-semibold text-white"
                >
                  {nudge.cta}
                </button>
              </div>
            </div>

            <p className="text-center text-xs font-semibold text-on-surface-variant">Hi {appUserProfile.firstName} — or try one of these</p>
            <div className="grid grid-cols-2 gap-2.5">
              {prompts.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onPrompt(p.label, p.intent)}
                  className="flex flex-col gap-2 rounded-md bg-white p-3 text-left shadow-card transition-transform active:scale-[0.98]"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-md bg-primary-fixed text-primary">
                    <Icon name={p.icon} className="text-[20px]" />
                  </span>
                  <span className="text-xs font-semibold leading-tight text-on-surface">{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {messages.map((m) =>
            m.role === 'user' ? (
              <div key={m.id} className="flex justify-end">
                <div className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm font-medium text-white">{m.text}</div>
              </div>
            ) : (
              <div key={m.id} className="flex flex-col gap-2.5">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full muse-gradient text-white">
                    <Icon name="auto_awesome" filled className="text-[15px]" />
                  </span>
                  <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-white px-4 py-2.5 text-sm text-on-surface shadow-card">
                    {m.kind === 'support' && (
                      <span className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                        <Icon name="school" className="text-[13px]" />
                        Telstra Plus help
                      </span>
                    )}
                    {m.text}
                    {m.bullets && (
                      <ul className="mt-2 flex flex-col gap-1.5">
                        {m.bullets.map((b) => (
                          <li key={b} className="flex items-start gap-1.5 text-[13px] text-on-surface-variant">
                            <Icon name="check_circle" filled className="mt-0.5 text-[14px] text-success" />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {m.chips && (
                  <div className="ml-9 flex flex-wrap gap-1.5">
                    {m.chips.map((c) => (
                      <span key={c} className="flex items-center gap-1 rounded-full bg-primary-fixed px-2.5 py-1 text-[10px] font-semibold text-primary">
                        <Icon name="insights" className="text-[12px]" />
                        {c}
                      </span>
                    ))}
                  </div>
                )}

                {m.results && (
                  <div className="ml-9 flex flex-col gap-2">
                    {products(m.results).map((r, i) => (
                      <RewardCard key={r.id} product={r} index={i} variant="row" reason={m.reasons?.[i]} />
                    ))}
                  </div>
                )}

                {m.action && (
                  <div className="ml-9">
                    <button
                      type="button"
                      onClick={() => goToChapter(m.action!.chapter)}
                      className="flex items-center gap-1.5 rounded-md border border-primary bg-white px-3.5 py-2 text-[12px] font-semibold text-primary"
                    >
                      {m.action.label}
                      <Icon name="arrow_forward" className="text-[15px]" />
                    </button>
                  </div>
                )}

                {m.followups && (
                  <div className="ml-9 flex flex-wrap gap-2">
                    {m.followups.map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => onFollowup(f)}
                        className="rounded-full border border-primary/40 bg-white px-3 py-1.5 text-[11px] font-semibold text-primary shadow-card"
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ),
          )}

          <AnimatePresence>
            {typing && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full muse-gradient text-white">
                  <Icon name="auto_awesome" filled className="text-[15px]" />
                </span>
                <div className="flex items-center gap-1 rounded-2xl rounded-tl-md bg-white px-4 py-3 shadow-card">
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-on-surface-variant" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-on-surface-variant" />
                  <span className="typing-dot h-1.5 w-1.5 rounded-full bg-on-surface-variant" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="border-t border-surface-container-high bg-white px-3 py-3">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="flex items-center gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about points, rewards or benefits…"
            aria-label="Message Telstra Plus assistant"
            className="flex-1 rounded-full border border-outline-variant bg-surface px-4 py-3 text-sm text-on-surface outline-none placeholder:text-on-surface-variant focus:border-primary"
          />
          <button
            type="submit"
            aria-label="Send"
            className={cn(
              'flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-transform active:scale-95',
              input.trim() ? 'bg-primary text-white' : 'bg-surface-container-high text-on-surface-variant',
            )}
          >
            <Icon name="arrow_upward" className="text-[22px]" />
          </button>
        </form>
      </div>
    </div>
  );
}

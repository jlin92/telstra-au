import { motion } from 'framer-motion';
import { useDemo } from '@/app/DemoContext';
import { chapterIdByKey } from '@/app/chapters';
import { Icon } from '@/components/ui/Icon';

/**
 * Floating blue chat bubble, matching the one in the My Telstra "Get help"
 * screen. Inside Telstra Plus it opens the Telstra Plus assistant.
 */
export function AssistantFab() {
  const { goToChapter } = useDemo();
  return (
    <motion.button
      type="button"
      onClick={() => goToChapter(chapterIdByKey('muse'))}
      aria-label="Open Telstra Plus assistant"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileTap={{ scale: 0.94 }}
      className="absolute bottom-4 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-float animate-pulseGlow"
    >
      <Icon name="chat_bubble" filled className="text-[26px]" />
      <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-telstra-coral ring-2 ring-white">
        <Icon name="auto_awesome" filled className="text-[12px]" />
      </span>
    </motion.button>
  );
}

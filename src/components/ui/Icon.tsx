import { cn } from '@/hooks/utils';

interface IconProps {
  /** Material Symbols Outlined ligature name, e.g. "home", "shopping_bag". */
  name: string;
  className?: string;
  filled?: boolean;
  /** Optical size / font-size via className is preferred; this is a shortcut. */
  ariaHidden?: boolean;
}

/** Renders a Material Symbols Outlined icon. */
export function Icon({ name, className, filled, ariaHidden = true }: IconProps) {
  return (
    <span
      aria-hidden={ariaHidden}
      className={cn('material-symbols-outlined', filled && 'filled', className)}
    >
      {name}
    </span>
  );
}

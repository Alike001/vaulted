import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge Tailwind classes — required by shadcn / Aceternity / 21st components. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

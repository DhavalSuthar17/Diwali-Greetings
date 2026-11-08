import { useEffect, useState } from 'react';
import type { UseRecipientReturn } from '../types';

/**
 * Strips HTML tags, trims whitespace, and limits string length to 30 characters.
 */
export function sanitizeRecipient(raw: string | null | undefined): string | null {
  if (!raw) return null;

  // Strip all HTML tags
  const stripped = raw.replace(/<[^>]*>?/gm, '').trim();
  if (!stripped) return null;

  // Limit to 30 characters max
  const truncated = stripped.slice(0, 30).trim();
  return truncated.length > 0 ? truncated : null;
}

/**
 * Hook to read and sanitize the recipient name from URL query parameter `?to=Name`.
 *
 * Example: `https://example.com/?to=Priya` -> `recipientName: "Priya"`
 */
export function useRecipient(): UseRecipientReturn {
  const [recipientName, setRecipientName] = useState<string | null>(() => {
    if (typeof window === 'undefined') return null;
    try {
      const params = new URLSearchParams(window.location.search);
      return sanitizeRecipient(params.get('to'));
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleLocationChange = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        setRecipientName(sanitizeRecipient(params.get('to')));
      } catch {
        setRecipientName(null);
      }
    };

    handleLocationChange();
    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  return { recipientName };
}

export default useRecipient;

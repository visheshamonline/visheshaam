import crypto from 'crypto';

export function hashContent(text: string): string {
  return crypto.createHash('sha256').update(text.trim().toLowerCase()).digest('hex');
}

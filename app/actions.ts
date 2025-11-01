'use server';

import { headers } from 'next/headers';

export async function handleSubmit(formData: FormData): Promise<void> {
  try {
    const data = Object.fromEntries(formData.entries());

    // Build origin-aware URL to avoid localhost/NEXT_PUBLIC_SITE_URL mismatches
    const hdrs = await headers();
    const origin = hdrs.get('origin')
      ?? process.env.NEXT_PUBLIC_SITE_URL
      ?? 'http://localhost:3000';
    const base = origin.replace(/\/+$/, '');
    const apiUrl = `${base}/api/contact`;

    const resp = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({ error: 'Unknown error' }));
      throw new Error(err.error || 'Failed to send message');
    }

    console.log('Message sent successfully!');
  } catch (error) {
    console.error('Error sending message:', error);
    throw new Error('Failed to send message.');
  }
}

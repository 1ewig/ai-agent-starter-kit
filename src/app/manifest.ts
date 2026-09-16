import type { MetadataRoute } from 'next';
import { BRAND_THEME } from '@/constants/theme';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Sterling — AI Agent & Research Assistant',
    short_name: 'Sterling',
    description:
      'A general-purpose AI research assistant with real-time web search, multi-step reasoning, and instant responses.',
    start_url: '/chat',
    display: 'standalone',
    background_color: BRAND_THEME.BG_HEX,
    theme_color: BRAND_THEME.PRIMARY_HEX,
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}

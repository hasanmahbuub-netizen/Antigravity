import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'IMANOS',
        short_name: 'IMANOS',
        description: 'A quiet companion for daily Quran and practical guidance.',
        start_url: '/',
        display: 'standalone',
        background_color: '#F4F3EF',
        theme_color: '#F4F3EF',
        orientation: 'portrait',
        icons: [
            {
                src: '/icon',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: '/apple-icon',
                sizes: '180x180',
                type: 'image/png',
            },
        ],
    };
}

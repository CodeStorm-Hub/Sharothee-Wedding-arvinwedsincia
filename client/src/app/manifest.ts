import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Incia & Arvin's Wedding",
    short_name: 'Incia & Arvin',
    description: 'Join us in celebrating the love story of Incia & Arvin - from childhood friends to forever partners',
    start_url: '/',
    display: 'standalone',
    background_color: '#FFF8F0',
    theme_color: '#B8860B',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}

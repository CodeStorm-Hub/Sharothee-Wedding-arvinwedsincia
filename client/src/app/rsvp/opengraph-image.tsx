import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = "Incia & Arvin's Wedding - RSVP";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 64,
          background: 'linear-gradient(135deg, #FFF8F0 0%, #F5E6D3 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'serif',
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 300, color: '#2C3E50', marginBottom: 20 }}>
          Incia & Arvin
        </div>
        <div style={{ fontSize: 48, color: '#B8860B', marginBottom: 30 }}>
          RSVP
        </div>
        <div style={{ fontSize: 32, color: '#6B7280' }}>
          December 16, 2025 • Dhaka, Bangladesh
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

import { ImageResponse } from 'next/og';

export const alt = 'NovaOS - Web-based Operating System Simulator';
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
          background: 'radial-gradient(circle at center, #090d16 0%, #010204 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Subtle grid pattern background */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            opacity: 0.05,
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        {/* Supernova Vector Logo */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="220" height="220" style={{ display: 'block' }}>
          <circle cx="100" cy="100" r="65" fill="none" stroke="#06b6d4" strokeWidth="4.5" opacity="0.8" />
          <circle cx="100" cy="100" r="75" fill="none" stroke="#1e293b" strokeWidth="1.5" strokeDasharray="6 8" />
          <path d="M 75 62 L 75 138" stroke="#06b6d4" strokeWidth="11" strokeLinecap="round" />
          <path d="M 125 62 L 125 138" stroke="#10b981" strokeWidth="11" strokeLinecap="round" />
          <path d="M 75 62 L 125 138" stroke="#3b82f6" strokeWidth="11" strokeLinecap="round" />
          <circle cx="100" cy="100" r="11" fill="#ffffff" opacity="0.9" />
          <circle cx="100" cy="100" r="5" fill="#67e8f9" />
        </svg>

        {/* Brand Text */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 'bold',
            color: '#f8fafc',
            marginTop: 24,
            letterSpacing: '-0.02em',
            display: 'flex',
          }}
        >
          Nova
          <span style={{ color: '#06b6d4' }}>OS</span>
        </div>

        {/* Description Tag */}
        <div
          style={{
            fontSize: 20,
            color: '#64748b',
            marginTop: 10,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            fontWeight: '600',
          }}
        >
          Web-Based Operating System Simulator
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

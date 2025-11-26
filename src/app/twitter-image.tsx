import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const alt = 'ThriveMenu - Nourishing meals for your wellness journey'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #26a69a 0%, #00897b 50%, #00796b 100%)',
          fontFamily: 'system-ui',
        }}
      >
        {/* Icon */}
        <div
          style={{
            width: 120,
            height: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '50%',
            marginBottom: 40,
          }}
        >
          <svg
            width="70"
            height="70"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
            <path d="M7 2v20" />
            <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
          </svg>
        </div>

        {/* Logo Text */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            fontStyle: 'italic',
            color: 'white',
            marginBottom: 16,
            letterSpacing: '-1px',
          }}
        >
          ThriveMenu
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 28,
            color: 'rgba(255,255,255,0.9)',
            marginBottom: 50,
          }}
        >
          Nourishing meals for your wellness journey
        </div>

        {/* Three Pillars */}
        <div
          style={{
            display: 'flex',
            gap: 40,
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '16px 32px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 16,
            }}
          >
            <div style={{ fontSize: 18, color: 'white', fontWeight: 600 }}>
              Thyroid Support
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '16px 32px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 16,
            }}
          >
            <div style={{ fontSize: 18, color: 'white', fontWeight: 600 }}>
              Heart Health
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '16px 32px',
              background: 'rgba(255,255,255,0.15)',
              borderRadius: 16,
            }}
          >
            <div style={{ fontSize: 18, color: 'white', fontWeight: 600 }}>
              Blood Sugar
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}


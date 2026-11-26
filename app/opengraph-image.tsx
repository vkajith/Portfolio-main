import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Vysyakh Ajith — AI Agent Platform Engineer'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          background: '#0a0612',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
          <div style={{ width: 10, height: 10, borderRadius: 999, background: '#ff3dc8' }} />
          <div style={{ fontSize: 22, color: '#7d6f9d', letterSpacing: 2, textTransform: 'uppercase' }}>Open to conversations</div>
        </div>
        <div style={{ fontSize: 76, fontWeight: 700, color: '#f0e8ff', lineHeight: 1.1 }}>Vysyakh Ajith</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24 }}>
          <div style={{ fontSize: 28, color: '#ff3dc8', background: 'rgba(255,61,200,0.12)', padding: '6px 16px', borderRadius: 8 }}>AI Agent Platform Engineer</div>
          <div style={{ fontSize: 28, color: '#7d6f9d' }}>· Observe.AI</div>
        </div>
        <div style={{ fontSize: 26, color: '#b9aed3', marginTop: 40, maxWidth: 820, lineHeight: 1.5 }}>
          I build the platform layer under AI agents — LLM gateways, evals, and analytics at 10M+ events/month.
        </div>
      </div>
    ),
    { ...size }
  )
}

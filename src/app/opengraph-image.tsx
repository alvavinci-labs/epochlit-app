import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt     = 'Epoch — AIが紡ぐ、人間の未来'
export const size    = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width:      '100%',
          height:     '100%',
          display:    'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0B0B0F 0%, #12111A 50%, #0D0B14 100%)',
          position:   'relative',
          overflow:   'hidden',
        }}
      >
        {/* 背景の星・グロー装飾 */}
        <div
          style={{
            position:     'absolute',
            top:          '50%',
            left:         '50%',
            transform:    'translate(-50%, -50%)',
            width:        700,
            height:       700,
            borderRadius: '50%',
            background:   'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)',
          }}
        />
        <div
          style={{
            position:     'absolute',
            top:          80,
            right:        120,
            width:        200,
            height:       200,
            borderRadius: '50%',
            background:   'radial-gradient(circle, rgba(167,139,250,0.08) 0%, transparent 60%)',
          }}
        />

        {/* ロゴ */}
        <div
          style={{
            fontSize:    96,
            fontWeight:  700,
            color:       '#F4F0FF',
            letterSpacing: '0.18em',
            fontFamily:  'serif',
            marginBottom: 24,
          }}
        >
          EPOCH
        </div>

        {/* キャッチコピー */}
        <div
          style={{
            fontSize:    28,
            color:       '#A78BFA',
            letterSpacing: '0.08em',
            marginBottom: 48,
          }}
        >
          AIが紡ぐ、人間の未来
        </div>

        {/* ディバイダー */}
        <div
          style={{
            width:           80,
            height:          1,
            background:      'rgba(167,139,250,0.4)',
            marginBottom:    40,
          }}
        />

        {/* サブテキスト */}
        <div
          style={{
            fontSize:  18,
            color:     'rgba(244,240,255,0.4)',
            letterSpacing: '0.05em',
          }}
        >
          毎日届くSF短編小説 · epochlit.com
        </div>
      </div>
    ),
    { ...size }
  )
}

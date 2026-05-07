import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      screens: {
        xs: '480px',
      },
      colors: {
        epoch: {
          bg:           '#08080f',
          surface:      '#12121e',
          card:         '#1a1a2e',
          border:       '#2a2a4a',
          purple:       '#7c3aed',
          'purple-light': '#a78bfa',
          blue:         '#3b82f6',
          'blue-light': '#93c5fd',
          silver:       '#c0c0d8',
          text:         '#f1f1f5',
          muted:        '#9494b0',
          dim:          '#5a5a7a',
        },
      },
      fontFamily: {
        sans:  ['var(--font-noto-sans)', 'sans-serif'],
        serif: ['var(--font-noto-serif)', 'serif'],
      },
      backgroundImage: {
        'epoch-gradient': 'linear-gradient(135deg, #08080f 0%, #12121e 50%, #1a1a2e 100%)',
        'card-gradient':  'linear-gradient(180deg, transparent 40%, rgba(8,8,15,0.95) 100%)',
        'hero-gradient':  'linear-gradient(180deg, transparent 0%, rgba(8,8,15,0.7) 60%, #08080f 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { transform: 'translateY(20px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
      },
    },
  },
  plugins: [],
}

export default config

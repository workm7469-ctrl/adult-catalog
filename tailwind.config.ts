import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        night: '#17151A',
        surface: '#221F26',
        surface2: '#2B2731',
        line: '#3A3541',
        ink: '#F3EEF0',
        muted: '#B7AFB8',
        rose: {
          DEFAULT: 'rgb(var(--brand) / <alpha-value>)',
          dark: 'rgb(var(--brand-dark) / <alpha-value>)',
          light: 'rgb(var(--brand-light) / <alpha-value>)',
        },
        gold: {
          DEFAULT: '#CBA35C',
          dark: '#A9843F',
        },
        accent: {
          name: 'rgb(var(--name-brand) / <alpha-value>)',
          price: 'rgb(var(--price-brand) / <alpha-value>)',
          tagline: 'rgb(var(--tagline-brand) / <alpha-value>)',
          description: 'rgb(var(--description-brand) / <alpha-value>)',
          pill: 'rgb(var(--pill-text-brand) / <alpha-value>)',
        },
        storebg: 'rgb(var(--bg-brand) / <alpha-value>)',
        line_brand: '#06C755',
        danger: '#E0637A',
      },
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
      },
      borderRadius: {
        card: '20px',
        pill: '999px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(0,0,0,0.2), 0 12px 28px -14px rgba(0,0,0,0.55)',
      },
    },
  },
  plugins: [],
}
export default config

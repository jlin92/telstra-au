/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // My Telstra app tokens (sampled from official App Store screenshots)
        surface: '#f4f4f4',
        'surface-dim': '#e4e6ea',
        'surface-bright': '#ffffff',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f7f8fa',
        'surface-container': '#eef0f3',
        'surface-container-high': '#e3e6eb',
        'surface-container-highest': '#d7dbe2',
        'on-surface': '#282828',
        'on-surface-variant': '#5d6470',
        outline: '#8d94a0',
        'outline-variant': '#d5d9e0',

        // Primary = Telstra blue
        primary: '#0d54ff',
        'on-primary': '#ffffff',
        'primary-container': '#0548f6',
        'primary-fixed': '#e6edff',
        'primary-fixed-dim': '#b9ccff',

        background: '#f4f4f4',
        'on-background': '#282828',

        // Telstra brand aliases
        telstra: {
          blue: '#0d54ff',
          'blue-dark': '#0548f6',
          'blue-soft': '#e6edff',
          navy: '#1a2e61',
          coral: '#f5673d',
          cream: '#f6f1ea',
          sky: '#7fc8ff',
          gold: '#b8923d',
          'gold-soft': '#fbf5e6',
          silver: '#8e98a5',
        },
        ink: '#282828',
        muted: '#5d6470',
        canvas: '#f4f4f4',
        card: '#ffffff',
        success: '#369335',
        warning: '#d9731c',
        danger: '#d0021b',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        heading: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        xs: ['0.8125rem', { lineHeight: '1.1rem' }],
        sm: ['0.9375rem', { lineHeight: '1.35rem' }],
      },
      boxShadow: {
        card: '0 1px 4px rgba(26,46,97,0.10), 0 4px 14px rgba(26,46,97,0.06)',
        float: '0 8px 22px rgba(26,46,97,0.18)',
        frame: '0 30px 80px rgba(14,22,56,0.35)',
      },
      borderRadius: {
        xl2: '1.25rem',
        xl3: '1.75rem',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(13,84,255,0.45)' },
          '50%': { boxShadow: '0 0 0 12px rgba(13,84,255,0)' },
        },
        typing: {
          '0%, 60%, 100%': { transform: 'translateY(0)', opacity: '0.4' },
          '30%': { transform: 'translateY(-3px)', opacity: '1' },
        },
      },
      animation: {
        pulseGlow: 'pulseGlow 2.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

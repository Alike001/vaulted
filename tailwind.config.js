/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0B0D12',
        panel: '#14171F',
        panel2: '#1A1E28',
        border: '#232733',
        ink: '#E6E8EE',
        muted: '#8A90A2',
        brand: '#4F46E5',
        'brand-hover': '#4338CA',
        ok: '#22C55E',
        danger: '#EF4444',
        warn: '#F59E0B',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        card: '10px',
      },
    },
  },
  plugins: [],
}

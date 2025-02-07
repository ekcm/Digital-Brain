import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // Your custom colors
        peach: {
          default: '#FCCCC4',
          light: '#FFE9E6',
          dark: '#E69A74',
        },
        lilac: {
          default: '#CBB6F2',
          light: '#E9D7FE',
          dark: '#A78BDD',
        },
        // Neutral colors
        neutral: {
          0: '#ffffff', // white
          50: '#f8f8f8',
          100: '#f0f0f0',
          200: '#e4e4e4',
          300: '#d1d1d1',
          400: '#b4b4b4',
          500: '#919191',
          600: '#6d6d6d',
          700: '#4b4b4b',
          800: '#2d2d2d',
          900: '#1a1a1a',
          950: '#0d0d0d',
          1000: '#000000', // black
        },
        state: {
          success: {
            light: '#22c55e',
            dark: '#4ade80',
            bg: '#f0fdf4',
            hover: '#16a34a',
          },
          error: {
            light: '#ef4444',
            dark: '#f87171',
            bg: '#fef2f2',
            hover: '#dc2626',
          },
          warning: {
            light: '#f59e0b',
            dark: '#fbbf24',
            bg: '#fffbeb',
            hover: '#d97706',
          },
          info: {
            light: '#3b82f6',
            dark: '#60a5fa',
            bg: '#eff6ff',
            hover: '#2563eb',
          },
        },

        // shadcn-ui required colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      backgroundImage: {
        'gradient-peach': 'linear-gradient(to right, #FCCCC4, #E69A74)',
        'gradient-peach-lilac': 'linear-gradient(to right, #FCCCC4, #CBB6F2)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config

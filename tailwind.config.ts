import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				/* Clay brand palette — supports opacity modifiers (bg-brand-pink/20 etc.) */
				'brand-pink':     'hsl(var(--brand-pink) / <alpha-value>)',
				'brand-teal':     'hsl(var(--brand-teal) / <alpha-value>)',
				'brand-lavender': 'hsl(var(--brand-lavender) / <alpha-value>)',
				'brand-peach':    'hsl(var(--brand-peach) / <alpha-value>)',
				'brand-ochre':    'hsl(var(--brand-ochre) / <alpha-value>)',
				'brand-mint':     'hsl(var(--brand-mint) / <alpha-value>)',
				'brand-coral':    'hsl(var(--brand-coral) / <alpha-value>)',
				/* Surface tokens */
				'surface-soft':   'hsl(var(--surface-soft) / <alpha-value>)',
				'surface-card':   'hsl(var(--surface-card) / <alpha-value>)',
				'surface-strong': 'hsl(var(--surface-strong) / <alpha-value>)',
			},
			borderRadius: {
				lg: 'var(--radius)',              /* 12px – buttons, inputs */
				md: 'calc(var(--radius) - 2px)',  /* 10px */
				sm: 'calc(var(--radius) - 4px)',  /* 8px  */
				/* Tailwind built-ins still apply:
				   rounded-xl  = 12px  (0.75rem)
				   rounded-2xl = 16px  (1rem)    ← content cards
				   rounded-3xl = 24px  (1.5rem)  ← feature cards
				   rounded-full = 9999px          ← pill badges */
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

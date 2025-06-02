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
			fontFamily: {
				'fredoka': ['Fredoka One', 'cursive'],
				'inter': ['Inter', 'sans-serif'],
				'titan': ['Titan One', 'cursive'],
			},
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
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Orange theme colors - updated with brighter orange tones
				orange: {
					50: '#fff8f0',
					100: '#ffedd5',
					200: '#ffddb0',
					300: '#ffc580',
					400: '#ffa94d',
					500: '#ff8c1a', // More vibrant orange
					600: '#ff7000',
					700: '#e65c00',
					800: '#cc4400',
					900: '#a63c00',
				},
				// Rarity colors
				uncommon: '#22c55e',
				rare: '#3b82f6',
				epic: '#a855f7',
				legendary: '#eab308',
				chroma: '#14b8a6',
				mythical: '#ec4899',
				master: '#10b981',
				dev: '#f59e0b',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'rainbow': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				},
				'matrix': {
					'0%': { opacity: '1' },
					'50%': { opacity: '0.3' },
					'100%': { opacity: '1' }
				},
				'dev-cycle': {
					'0%': { color: '#ff8c1a' },
					'25%': { color: '#ec4899' },
					'50%': { color: '#3b82f6' },
					'75%': { color: '#10b981' },
					'100%': { color: '#ff8c1a' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'pulse-orange': {
					'0%, 100%': { boxShadow: '0 0 0 0 rgba(255, 140, 26, 0.7)' },
					'50%': { boxShadow: '0 0 0 10px rgba(255, 140, 26, 0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'rainbow': 'rainbow 3s ease infinite',
				'matrix': 'matrix 2s ease-in-out infinite',
				'dev-cycle': 'dev-cycle 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'pulse-orange': 'pulse-orange 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
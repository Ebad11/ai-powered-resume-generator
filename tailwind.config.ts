
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
				// Updated JARVIS colors to neon blue theme
				jarvis: {
					blue: '#1EAEDB', // Neon blue replacing red
					cyan: '#33C3F0', // Bright cyan replacing gold
					dark: '#0F1521', // Darker background
					darkAlt: '#1A2532', // Slightly lighter dark
					light: '#EDEDED'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'glow': {
					'0%, 100%': { boxShadow: '0 0 5px #1EAEDB, 0 0 10px #1EAEDB' },
					'50%': { boxShadow: '0 0 15px #1EAEDB, 0 0 20px #1EAEDB, 0 0 25px #1EAEDB' }
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-5px)' }
				},
				'typing': {
					from: { width: '0' },
					to: { width: '100%' }
				},
				'blink': {
					'50%': { borderColor: 'transparent' }
				},
				'scan-line': {
					'0%': { transform: 'translateY(0)' },
					'100%': { transform: 'translateY(100%)' }
				},
				'hud-fade-in': {
					from: { opacity: '0', transform: 'translateY(10px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'glow': 'glow 2s ease-in-out infinite',
				'float': 'float 3s ease-in-out infinite',
				'typing': 'typing 3.5s steps(40, end), blink .75s step-end infinite',
				'scan-line': 'scan-line 2s linear infinite',
				'hud-fade-in': 'hud-fade-in 0.5s ease-out forwards'
			},
			backgroundImage: {
				'jarvis-gradient': 'linear-gradient(180deg, rgba(15,21,33,0.95) 0%, rgba(26,37,50,0.95) 100%)',
				'jarvis-glow': 'radial-gradient(circle, rgba(30,174,219,0.2) 0%, rgba(15,21,33,0) 70%)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

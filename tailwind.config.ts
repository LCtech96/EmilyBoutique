import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'ios-pink': '#FFB6C1',
        'ios-pink-light': '#FFE4E1',
        'ios-red': '#FF3B30',
      },
      backdropBlur: {
        'ios': '20px',
      },
    },
  },
  plugins: [],
}
export default config

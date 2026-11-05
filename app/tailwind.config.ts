import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        zerog: {
          purple: '#B75FFF',
          purpleDark: '#8F3FE0',
          purpleLight: '#DAB2FF',
          darkBg: '#0B0B14',
          cardBg: '#131322',
          border: '#24243A',
        },
      },
    },
  },
  plugins: [],
};

export default config;

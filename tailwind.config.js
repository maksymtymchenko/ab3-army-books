/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    theme: {
        extend: {
            colors: {
                /* Figma design tokens */
                black: '#001527',
                orange: '#F7931E',
                'orange-light': '#FCF2E7',
                white: '#FFFFFF',
                yellow: '#ECB911',
                green: '#55B05E',
                'gray-dark': '#828A8E',
                'gray-light': '#E5E7EB',
                khaki: '#525B2F',
                catalog: '#525B2F',
                bg: '#F7F7F7',
                'blue-light': '#A8D4F0',
            },
            fontFamily: {
                sans: ['UAF Sans', 'Futura PT', 'system-ui', 'sans-serif'],
                display: ['UAF Sans', 'Futura PT', 'system-ui', 'sans-serif'],
                futura: ['Futura PT', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                /* rem so they scale with root font-size (smaller on mobile) */
                'figma-16': ['1rem', { lineHeight: '1.4' }],
                'figma-20': ['1.25rem', { lineHeight: '1.4' }],
                'figma-26': ['1.625rem', { lineHeight: '1.4' }],
                'figma-32': ['2rem', { lineHeight: '1.4' }],
                'figma-60': ['3.75rem', { lineHeight: '1.2' }],
            },
            maxWidth: {
                content: '1200px',
            },
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
            },
            borderRadius: {
                'figma': '12px',
            },
            boxShadow: {
                card: '0 2px 12px rgba(0, 0, 0, 0.08)',
                'card-hover': '0 4px 16px rgba(0, 0, 0, 0.1)',
                category: '0 2px 8px rgba(0, 0, 0, 0.06)',
                'category-hover': '0 4px 12px rgba(0, 0, 0, 0.08)',
            },
        },
    },
    plugins: [],
};
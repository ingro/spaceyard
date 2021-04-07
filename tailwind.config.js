const colors = require('tailwindcss/colors');

module.exports ={
    mode: 'jit',
    darkMode: 'class',
    purge: {
        // enabled: process.env.NODE_ENV === 'production',
        content: ['./index.html', './src/**/*.tsx', './src/**/*.ts', './lib/**/*.{ts,tsx}']
    },
    theme: {
        extend: {
            colors: {
                primary: 'var(--color-primary-theme)',
                'primary-lighter': 'var(--color-primary-lighter-theme)',
                'primary-stronger': 'var(--color-primary-stronger-theme)',

                danger: colors.rose[600],
                // danger: 'var(--color-danger-theme)',
                success: colors.emerald[600],
                warning: colors.amber[400]
            }
        }
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/aspect-ratio')
    ]
}

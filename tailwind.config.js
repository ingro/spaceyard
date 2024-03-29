const colors = require('tailwindcss/colors');

module.exports ={
    mode: 'jit',
    darkMode: 'class',
    content: ['./index.html', './src/**/*.tsx', './src/**/*.ts', './lib/**/*.{ts,tsx}'],
    theme: {
        extend: {
            colors: {
                primary: 'var(--color-primary-theme)',
                'primary-lighter': 'var(--color-primary-lighter-theme)',
                'primary-stronger': 'var(--color-primary-stronger-theme)',

                // danger: colors.rose[600],
                danger: 'var(--color-danger-theme)',
                success: colors.emerald[600],
                warning: colors.amber[400],
                info: colors.slate[600]
            }
        }
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/forms'),
        require('@tailwindcss/aspect-ratio')
    ]
}

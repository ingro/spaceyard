module.exports ={
    purge: {
        enabled: process.env.NODE_ENV === 'production',
        content: ['./index.html', './src/**/*.tsx', './src/**/*.ts']
    },
    theme: {
        extend: {
            colors: {
                primary: 'var(--color-primary-theme)',
                'primary-lighter': 'var(--color-primary-lighter-theme)',
                'primary-stronger': 'var(--color-primary-stronger-theme)',
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
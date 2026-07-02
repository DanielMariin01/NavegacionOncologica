import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Poppins', ...defaultTheme.fontFamily.sans],
            },
            keyframes: {
                bounceFade: {
                    '0%, 100%': { transform: 'translateY(0)', opacity: '0.3' },
                    '50%': { transform: 'translateY(-20px)', opacity: '1' },
                },
            },
            animation: {
                'bounce-fade': 'bounceFade 0.8s ease-in-out infinite',
            },
        },
    },

    plugins: [forms],
};
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,ts,jsx,tsx}',
    './*.html',            // Include root HTML files
    './js/**/*.js',        // Include your JS logic folder
    './index.html',
    './quiz.html',
    './results.html',
    './js/quiz.js',
    
  ],
  theme: {
    extend: {
      colors: {
        pastelPink: '#FAD0C4',    // Light pink
        pastelBrown: '#D6A77A',   // Light brown
      },
      fontFamily: {
        fredoka: ['Fredoka', 'sans-serif'],
      },
      boxShadow: {
        '3d-hover': '0 4px 12px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.15)', // 3D hover effect
        '3d-pressed': 'inset 0 2px 4px rgba(0, 0, 0, 0.2)', // Pressed button effect
        'focus-glow': '0 0 10px rgba(236, 131, 5, 0.5)',
      },
      keyframes: {
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        'spin-slow': 'spin 15s linear infinite',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Enables consistent form styling
  ],
}

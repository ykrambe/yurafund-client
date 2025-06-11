/*
 ** TailwindCSS Configuration File
 **
 ** Docs: https://tailwindcss.com/docs/configuration
 ** Default: https://github.com/tailwindcss/tailwindcss/blob/master/stubs/defaultConfig.stub.js
 */
 module.exports = {
  theme: {
    extend: {
      boxShadow: {
        outline: '0 0 0 1px rgba(66, 153, 225, 0.5)',
      },
      colors: {
        'orange-button': '#FF872E',
        'green-button': '#1ABC9C',
        'orange-progress': '#FBB117',
        'orange-secondary': '#FFF8E7',
      },
      borderRadius: {
        20: '20px',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif']
      },
    },
  },
  plugins: []
}
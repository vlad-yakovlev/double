module.exports = {
  content: [
    './components/**/*.tsx',
    './pages/**/*.tsx',
  ],
  theme: {
    extend: {
      width: {
        92: '23rem',
      },

      gridTemplateColumns: {
        field: 'repeat(5, 4rem)',
      },

      gridTemplateRows: {
        column: 'repeat(7, 4rem)',
      },
    },
  },
  plugins: [],
};

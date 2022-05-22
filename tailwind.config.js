module.exports = {
  content: [
    './classes/**/*.ts',
    './components/**/*.tsx',
    './pages/**/*.tsx',
  ],
  theme: {
    extend: {
      height: {
        124: '31rem',
      },

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

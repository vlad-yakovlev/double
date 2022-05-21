module.exports = {
  extends: [
    'airbnb',
    'airbnb/hooks',
    'airbnb-typescript',
  ],
  parserOptions: {
    project: 'tsconfig.json',
  },
  rules: {
    'arrow-body-style': 'off',
    'import/prefer-default-export': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'max-len': ['error', { code: 200 }],
    'react/function-component-definition': 'off',
    'react/jsx-max-props-per-line': ['error', { maximum: 1 }],
    'react/jsx-props-no-spreading': 'off',
    'react/react-in-jsx-scope': 'off',
  },
};

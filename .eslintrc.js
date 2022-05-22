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
    '@typescript-eslint/no-unused-expressions': 'off',
    'arrow-body-style': 'off',
    'class-methods-use-this': 'off',
    'import/prefer-default-export': 'off',
    'jsx-a11y/click-events-have-key-events': 'off',
    'jsx-a11y/no-static-element-interactions': 'off',
    'max-len': ['error', { code: 200 }],
    'no-await-in-loop': 'off',
    'no-param-reassign': 'off',
    'no-plusplus': 'off',
    'react/function-component-definition': 'off',
    'react/jsx-max-props-per-line': ['error', { maximum: 1 }],
    'react/jsx-props-no-spreading': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/require-default-props': 'off',
  },
};

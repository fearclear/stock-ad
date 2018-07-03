module.exports = {
    "extends": "standard",
    "plugins": [
        "react"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "rules": {
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
        'space-before-function-paren': ['error', 'never'],
        'keyword-spacing': ['error', {
            'overrides': {
                'if': { 'after': false },
                'for': { 'after': false },
                'while': { 'after': false },
                'else': { 'before': false }
            }
        }],
        "beforeStatementContinuationChars": "never"
    }
};
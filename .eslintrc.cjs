/**
 * @type {import('eslint').Linter.Config}
 */
const config = {
    env: {
        browser: true,
        es2021: true
    },
    extends: [
        'eslint:recommended',
    ],
    parserOptions: {
        ecmaVersion: 12,
        sourceType: 'module'
    },
    plugins: [
        'svelte3'
    ],
    globals: {
        NodeJS: 'readonly',
        $$Generic: 'readonly',
        svelte: 'readonly',
    },
    rules: {
        'indent': [
            'error',
            4,
            { SwitchCase: 1 }
        ],
        'linebreak-style': [
            'error',
            'unix'
        ],
        'quotes': [
            'error',
            'single',
            { allowTemplateLiterals: true }
        ],
        'semi': [
            'error',
            'always'
        ],
        'no-var': 'error',
        'eqeqeq': [
            'error',
            'always'
        ]
    },
    overrides: [
        {
            files: ['*.svelte'],
            processor: 'svelte3/svelte3'
        },
        {
            files: ['*.cjs', 'server/**/*', 'server/*'],
            env: {
                node: true,
            }
        }
    ],
    settings: {
        // 'svelte3/ignore-styles': () => true
    }
};

module.exports = config;

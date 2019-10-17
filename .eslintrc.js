// module.exports = {
//     root: true,
//     env: {
//         browser: true,
//         node: true
//     },
//     parserOptions: {
//         parser: 'babel-eslint'
//     },
//     extends: ['@nuxtjs', 'plugin:nuxt/recommended', 'prettier/vue'],
//     plugins: ['prettier'],
//     // add your custom rules here
//     rules: {
//         'nuxt/no-cjs-in-config': 'off',
//         indent: ['error', 4],
//         semi: ['error', 'always']
//     }
// }
module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    plugins: ['@typescript-eslint'],
    parserOptions: {
        parser: '@typescript-eslint/parser'
    },
    extends: ['@nuxtjs', 'plugin:nuxt/recommended', 'prettier/vue'],
    rules: {
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/ordered-imports': [false],
        '@typescript-eslint/indent': ['error', 4],
        '@typescript-eslint/semi': ['error', 'always'],
        indent: ['error', 4],
        semi: 0,
        'no-console': 0
    }
};

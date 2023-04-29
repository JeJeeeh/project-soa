module.exports = {
	env: {
		es2021: true,
		node: true,
	},
	extends: ['xo'],
	overrides: [
		{
			extends: ['xo-typescript'],
			files: ['*.ts', '*.tsx'],
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	rules: {
		'new-cap': ['error', { capIsNew: false }],
		'object-curly-spacing': [
			'error',
			'always',
			{ objectsInObjects: false, arraysInObjects: false },
		],
	},
};

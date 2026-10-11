export default {
  'src/**/*.ts': ['eslint --fix', 'prettier --write'],
  'src/**/*.html': ['eslint --fix', 'prettier --write'],
  'src/**/*.css': ['prettier --write'],
  'src/**/*.json': ['prettier --write']
};
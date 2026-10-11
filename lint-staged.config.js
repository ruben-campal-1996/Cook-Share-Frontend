export default {
  'src/**/*.ts': () => 'ng lint --fix',
  'src/**/*.html': ['prettier --write'],
  'src/**/*.css': ['prettier --write'],
  'src/**/*.json': ['prettier --write']
};
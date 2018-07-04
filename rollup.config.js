export default {
  input: 'build/index.js',
  output: {
    file: 'ttLib.js',
    format: 'iife'
  },
  watch: {
    include: 'build/**',
    exclude: 'node_modules/**'
  }
}
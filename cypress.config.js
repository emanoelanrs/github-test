const { defineConfig } = require('cypress')

module.exports = defineConfig({
  viewportWidth: 1280,
  viewportHeight: 1024,
  allowCypressEnv: false,
  e2e: {
    baseUrl: 'https://github.com',
    fixturesFolder: false,
    supportFile: false,
  }
})

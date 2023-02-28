const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  publicPath: process.env.NODE_ENV === 'production'
  ? '/currency_converter_vue3/'
  : '/',

  transpileDependencies: true
})

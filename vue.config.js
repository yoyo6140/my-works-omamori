const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  // GitHub Pages 需要 repo name 當 publicPath；Vercel 需要 '/'
  publicPath:
    process.env.NODE_ENV === 'production' && process.env.VERCEL !== '1'
      ? '/my-works-omamori/'
      : '/',
})

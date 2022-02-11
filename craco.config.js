// craco 配置文件：可以在该文件中，来添加配置，从而修改 webapck/bable 等配置项
const path = require('path')
// px 转 vw 的包
const pxToViewport = require('postcss-px-to-viewport')
// 调用函数，传入配置项
const vw = pxToViewport({
  // 视口宽度，一般就是 375（ 设计稿一般采用二倍稿，宽度为 375 ）
  viewportWidth: 375
})

module.exports = {
  // style 表示修改样式的相应配置
  style: {
    // 因为我们使用的包是一个 postcss 的插件，所以，此处使用 postcss 进行配置
    postcss: {
      // 插件，它的是是一个数组，数组中，把我们配置好的 viewport 传进去就可以了
      plugins: [vw]
    }
  },

  // webpack 配置
  webpack: {
    // 配置别名
    // 此处，就是为 src 目录起别名，配置后，只需要使用 @ 别名就可以来表示 src 目录
    alias: {
      // 约定：使用 @ 表示 src 文件所在路径
      // 在 JS 代码中使用
      '@': path.resolve(__dirname, 'src'),
      // 约定：使用 @scss 表示全局 SASS 样式所在路径
      // 在 SASS 中使用
      '@scss': path.resolve(__dirname, 'src/assets/styles')
    }
  }
}

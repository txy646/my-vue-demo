const fs = require('fs');
const path = require('path');

// 读取 dist 目录
const distPath = path.join(__dirname, 'dist');
const assetsPath = path.join(distPath, 'assets');

// 获取 assets 文件夹中的文件
const files = fs.readdirSync(assetsPath);

// 找到 JS 和 CSS 文件
const jsFiles = files.filter(f => f.endsWith('.js'));
const cssFiles = files.filter(f => f.endsWith('.css'));

// 生成 HTML 内容
let htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vue寻宝游戏</title>
    <link rel="icon" href="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' fill='%23ffd700'/><text x='32' y='40' font-size='28' text-anchor='middle' fill='%23000' font-family='Arial'>T</text></svg>" />`;

// 添加 CSS 链接
cssFiles.forEach(cssFile => {
    htmlContent += `\n    <link rel="stylesheet" href="./assets/${cssFile}">`;
});

htmlContent += `\n</head>
<body>
    <div id="app"></div>`;

// 添加 JS 脚本
jsFiles.forEach(jsFile => {
    htmlContent += `\n    <script type="module" crossorigin src="./assets/${jsFile}"></script>`;
});

htmlContent += `\n</body>
</html>`;

// 写入文件
fs.writeFileSync(path.join(distPath, 'index.html'), htmlContent);
console.log('✅ 已修复 index.html，注入了', jsFiles.length, '个JS文件和', cssFiles.length, '个CSS文件');
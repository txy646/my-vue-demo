<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vue寻宝游戏</title>
    <link rel="icon" href="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' fill='%23ffd700'/><text x='32' y='40' font-size='28' text-anchor='middle' fill='%23000' font-family='Arial'>T</text></svg>" />
    <!-- 手动添加 CSS 链接（如果有的话） -->
</head>
<body>
    <div id="app"></div>
    
    <!-- 手动添加 JS 文件 -->
    <script type="module" crossorigin>
        // 动态导入所有 JS 文件
        const scripts = [];
        const links = [];
        
        // 获取 dist/assets 目录下的所有文件
        function loadScripts() {
            // 查找所有的 JS 文件
            const jsFiles = [
                './assets/index.js',
                './assets/vendor.js'
            ];
            
            // 查找所有的 CSS 文件
            const cssFiles = [
                './assets/style.css'
            ];
            
            // 加载 CSS
            cssFiles.forEach(cssFile => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = cssFile;
                document.head.appendChild(link);
            });
            
            // 加载 JS
            jsFiles.forEach(jsFile => {
                const script = document.createElement('script');
                script.type = 'module';
                script.crossOrigin = true;
                script.src = jsFile;
                document.body.appendChild(script);
            });
        }
        
        // 页面加载后执行
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', loadScripts);
        } else {
            loadScripts();
        }
    </script>
</body>
</html>
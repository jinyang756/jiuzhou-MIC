
# 九州 Jiuzhou - 多维融合精神避难所

![Jiuzhou Banner](https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?q=80&w=1200&auto=format&fit=crop)

> **连接每一个有趣的灵魂。**  
> 一个融合博客、修心灵台、无损音乐、金融悟道与匿名社交的数字化精神空间。

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fjiuzhou-app)

## 🌌 项目愿景

在这个算法横行、信息过载的时代，“九州”致力于打造一个**慢节奏**的数字化避难所。
这里没有短视频的喧嚣，只有：
*   **九州志**：深度阅读与思想连载。
*   **灵台**：4-7-8 呼吸法与自然白噪音，修复精神内耗。
*   **九州听觉**：支持 Media Session API 的沉浸式音乐体验。
*   **金融悟道**：结合人性博弈与价值投资的量化看板。
*   **匿名树洞**：星海视图 (Galaxy View) 与情绪焚烧炉，宣泄秘密。

## 🛠 技术栈

*   **核心框架**: React 19 + TypeScript + Vite 5
*   **样式引擎**: Tailwind CSS (移动端适配 + 玻璃拟态风格)
*   **图标库**: Lucide React
*   **后端 (可选)**: PocketBase (Go + SQLite) - *支持双模运行，无后端也可使用 LocalStorage*
*   **部署**: Vercel (前端) + Pockethost/VPS (后端)

---

## 🚀 极速上手 (Local Development)

### 1. 环境准备
确保您的电脑已安装 [Node.js](https://nodejs.org/) (v18+)。

### 2. 安装依赖
```bash
# 进入项目目录
npm install
```

### 3. 配置 API 密钥（可选）
为了使用 AI 功能，您需要配置 Gemini API 密钥：

1. 复制 [.env.example](file:///c:/Users/88903/Desktop/jiuzhoumic/.env.example) 文件并重命名为 [.env](file:///c:/Users/88903/Desktop/jiuzhoumic/.env)
2. 在 [.env](file:///c:/Users/88903/Desktop/jiuzhoumic/.env) 文件中填入您的 Gemini API 密钥：
   ```
   VITE_API_KEY=your_actual_api_key_here
   ```

### 4. 启动开发服务器
```bash
npm run dev
```
访问 `http://localhost:5173` 即可看到九州世界。

### 4. (可选) 启动本地后端
如果您想测试数据库功能，请运行脚本自动下载并启动 PocketBase：

*   **Mac/Linux**: `./setup-pocketbase.sh`
*   **Windows**: 右键运行 `setup-pocketbase.ps1`

---

## 📦 一键部署上线方案 (Deployment)

我们提供两种部署模式，建议从 **模式 A** 开始，最快 1 分钟上线。

### 模式 A：纯前端极速版 (推荐 MVP)
*利用 LocalStorage 存储数据，完全免费，无需服务器，数据保存在用户浏览器中。*

1.  **上传代码到 GitHub**
    *   在 GitHub 新建一个仓库（例如 `jiuzhou-app`）。
    *   在本地运行：
        ```bash
        git init
        git add .
        git commit -m "First commit: Jiuzhou Launch"
        git branch -M main
        git remote add origin https://github.com/您的用户名/jiuzhou-app.git
        git push -u origin main
        ```

2.  **部署到 Vercel**
    *   访问 [Vercel Dashboard](https://vercel.com/dashboard)。
    *   点击 **"Add New..."** -> **"Project"**。
    *   选择刚刚创建的 GitHub 仓库并点击 **"Import"**。
    *   **Build Settings** 保持默认（Vite 会自动识别）。
    *   点击 **"Deploy"**。

3.  **🎉 上线成功！**
    *   Vercel 会分配一个 `https://jiuzhou-app.vercel.app` 的域名，您可以直接分享给朋友。

---

### 模式 B：全栈完整版 (进阶)
*利用 PocketBase 实现云端数据同步，所有人共享树洞和音乐。*

1.  **准备后端 (PocketBase)**
    *   **方案一 (最简单)**: 使用 [Pockethost.io](https://pockethost.io/) 免费托管 PocketBase。创建一个实例，获得 URL (例如 `https://jiuzhou.pockethost.io`)。
    *   **方案二 (最可控)**: 购买一台云服务器 (ECS/VPS)，上传 `pocketbase` 二进制文件并运行 `./pocketbase serve --http="0.0.0.0:8090"`。

2.  **配置 Vercel 环境变量**
    *   进入 Vercel 项目设置 -> **Settings** -> **Environment Variables**。
    *   添加变量：
        *   Key: `VITE_POCKETBASE_URL`
        *   Value: `您的后端地址` (例如 `https://jiuzhou.pockethost.io`)
    *   重新部署项目 (Redeploy)。

---

## 📂 目录结构

```
jiuzhou/
├── src/
│   ├── components/    # UI 组件 (导航、播放器、看板)
│   ├── pages/         # 页面视图 (博客、金融、树洞...)
│   ├── services/      # 逻辑服务 (TTS、PocketBase、LocalLogic)
│   ├── types.ts       # TypeScript 类型定义
│   └── App.tsx        # 路由与全局状态
├── public/            # 静态资源
├── index.html         # 入口 HTML
├── vite.config.ts     # 构建配置
└── package.json       # 依赖管理
```

## 🤝 贡献与致谢

*   **Powered by Efinance**: 金融数据模拟致敬开源项目 [Efinance](https://github.com/jinyang756/efinance)。
*   **Images**: Unsplash 提供的高清摄影资源。

---

**© 2023 Jiuzhou Group.**  
*Code is Poetry, Finance is Philosophy.*

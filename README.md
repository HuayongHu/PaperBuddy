# PaperBuddy / 文润

PaperBuddy is a Vercel-ready academic writing assistant for paper polishing, PDF paper understanding, and AI Q&A. It uses a server-side OpenAI-compatible chat completions API, with NVIDIA's endpoint and `openai/gpt-oss-120b` as the default configuration.

PaperBuddy 是一个可部署到 Vercel 的学术论文辅助网页应用，支持论文文字点评润色、PDF 文献理解和基于论文内容的 AI 问答。项目默认使用 NVIDIA OpenAI-compatible Chat Completions 接口和 `openai/gpt-oss-120b` 模型。

---

## 中文说明

### 功能

- **论文润色**：粘贴论文片段，按段落查看原文、问题分析和润色结果。
- **PDF 文献解读**：上传 PDF，浏览器本地提取文本，并基于提取内容进行多轮问答。
- **无需用户登录**：API Key 只配置在部署平台的服务端环境变量中，不会暴露给前端。
- **本地历史记录**：润色历史和 PDF 对话历史保存在浏览器 `localStorage` 中。

### 技术栈

- Next.js App Router
- React + TypeScript
- `pdfjs-dist` PDF 文本提取和页面预览
- Vitest 核心工具测试
- Vercel Serverless API Routes

### 本地运行

安装依赖：

```bash
npm install
```

复制环境变量文件：

```bash
cp .env.example .env.local
```

在 `.env.local` 中填入：

```bash
LLM_API_BASE_URL=https://integrate.api.nvidia.com/v1
LLM_API_KEY=你的_NVIDIA_API_KEY
LLM_MODEL_ID=openai/gpt-oss-120b
LLM_THINKING_INTENSITY=high
LLM_MAX_TOKENS=4096
```

启动开发服务：

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

### 部署到 Vercel

推荐流程是先把代码推送到 GitHub，再从 Vercel 导入仓库。

1. 打开 [Vercel](https://vercel.com) 并登录。
2. 点击 **Add New...** → **Project**。
3. 选择 GitHub 仓库 `HuayongHu/PaperBuddy`。
4. Framework Preset 保持为 **Next.js**。
5. 在 **Environment Variables** 中添加：

```bash
LLM_API_BASE_URL=https://integrate.api.nvidia.com/v1
LLM_API_KEY=你的_NVIDIA_API_KEY
LLM_MODEL_ID=openai/gpt-oss-120b
LLM_THINKING_INTENSITY=high
LLM_MAX_TOKENS=4096
```

6. 点击 **Deploy**。
7. 部署完成后，打开 Vercel 给出的域名即可使用。

### 环境变量说明

| 变量名 | 必填 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `LLM_API_BASE_URL` | 否 | `https://integrate.api.nvidia.com/v1` | LLM API 根地址。推荐不包含 `/chat/completions`。 |
| `LLM_API_KEY` | 是 | 无 | NVIDIA API Key，只能配置在服务端环境变量中。 |
| `LLM_MODEL_ID` | 否 | `openai/gpt-oss-120b` | 模型 ID。 |
| `LLM_THINKING_INTENSITY` | 否 | `high` | 推理强度，可选 `low`、`medium`、`high`。 |
| `LLM_MAX_TOKENS` | 否 | `4096` | 单次最大输出 token 数。 |

### 使用注意

- PDF 文本提取在浏览器本地完成，服务端不保存 PDF 文件。
- 扫描版或图片型 PDF 可能无法提取文字，问答效果会受影响。
- 润色页前端建议单次输入不超过 2000 字；服务端最大接受 10000 字符。
- PDF 问答最多使用前 60000 字符的提取文本。

### 常用命令

```bash
npm test
npm run build
npm run dev
```

---

## English

### What PaperBuddy does

- **Paper polishing**: paste an academic paragraph or section and get paragraph-by-paragraph comments and revised text.
- **PDF understanding**: upload a PDF, extract text in the browser, and ask follow-up questions based on the paper content.
- **No user accounts**: the API key is stored only as a server-side environment variable.
- **Local history**: polishing history and PDF chat history are stored in browser `localStorage`.

### Tech stack

- Next.js App Router
- React + TypeScript
- `pdfjs-dist` for PDF text extraction and preview
- Vitest for core utility tests
- Vercel Serverless API Routes

### Run locally

Install dependencies:

```bash
npm install
```

Copy the environment file:

```bash
cp .env.example .env.local
```

Set the environment variables in `.env.local`:

```bash
LLM_API_BASE_URL=https://integrate.api.nvidia.com/v1
LLM_API_KEY=your_nvidia_api_key
LLM_MODEL_ID=openai/gpt-oss-120b
LLM_THINKING_INTENSITY=high
LLM_MAX_TOKENS=4096
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Deploy to Vercel

The recommended workflow is to push the code to GitHub first, then import the repository from Vercel.

1. Open [Vercel](https://vercel.com) and sign in.
2. Click **Add New...** → **Project**.
3. Select the GitHub repository `HuayongHu/PaperBuddy`.
4. Keep Framework Preset as **Next.js**.
5. Add these **Environment Variables**:

```bash
LLM_API_BASE_URL=https://integrate.api.nvidia.com/v1
LLM_API_KEY=your_nvidia_api_key
LLM_MODEL_ID=openai/gpt-oss-120b
LLM_THINKING_INTENSITY=high
LLM_MAX_TOKENS=4096
```

6. Click **Deploy**.
7. Open the Vercel deployment URL when the build finishes.

### Environment variables

| Name | Required | Default | Description |
| --- | --- | --- | --- |
| `LLM_API_BASE_URL` | No | `https://integrate.api.nvidia.com/v1` | LLM API base URL. Prefer omitting `/chat/completions`. |
| `LLM_API_KEY` | Yes | None | NVIDIA API key. Keep it server-side only. |
| `LLM_MODEL_ID` | No | `openai/gpt-oss-120b` | Model ID. |
| `LLM_THINKING_INTENSITY` | No | `high` | Reasoning effort: `low`, `medium`, or `high`. |
| `LLM_MAX_TOKENS` | No | `4096` | Maximum output tokens for one response. |

### Notes

- PDF text extraction happens in the browser. The server does not store uploaded PDF files.
- Scanned or image-only PDFs may not produce extractable text.
- The polishing page recommends up to 2000 characters per request; the server accepts up to 10000 characters.
- PDF Q&A uses up to the first 60000 extracted characters.

### Useful commands

```bash
npm test
npm run build
npm run dev
```

## License

MIT

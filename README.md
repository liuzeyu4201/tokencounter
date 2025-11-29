# Token Counter VS Code 扩展

在编辑器右上角点击按钮，选择内置大模型词表后即可统计当前文件的字符数、词数和 Token 数，帮助你快速评估 prompt 规模。

## 功能
- 右上角按钮一键统计当前文件；Alt 功能为快速切换模型。
- 内置 Vocab 词表，按模型最长匹配贪心分词计算 Token。
- 记忆上次选定的模型，Quick Pick 首项优先。
- 统计结果弹窗显示（模型/字符/词数/Token），状态栏临时展示 Token 摘要。
- 自动将统计结果追加到工作区根目录的 `token-counter-report.md`（若无工作区则写入全局存储）。

## 内置模型词表
- DeepSeek-R1
- Kimi K2
- Qwen3-32B
- Qwen2.5-32B

## 使用
1. 安装扩展后，打开任意文本文件。
2. 点击编辑器右上角的 Token Counter 图标（或命令面板运行 `Token Counter: 统计当前文件`）。
3. 首次会要求选择模型；之后默认使用上次模型，可随时通过 Alt 按钮或命令 `Token Counter: 选择模型` 更换。
4. 结果会以弹窗和状态栏提示展示。

更多快捷键示例与用法见 `BasicCommand.md`。

## 增加模型词表
- 将模型词表放入 `Vocab` 目录并命名为 `<model>-vocab.json` 或 `<model>_vocab.json`。
- 文件需为 JSON，键为 tokenizer 的 token 字符串，值为其索引（计数时仅用到键）。
- 重启 VS Code 或重载窗口后即可在模型列表看到新词表。

## 发布到商店
按照 `User.md` 步骤准备发布者、打包 `.vsix` 并运行 `vsce publish`。

## 通过 GitHub 分发
1. 打包扩展：`vsce package`（生成形如 `tokencounter-0.0.x.vsix`）。  
2. 创建 Git 标签（可选）：`git tag v0.0.x && git push origin v0.0.x`。  
3. GitHub Releases：在仓库页面创建 Release，上传 `.vsix` 作为附件，说明版本变化，发布后任何人可直接下载。  
4. GitHub Packages（可选）：在 Release 或 CI 中上传 `.vsix` 到 GitHub Packages，方便脚本化下载。  
5. 在 README 的下载链接中引用最新 Release 资产，便于用户获取。

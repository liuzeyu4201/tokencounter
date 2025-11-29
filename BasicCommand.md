# Token Counter 快捷键与用法

- 入口：在编辑器右上角的按钮点击即可统计当前文件；Alt 功能为直接切换模型。
- 命令面板：
  - `Token Counter: 统计当前文件`（命令 ID: `tokencounter.countTokens`）
  - `Token Counter: 选择模型`（命令 ID: `tokencounter.selectModel`）
- 建议绑定快捷键（示例）：
  - 统计：在 VS Code 打开“键盘快捷方式”，搜索 `tokencounter.countTokens` 绑定如 `Ctrl+Shift+T`（macOS 可用 `Cmd+Shift+T`）。
  - 选模型：搜索 `tokencounter.selectModel` 绑定如 `Ctrl+Alt+T`（macOS 可用 `Cmd+Alt+T`）。
- 统计结果：弹窗显示模型名、字符数、词数、Token 数，同时状态栏临时显示 Token 统计。
- 模型记忆：Quick Pick 会优先显示上次使用的模型，便于快速重复统计。

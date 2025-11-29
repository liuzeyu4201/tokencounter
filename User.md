# 在 VS Code 商店发布 Token Counter

按下列顺序操作即可将本扩展发布到 Marketplace。

1) 准备环境  
   - 安装 Node.js (>= 18)。  
   - 全局安装打包工具：`npm install -g @vscode/vsce`.

2) 检查扩展元数据  
   - 打开 `package.json`，将 `publisher`、`name`、`displayName`、`repository`、`icon` 等字段改成你在 Marketplace 想使用的值。  
   - 每次发布前更新 `version`，遵循语义化版本。

3) 打包扩展  
   - 在项目根目录执行：`vsce package`。  
   - 生成的 `.vsix` 文件即为可安装包。可用 `code --install-extension <文件名>.vsix` 自测。

4) 申请发布者并登录  
   - 用 Microsoft 账号访问 https://aka.ms/vscodepat 创建 Azure DevOps 的 PAT（权限勾选 Marketplace > Manage）。  
   - 创建发布者：`vsce create-publisher <your-publisher-id>`。  
   - 登录：`vsce login <your-publisher-id>`，输入上一步生成的 PAT。

5) 发布到商店  
   - 确认版本号已更新，然后运行：`vsce publish`（或 `vsce publish minor/patch/major`）。  
   - 发布完成后，扩展会出现在 VS Code 扩展商店；可以在发布者页面管理后续更新。

提示：若需要在扩展卡片展示图标，可在仓库中添加 `icon` 文件并在 `package.json` 中设置 `icon` 字段。

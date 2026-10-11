# dsh-mobile-ui

为 [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness) Web UI 提供手机浏览器适配的插件。

仅在视口宽度 **≤760px** 时启用，桌面端保留原有布局。通过 DSH 插件机制注入样式和客户端行为，不修改 DSH 源码，也不改变认证或服务监听设置。

## 功能

- **手机布局**：对话占满屏幕宽度，侧栏改为抽屉，顶部提供菜单和新建会话按钮；选择会话后自动收起抽屉。
- **触摸导航**：侧栏边缘滑动打开、向左滑动关闭；设置详情页可通过边缘滑动返回分类列表。
- **设置与菜单**：设置页使用全屏的分类列表/详情两级布局，适配底部弹出菜单和横向标签栏。
- **输入框统计**：展示上下文占用、输出速度（TPS）和缓存命中率，点击查看完整统计；仅显示当前会话已提供的数据。
- **手机输入**：回车换行，通过发送按钮提交；输入法正在组词时不接管回车，已有 `/`、`@` 候选列表的选择行为保留；发送后收起输入法。
- **键盘视口适配**：跟随 `visualViewport` 的高度和偏移，保持输入区域可见，不通过强制页面滚动修正位置。
- **边界回弹处理**：关闭对话滚动容器的纵向回弹；输入框聚焦时，仅拦截到达上下边界后继续向外的单指纵向拖动。正常滚动、反向拖动、横向/多指手势及输入区操作保留；可滚动的嵌套内容优先处理。
- **细节适配**：安全区域、输入字号、浏览器主题色、触摸按钮，以及桌面悬停提示的隐藏。

## 兼容性

- 已在 **DSH 0.2.0-rc.2** 上部署使用。
- Node.js **≥22**，浏览器需支持 `visualViewport`、现代 CSS 和 DSH Web 客户端。
- 测试环境覆盖手机尺寸布局、长对话滚动、视口缩小/恢复及触摸边界处理；本次 iPhone 键盘打开后的滚动问题已由实际使用者确认解决。
- 插件依赖 DSH 的 `data-*` 属性及部分 CSS-module 类名后缀。新的 DSH 版本可能改变这些结构；升级后应检查手机布局和键盘行为。`engines.dsh` 的最低版本不是对所有后续版本的兼容保证。
- 非官方插件，不提供离线缓存或独立的 PWA 服务。

## 安装

安装到 Web profile：

```sh
dsh plugin --profile web add github:JJDonald/dsh-mobile-ui
```

也可以克隆后从本地路径安装：

```sh
git clone https://github.com/JJDonald/dsh-mobile-ui.git
cd dsh-mobile-ui
dsh plugin --profile web add "file:$(pwd)"
```

安装后重新启动正在使用的 DSH Web 实例，再**完整刷新浏览器页面**。不要只关闭输入法或切换会话；页面需要重新加载插件脚本和首页注入样式。

代码已经放在 `lib/` 中，安装无需执行构建脚本。若 DSH 不在 `PATH` 中，请使用你自己的 DSH 启动命令执行 `plugin --profile web add ...`。

## 更新与卸载

从 GitHub 重新安装：

```sh
dsh plugin --profile web add github:JJDonald/dsh-mobile-ui
```

使用本地克隆时，先执行 `git pull --ff-only`，再重新执行本地安装命令。

卸载：

```sh
dsh plugin --profile web remove dsh-mobile-ui
```

更新或卸载后，同样重新启动 DSH Web 并完整刷新页面。重启前先结束正在运行的任务。

## 文件结构

```text
lib/index.js     服务端插件：首页 viewport、手机模式开关及样式注入
lib/client.js    客户端插件：UI 插槽、统计、导航和键盘/触摸行为
lib/mobile.css   仅在手机模式生效的样式
cordis.patch.yml 将 mobile-ui 插件行挂载到 DSH profile
package.json    DSH bundle 与 Web 客户端模块声明
```

插件没有自己的 API、数据存储、遥测服务或第三方请求。它读取 DSH 已提供的会话统计，并操作当前页面的布局、焦点及触摸事件；不上传会话内容或凭据。

## 反馈问题

请在 [Issues](https://github.com/JJDonald/dsh-mobile-ui/issues) 中说明 DSH 版本、手机系统、浏览器版本、键盘状态和复现步骤。截图或录屏请先遮挡私人对话、密钥、Cookie 等信息。

## License

[MIT](LICENSE)

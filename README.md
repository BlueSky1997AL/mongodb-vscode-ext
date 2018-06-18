# Auto MongoDB

![预览](asset/status_bar.png)

&#x1F44B; 免去寻找下载资源，安装，配置 MongoDB 数据库的繁琐步骤  
&#x2728; 打开编辑器，一次点击，即可自动下载安装配置运行 MongoDB 数据库

> &#x26A0; **请留意：** 我们使用 Sentry 记录插件错误日志，错误信息会自动发给开发者以解决问题。请放心，错误信息中不含有您的任何个人信息。如果您不期望我们这么做，后续版本中将会加入反馈信息的开关。有了您的支持与反馈我们才能做的更好，也非常欢迎您到[GitHub Issue](https://github.com/BlueSky1997AL/mongodb-vscode-ext/issues)中提交反馈。

## 开始

在 VSCode 中搜索并安装插件后，重载窗口，点击编辑器左下角状态栏 MongoDB 图标即可  
等待下载安装完成后，图标变为绿色即可连接使用数据库 &#x1F680;  
> &#x1F340; Tips: 状态栏图标为非绿色时，表示数据库未启动

再次单击绿色的数据库图标即可显示相关数据库的操作菜单，如下图

![主菜单](asset/main_menu.png)

## 特征

  + 一次下载即可使用
  + 一键式简易操作，编辑器状态栏直观显示数据库运行状态
  + 支持自定义配置，包括：
    - 二进制文件及数据库文件的存放路径
    - 数据库版本，平台，架构等
    - 数据库运行端口，运行模式等
  + 几乎支持所有平台：macOS / Linux / Windows

  > &#x1F43E; Tips：二进制及数据库文件默认存储位置为：`~/.mongodb`

## 要求

  + VSCode 版本不低于 1.23.0

## 插件配置项

在 VSCode 配置 / 工作区配置（ `Ctrl + Comma` ）中添加以下配置项：

  + autoMongoDB.instance.port

    - 数据库运行端口。
    - 数据类型：number。
    - 默认值：27017。

  + autoMongoDB.instance.dbPath

    - 数据库文件存储路径。 默认存储位置: ~/.mongodb/data (POSIX)，C:\\Users\\用户名\\.mongodb\\data (Windows)。
    - 数据类型：string。

  + autoMongoDB.instance.storageEngine

    - 数据库存储引擎模式。
    - 数据类型：string。
    - 默认值：ephemeralForTest。

  + autoMongoDB.binary.version

    - 下载安装数据库可执行文件的版本。
    - 数据类型：string。
    - 默认值：3.4.4。

  + autoMongoDB.binary.downloadDir

    - 数据库可执行文件的下载路径。默认存储位置: ~/.mongodb/binaries (POSIX)，C:\\Users\\用户名\\.mongodb\\binaries (Windows)。
    - 数据类型：string。

  + autoMongoDB.binary.platform

    - 下载安装数据库可执行文件的平台。注意：我们不推荐您修改此选项，因为我们会自动判断您的安装环境。此选项仅在需要时修改。
    - 数据类型：string。

  + autoMongoDB.binary.arch

    - 下载安装数据库可执行文件的架构。注意：我们不推荐您修改此选项，因为我们会自动判断您的安装环境。此选项仅在需要时修改。
    - 数据类型：string。

## 已知问题

  + 开启多个编辑器窗口时，主窗口可以正常对插件进行操作，其他窗口失效
  + 如果系统中存在已安装的 MongoDB，插件可能会出错（行为异常）

## ToDos

  + 解决开启多个编辑器窗口时出现的问题
  + 添加错误信息反馈开关

## 发布日志

我们正在努力修复问题并增添新的功能，欢迎到我的[GitHub Issue页](https://github.com/BlueSky1997AL/mongodb-vscode-ext/issues)提出反馈和建议

### 0.1.0

  + 添加配置功能，支持自定义程序及数据库的参数配置

### 0.0.1

  + 初始发布版本

## 其他

  + [GitHub 仓库](https://github.com/BlueSky1997AL/mongodb-vscode-ext)

-----------------------------------------------------------------------------------------------------------

**希望你能喜欢它!&#x1F60A;**

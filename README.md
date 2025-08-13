# Illustrious 系列模型角色提示词查询工具

本项目旨在为 [WAI-NSFW-illustrious-SDXL](https://civitai.com/models/827184?modelVersionId=1183765) 系列模型提供便捷的角色提示词查询功能，帮助用户快速获取高质量的角色生成参数。

## 项目起源

本项目基于 [WAI-NSFW-illustrious-character-select](https://github.com/lanner0403/WAI-NSFW-illustrious-character-select) 进行二次开发，感谢原作者的无私分享与贡献。
另一个项目 character_select_stand_alone_app 项目对我而言有点太大了，我只需要其中的角色提示词查询功能，所以fork了这个项目，只保留了角色提示词查询功能，其他功能都去掉了。

## 核心功能

- **角色提示词查询**：快速检索和获取illustrious系列模型的角色提示词
- **自定义扩展**：支持通过配置文件添加新角色和自定义动作
- **多语言支持**：提供中英文界面切换
- **AI辅助生成**：集成AI功能辅助生成角色描述（需配置API密钥）

### 在线使用
打开浏览器访问 [https://zhuanqianfish.github.io/Luckyfish-illustrious-character-select/](https://zhuanqianfish.github.io/Luckyfish-illustrious-character-select/)

## 本地独立运行指南

本项目可完全独立运行，无需依赖stable-diffusion-webui环境：

### Windows系统
1. 安装好python环境
1. 双击执行 `runserver.bat`
2. 打开浏览器访问 [http://localhost:8888/](http://localhost:8888/)



### 作为table-diffusion-webui插件
请到原项目仓库查看插件安装方法以及相关说明
[WAI-NSFW-illustrious-character-select](https://github.com/lanner0403/WAI-NSFW-illustrious-character-select)
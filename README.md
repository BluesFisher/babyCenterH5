# h5_nuxt

h5 nuxt框架

## 开发流程

### 安装依赖

$ tnpm install

### 修改 host 文件

-   Windows
    【C:\Windows\System32\drivers\etc\host】，添加如下配置

    ```bash
    127.0.0.1 h5-healthd.tengmed.com
    ```

### 本地开发环境

$ npm run dev

浏览器直接访问
http://h5-healthd.tengmed.com

### 构建测试版本

$ npm run test

### 构建正式版本

$ npm run build

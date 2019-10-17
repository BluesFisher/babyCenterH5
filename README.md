# h5_nuxt

h5 nuxt框架

## 开发流程

### 安装依赖

$ tnpm install

### 修改 host 文件

-   Windows
    【C:\Windows\System32\drivers\etc\host】，添加如下配置

    ```bash
    127.0.0.1 honey-center.com.cn
    ```

### 本地开发环境

$ npm run dev

浏览器直接访问
http://localhost:3002


### 构建正式版本&服务器部署

1、npm run build

2、将.nuxt、package.json、static、nuxt.config.ts上传到服务器，npm i

3、修改package.json

```
"scripts": {
        "lint": "eslint --ext .ts,.js,.vue --ignore-path .gitignore .",
        "precommit": "npm run lint",
        "test": "jest",
        "dev": "nuxt",
        "build": "nuxt build",
        "start": "nuxt start -p 3001",
        "generate": "nuxt generate",
        "start-dev": "nuxt"
    },
    "config": {
        "nuxt": {
            "host": "0.0.0.0",
            "port": "3001"
        }
    },
```

4、pm2 start npm --name "nuxt" -- start



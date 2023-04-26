# chatgpt-wecom-server
## 描述

使用 [Nest](https://github.com/nestjs/nest) 框架搭建的可在企业微信使用ChatGPT的应用消息API服务。

> 🧑‍💻 ChatGPT 模型是由 OpenAI 训练的大型语言模型，能够生成类似于人类的文本。只需要提供一个提示，它就能够生成延续对话或者扩展给定提示的回应。

## 效果展示

- 在企业微信的应用列表中

![image](https://github.com/johnhom1024/chatgpt-wecom-server/raw/main/images/chatgpt_in_wecom.jpg)

- 在企业微信与ChatGPT对话

![image](https://github.com/johnhom1024/chatgpt-wecom-server/raw/main/images/chat_with_application.jpg)

## 使用说明

这里会提供详细的使用说明和步骤，以便你能够快速构建你的 ChatGPT 应用。

### 准备工作

你需要一台电脑，并且这台电脑已经准备好了以下的事情：

- 需要一个公网域名或者公网IP，可以被外网访问。（接收用户消息时，企业微信会向这个域名或者IP发送包含用户消息的请求）
- 可以访问`openai`的API。（可以访问`https://chat.openai.com/`的网页版即可）
- 安装好了Node.js（Nest框架要求Node版本>=12，13除外）


在项目启动前，我们还需要拿到以下用到key，并填写到项目根目录的`.env`文件中

```
# openai的API Secret key
OPENAI_API_KEY=XXX

# 企业 corp_id
CORP_ID=XXXX
# 企业应用的 id
WECOM_AGENT_ID=XXX
# 企业应用的 secret_key
APP_SECRET_KEY=XXX

# 获取用户消息的token
WECOM_GET_MESSAGE_TOKEN=XXX
# 消息加密的密钥
WECOM_ENCODING_AES_KEY=XX
```

> TODO 这里后面再详细介绍如何获取企业微信用到的Key

### 安装

```bash
$ pnpm install
```

### 运行

```bash
# 打包
$ pnpm build

# 生产环境下运行
$ pnpm start:prod
```

> 注意：Nest框架在执行build时，并不会把依赖一起打包到dist文件中，所以这里执行`pnpm start:prod`时，会用到当前目录下的`node_modules`文件夹里的依赖文件。

### 企业微信接入

这里是最后一步啦，只在自建应用详情👉接收消息👉API接收消息，在**接收消息服务器配置**中的**URL**项：


![image](https://github.com/johnhom1024/chatgpt-wecom-server/raw/main/images/accept_message_setting.jpg)

填入以下URL：

```
# 这里的协议需要根据你的公网服务是否配置证书，如果可以的话，可以填https
http://<你的域名或者公网IP>/wecom/getMessage
```

然后点击下方的**保存**按钮，此时企业微信会根据以上的URL发送一个`Get`请求进行验证，验证通过后配置就会保存成功。

最后，你就可以直接在企业微信app👉工作台里，跟ChatGPT进行开心的对话啦。

## 其他说明

这个后端服务是通过直接调用`openai`库里提供的api，具体可以通过这里查看使用说明：[api-reference](https://platform.openai.com/docs/api-reference/completions/create)

暂时还没有上下文衔接的功能，后面考虑直接使用已经对`openai`的api封装好的一个库：[chatgpt-api](https://github.com/transitive-bullshit/chatgpt-api)


## TODO

- [x] 支持上下文衔接
- [ ] 通过发送消息查看和切换可用的语言模型
- [ ] 通过发送消息查看token的使用量
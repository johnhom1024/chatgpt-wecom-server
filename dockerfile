FROM node:18-alpine

# 需要拷贝包括node_module到工作目录
COPY . ./

CMD npm run start:prod
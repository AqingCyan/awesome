# Awesome Server

## 接口文档

TODO

## 额外内容

服务端项目中一些开发之外的补充

### 生成密钥

密钥是指私钥和公钥，我们可以通过以下方法生成，并用于密码的加密解密。

```
mkdir config
cd config/
openssl
genrsa -out private.key 4096
rsa -in private.key -pubout -out public.key
exit
```

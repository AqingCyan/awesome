# Awesome Server

## 生成密钥

```
mkdir config
cd config/
openssl
genrsa -out private.key 4096
rsa -in private.key -pubout -out public.key
exit
```

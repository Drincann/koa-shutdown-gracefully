# Koa shutdown gracefully

用来对服务器进行优雅停机，以平滑重启 Koa 应用。

## example

当 Node.js 应用收到 SIGINT 信号后，直到应用关闭前，其行为是向所有新请求返回 503 状态.

```js
const { shutdownGracefully } = require('koa-shutdown-gracefully');
const app = require('koa')();

app.use(shutdownGracefully())
  .use(/* your services */)
  .listen(/* port */);
```

你可以用下面的代码来测试:

!注意，使用同一浏览器进程，即使在不同标签下同时访问仍会阻塞，它们使用的应该是同一个 socket 连接。

你可以尝试使用不同的浏览器来同时访问和测试，它们会使用本地不同的端口号。

```js
const { shutdownGracefully } = require('koa-shutdown-gracefully');
const app = new (require('koa'))();
app.use(shutdownGracefully())
  .use(async (ctx,) => {
    await new Promise(r => setTimeout(() => r(null), 10000))
    ctx.set('Content-Type', 'text/html')
    ctx.body = '<h1>hello world</h1>'
  }).listen(80)
```

## build

```sh
npm run build # npx tsc index.ts --outDir dist
```

import * as Koa from 'koa'
import * as process from 'process'

export function shutdownGracefully() {
  const reqSet = new Set<ReturnType<Koa.Next>>()
  let exiting = false
  process.on('SIGINT', async () => {
    exiting = true
    await Promise.allSettled(Array.from(reqSet))
    setImmediate(() => {
      process.exit(0)
    })
  })

  async function handleRequest(next: Koa.Next) {
    const handlePromise = next()
    reqSet.add(handlePromise)
    await handlePromise
    reqSet.delete(handlePromise)
  }

  return async (ctx: Koa.Context, next: Koa.Next) => {
    if (exiting) {
      ctx.status = 503
      return
    }
    await handleRequest(next)
  }
}

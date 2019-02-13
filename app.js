'use strict';
require('app-module-path').addPath(__dirname + '/');

const Koa = require('koa')
const app = new Koa()
const cors = require('kcors')

const convert = require('koa-convert')
const bodyparser = require('koa-bodyparser')()
const logger = require('koa-logger')

const mongodb = require('db/mongodb')
const mongoosePaginate = require('mongoose-paginate')
const redis = require('db/redis')

const config = require('config/env')[process.env.NODE_ENV || 'development']
const middleware = require('middlewares')
const router = require('./routes')

const _static = require('koa-static')   //静态资源服务插件
const path = require('path')

// data server
mongodb.connect()
// redis.connect()

// global options
mongoosePaginate.paginate.options = {
  limit: config.APP.LIMIT
}

app.proxy = true

app.use(cors({
  credentials: true
}))

// middleware
app.use(convert(logger()))
  .use(bodyparser)

// 配置静态资源
const staticPath = './static'
app.use(_static(
  path.join(__dirname, staticPath)
))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// router
app.use(middleware.errorHandler)
app.use(router.routes(), router.allowedMethods())

module.exports = app

/**
 * @file 用户及权限数据模型
 * @author mapleChain(popm73@163.com)
 */

const mongoose = require('../db/mongodb').mongoose
const Schema = mongoose.Schema
const md5 = require('md5')
const config = require('config/env')[process.env.NODE_ENV || 'development']

const UserSchema = new Schema({
  // 用户名
  username: { type: String, default: '' },

  // 密码
  password: {
    type: String,
    default: md5(config.AUTH.default.password)
  },

  // 签名
  slogan: { type: String, default: '' },

  // 头像
  gravatar: { type: String, default: '' },

  // 扩展属性
  extends: [{
    name: { type: String, validate: /\S+/ },
    value: { type: String, validate: /\S+/ }
  }]
})

var User = module.exports = mongoose.model('User', UserSchema)

var initUsers = [
  { // 测试
    username: 'mapleChain',
    password: '19891106'
  }
]

initUsers.forEach(function (p) {
  User.findOne({
    username: p.username
  }).then(function (data) {
    if (data) {
      console.dir('User existed:' + data.username)
      return null
    } else {
      var hashValue = md5(p.password)
      p.password = hashValue
      var cModel = new User(p)
      return cModel.save()
    }
  }).then(function (data) {
    console.log(`User created:${data?data.username:null}`)
  }).catch(function (err) {
    console.log(err.message)
  })
})

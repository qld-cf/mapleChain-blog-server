/**
 * @file 标签数据模型
 * @author mapleChain(popm73@163.com)
 */

const mongoose = require('../db/mongodb').mongoose
const autoIncrement = require('mongoose-auto-increment-fix')
const paginate = require('mongoose-paginate')
const Schema = mongoose.Schema

// 自增ID初始化
autoIncrement.initialize(mongoose.connection)

const TagSchema = new Schema({

  // 分类名称
  name: { type: String, required: true, validate: /\S+/ },

  // 描述
  description: String,

  // 创建时间
  createAt: { type: Date, default: Date.now },

  // 修改时间
  updateAt: { type: Date },

  // 扩展属性
  extends: [{
    name: { type: String, validate: /\S+/, default: 'icon' },
    value: { type: String, validate: /\S+/,  default: '测试标签'}
  }]
})

// 翻页 + 自增ID插件配置
TagSchema.plugin(paginate)
TagSchema.plugin(autoIncrement.plugin, {
  model: 'Tag',
  field: 'id',
  startAt: 1,
  incrementBy: 1
})

// 更新修改时间
TagSchema.pre('save', function (next) {
  this.updateAt = Date.now()
  next()
})
TagSchema.pre('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, { updateAt: Date.now() })
  next()
})

var Tag = module.exports = mongoose.model('Tag', TagSchema)

// var initTag = [
//   { // 测试
//     name: '测试标签',
//     extends: [{
//       name: 'icon',
//       value: 'test'
//     }]
//   }
// ]

// initTag.forEach(function (p) {
//   Tag.findOne({
//     name: p.name
//   }).then(function (data) {
//     if (data) {
//       console.dir('Tag existed:' + data.name)
//       return null
//     } else {
//       var cModel = new Tag(p)
//       return cModel.save()
//     }
//   }).then(function (data) {
//     console.log(`User created:${data?data.name:null}`)
//   }).catch(function (err) {
//     console.log(err.message)
//   })
// })

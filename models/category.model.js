/**
 * @file 分类模型
 * @author mapleChain(popm73@163.com)
 */

const mongoose = require('../db/mongodb').mongoose
const autoIncrement = require('mongoose-auto-increment-fix')
const paginate = require('mongoose-paginate')
const Schema = mongoose.Schema

// 自增ID初始化
autoIncrement.initialize(mongoose.connection)

const CategorySchema = new Schema({

  // 分类名称
  name: { type: String, required: true, validate: /\S+/ },

  // 描述
  description: String,

  // 父分类
  // super: { type: Schema.Types.ObjectId },
  super: { type: Schema.Types.ObjectId, ref: 'Category', default: '5962a5f37bde228394da6f72'  },

  // 创建时间
  createAt: { type: Date, default: Date.now },

  // 修改时间
  updateAt: { type: Date },

  // 扩展属性
  extends: [{
    name: { type: String, validate: /\S+/, default: 'icon'},
    value: { type: String, validate: /\S+/,  default: '测试分类'}
  }]
})

CategorySchema.set('toObject', { getters: true })

// 翻页 + 自增ID插件配置
CategorySchema.plugin(paginate)
CategorySchema.plugin(autoIncrement.plugin, {
  model: 'Category',
  field: 'id',
  startAt: 1,
  incrementBy: 1
})

// 更新修改时间
CategorySchema.pre('save', function (next) {
  this.updateAt = Date.now()
  next()
})
CategorySchema.pre('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, { updateAt: Date.now() })
  next()
})

var Category = module.exports = mongoose.model('Category', CategorySchema)

// var initCategory = [
//   { // 测试
//     name: '测试分类',
//     extends: [{
//       name: 'icon',
//       value: 'test'
//     }]
//   }
// ]

// initCategory.forEach(function (p) {
//   Category.findOne({
//     name: p.name
//   }).then(function (data) {
//     if (data) {
//       console.dir('Tag existed:' + data.name)
//       return null
//     } else {
//       var cModel = new Category(p)
//       return cModel.save()
//     }
//   }).then(function (data) {
//     console.log(`Category created:${data?data.name:null}`)
//   }).catch(function (err) {
//     console.log(err.message)
//   })
// })

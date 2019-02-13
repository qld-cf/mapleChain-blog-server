/**
 * @file 文章数据模型
 * @author mapleChain(popm73@163.com)
 */

const mongoose = require('../db/mongodb').mongoose
const autoIncrement = require('mongoose-auto-increment-fix')
const paginate = require('mongoose-paginate')
const Schema = mongoose.Schema
const { MongoClient, ObjectId } = require('mongodb')
// 自增ID初始化
autoIncrement.initialize(mongoose.connection)

const ArticleSchema = new Schema({

  // 文章标题
  title: { type: String, required: true, validate: /\S+/ },

  // 文章关键词
  keywords: [{ type: String }],

  // 描述
  description: String,

  // 文章内容
  content: { type: String, required: true, validate: /\S+/ },

  // 缩略图
  thumb: String,

  // 文章发布状态 => -1回收站，0草稿，1已发布
  state: { type: Number, default: 1 },

  // 文章公开状态 = // -1私密，0需要密码，1公开
  pub: { type: Number, default: 1 },

  // 文章密码 => 加密状态生效
  password: { type: String, default: '' },

  // 文章标签
  tag: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],

  // 文章分类
  // category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },

  // 其他元信息
  meta: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 }
  },

  // 创建时间
  createAt: { type: Date, default: Date.now },

  // 修改时间
  updateAt: { type: Date },

  // 扩展属性
  extends: [{
    name: { type: String, validate: /\S+/  },
    value: { type: String, validate: /\S+/ }
  }]
})

ArticleSchema.set('toObject', { getters: true })

// 翻页 + 自增ID插件配置
ArticleSchema.plugin(paginate)
ArticleSchema.plugin(autoIncrement.plugin, {
  model: 'Article',
  field: 'id',
  startAt: 1,
  incrementBy: 1
})

// 更新修改时间
ArticleSchema.pre('save', function (next) {
  this.updateAt = Date.now()
  next()
})
ArticleSchema.pre('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, { updateAt: Date.now() })
  next()
})

ArticleSchema.virtual('t_content').get(function () {
  const content = this.content
  return !!content ? content.substring(0, 130) : content
})

var Article = module.exports = mongoose.model('Article', ArticleSchema)

const CategoryModel = require('./category.model')
const TagModel = require('./tag.model')

var articleIds = [new ObjectId]
var tagIds = [new ObjectId]
var categoryIds = [new ObjectId]

var articles = []
var tags = []
var categories = []

articles.push({
  _id: articleIds[0],
  title: '测试文章',
  content: '这里是测试内容',
  extends: [{
    name: 'icon',
    value: 'test'
  }],
  tag: [tagIds[0]],
  category: [categoryIds[0]]
})

categories.push({
  _id: categoryIds[0],
  name: '测试分类',
  extends: [{
    name: 'icon',
    value: 'test'
  }]
})
tags.push({
  _id: tagIds[0],
  name: '测试标签',
  extends: [{
    name: 'icon',
    value: 'test'
  }]
})

Article.findOne({
  title: '测试文章'
}).then(function (data) {
  console.log('data', data)
  if (data) {
    console.dir('Article existed:' + data.title)
    return null
  } else {
    Article.create(articles, function (err, docs) {
      CategoryModel.create(categories, function (err, docs) {
        TagModel.create(tags, function (err, docs) {
          console.log('docs', docs)
        })
      })
    })
  }
}).then(function (data) {
  console.log(`User created:${data?data.title:null}`)
}).catch(function (err) {
  console.log(err.message)
})

// initArticle.forEach(function (p) {
//   Article.findOne({
//     title: p.title
//   }).populate({
//     path: 'tag',
//     model: 'Tag' // 在User集合中查找该ID
//   }).populate({
//     path: 'category',
//     model: 'Category' // 在User集合中查找该ID
//   }).then(function (data) {
//     console.log('data', data)
//     if (data) {
//       console.dir('Article existed:' + data.title)
//       return null
//     } else {
//       var cModel = new Article(p)
//       return cModel.save()
//     }
//   }).then(function (data) {
//     console.log(`User created:${data?data.title:null}`)
//   }).catch(function (err) {
//     console.log(err.message)
//   })
// })

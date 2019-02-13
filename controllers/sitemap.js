/**
 * @file 网站地图控制
 * @author mapleChain(popm73@163.com)
 */

const fs = require('fs')

const createSiteMap = require('utils/sitemap')

class SiteMap {
  static async get (ctx) {
    let sitemap = await createSiteMap()

    ctx.status = 200
    ctx.set('Content-Type', 'application/xml')
    ctx.body = sitemap

  }
}

module.exports = SiteMap

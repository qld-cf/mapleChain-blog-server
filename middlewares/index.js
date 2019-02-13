/**
 * @file middlewares统一出口
 * @author mapleChain(popm73@163.com)
 */

const verifyToken = require('./verifyToken')
const errorHandler = require('./errorHandler')

module.exports = {
  verifyToken,
errorHandler}

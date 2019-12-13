'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
	BASE_URL:'"/wt"',
	WSS:'"ws://192.168.1.186:8085/socketHandler"'
})

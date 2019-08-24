'use strict'
const { mysql } = require('@kompass/config')

var db = require('knex')({
  client: 'mysql',
  debug: false,
  connection: mysql,
})

module.exports = {
  db
}

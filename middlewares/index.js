'use strict'
const fs = require('fs')
const jwt = require ('jsonwebtoken')
const path = require('path')
const { domain, unAuthPaths } = require('@kompass/config')

var verify = (req, res, next) => {
  if( unAuthPaths.includes( req.path ) ) return next()
  if( req.headers.authorization ){
    try {
      var token = req.headers.authorization.split(" ")[1]
      var verifyOptions = {
        issuer: 	"Kompass Corp",
        subject: 	"kompass@konfio.com",
        audience: domain,
        expiresIn: 	"1m",
        algorithm: 	"RS256"
      }
      fs.readFile( path.resolve( __dirname, '../api/auth/public.key'), 'utf8',
      function( err, _public ){
        if( err ){
          return res.status(400).json({
            message : 'UnAuth',
            code : 4000
          })
        }
        try {
          var payload = jwt.verify(token, _public, verifyOptions)
          req.payload = payload
          next()
        } catch (e) {
          switch (e.name) {
            case 'TokenExpiredError':
            return res.status(401).json({
              message : 'TokenExpired',
              code : 4001
            })
            break;
          }
        }
      }
    )
  } catch (e) {
    return res.status(500).json({
      message : 'Server error',
      code : 5000
    })
  }
}else{
  return res.status(400).json({
    message : 'UnAuth',
    code : 4000
  })
}


}

var viewRouters = (baseUrl, routes) => {
  var Table = require('cli-table');
  var table = new Table({ head: ["Action", "Path"] });
  console.log('\nAPI for ' + baseUrl);
  console.log('\n********************************************');

  for (var key in routes) {
    if (routes.hasOwnProperty(key)) {
      var val = routes[key];
      if(val.route) {
        val = val.route;
        var _o = {};
        _o[val.stack[0].method]  = [ domain + baseUrl + val.path];
        table.push(_o);
      }
    }
  }

  console.log(table.toString());
  return table;
}

module.exports = {
  verify,
  viewRouters
};

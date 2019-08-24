module.exports = {
  production : false,
  login : true,
  mysql : {
    user : 'root',
    password : 'G1uFpt4KkqM3Ar1j',
    database : 'hack',
    port : 3306,
    host : '35.199.105.137'
  },
  domain : 'http://localhost',
  unAuthPaths : [
    '/api/v1/login',
    '/api/v1/online',
    '/api/v1/token',
    '/api/v1/register'
  ]
}

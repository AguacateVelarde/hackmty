module.exports = {
  production : false,
  login : true,
  mysql : {
    user : 'admin',
    password : 'hackMty.1',
    database : '',
    port : 3304,
    host : 'kompas.cro0pzwm9zfp.us-west-1.rds.amazonaws.com'
  },
  domain : 'http://localhost',
  unAuthPaths : [
    '/api/v1/login',
    '/api/v1/online',
    '/api/v1/token',
    '/api/v1/register'
  ]
}

const express = require( 'express' )
const http = require( 'http' )
const cors = require('cors')
const app = express()
const server = http.createServer(app)
const PORT = process.env.PORT || 8889
const api = require('@kompass/api')
const { viewRouters, verify } = require('@kompass/middlewares')
app.use( express.json() )
app.use( cors() )
app.use( verify )

app.use('/api/v1/', api )
app.get('*', (req, res)=>{
  res.status(404).json({
    estatus : 404,
    mensaje : 'Not found endpoint'
  })
})


server.on('listening', function(){
  console.info(`server listening on http://localhost:${ PORT }`)
  viewRouters( '/api/v1', api.stack )
})

server.listen(PORT)

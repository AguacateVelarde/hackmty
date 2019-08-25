const { Router } = require('express')
const router = Router()
const loginApi = require('./auth/login.js')
const { clienteApi, mejorCliente, gastoGrande, proovedorGrande, ivaCobrado, ivaPagado } = require('./aeq/perfil.js')
const{topClientes}=require('./lucia/cliente.js')
    /*const refresher = require( './auth/refresher.js')
    const { register, verifyUnique } = require('./auth/register.js')*/

router.post('/login', loginApi)
    /*router.post( '/token', refresher )
    router.post( '/register', verifyUnique, register )*/

router.get('/online', (req, res) => {
    res.json({ x: 'hi' })
})

router.get('/ventaGrande', clienteApi)

router.get('/mejorCliente', mejorCliente)

router.get('/gastoGrande', gastoGrande)

router.get('/proovedorGrande', proovedorGrande)

router.get('/ivaCobrado', ivaCobrado)

router.get('/ivaPagado', ivaPagado)

router.get('/topClientes', topClientes)

module.exports = router;

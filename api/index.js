const { Router } = require('express')
const router = Router()
const loginApi = require('./auth/login.js')
const { clienteApi, mejorCliente, gastoGrande, proovedorGrande, ivaCobrado, ivaPagado } = require('./aeq/perfil.js')
const { getGastos, getVentas, getGanancias, numProvedores } = require('./aeq/factura.js')
    /*const refresher = require( './auth/refresher.js')
    const { register, verifyUnique } = require('./auth/register.js')*/

router.post('/login', loginApi)
    /*router.post( '/token', refresher )
    router.post( '/register', verifyUnique, register )*/

router.get('/online', (req, res) => {
        res.json({ x: 'hi' })
    })
    //Página CLIENTE
router.get('/ventaGrande', clienteApi)

router.get('/mejorCliente', mejorCliente)

router.get('/gastoGrande', gastoGrande)

router.get('/proovedorGrande', proovedorGrande)

router.get('/ivaCobrado', ivaCobrado)

router.get('/ivaPagado', ivaPagado)

//Página Factura
router.get('/getGastos', getGastos)
router.get('/getVentas', getVentas)
router.get('/getGanancias', getGanancias)
router.get('/numProve', numProvedores)
module.exports = router;
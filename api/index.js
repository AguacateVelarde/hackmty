const { Router } = require('express')
const router = Router()
const loginApi = require('./auth/login.js')
const { ventaGrande, mejorCliente, gastoGrande, menorGasto, proovedorGrande, ivaCobrado, ivaPagado, ivaAPagar, perfil } = require('./aeq/perfil.js')
const { getGastos, getVentas, getGanancias, numProvedores, numClientes } = require('./aeq/factura.js')
const { topClientes, getClientes, topUbicaciones } = require('./lucia/cliente.js')

/*const refresher = require( './auth/refresher.js')
const { register, verifyUnique } = require('./auth/register.js')*/

router.post('/login', loginApi)
    /*router.post( '/token', refresher )
    router.post( '/register', verifyUnique, register )*/

router.get('/online', (req, res) => {
        res.json({ x: 'hi' })
    })
    //Página Perfil
router.get('/ventaGrande', ventaGrande)

router.get('/mejorCliente', mejorCliente)

router.get('/gastoGrande', gastoGrande)

router.get('/menorGasto', menorGasto)

router.get('/proovedorGrande', proovedorGrande)

router.get('/ivaCobrado', ivaCobrado)

router.get('/ivaPagado', ivaPagado)

router.get('/ivAPagar', ivaAPagar)

router.get('/perfil', perfil)

//Página Factura
router.get('/getGastos', getGastos)
router.get('/getVentas', getVentas)
router.get('/getGanancias', getGanancias)
router.get('/numProve', numProvedores)
router.get('/numCliente', numClientes)
    //Página de Clientes
router.get('/topClientes', topClientes)
router.get('/getClientes', getClientes)
router.get('/topUbicacion', topUbicaciones)
module.exports = router;
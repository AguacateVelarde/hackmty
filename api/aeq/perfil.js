'use strict'
const fs = require('fs')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { login, domain } = require('@kompass/config')
const { Router } = require('express')
const { db } = require('@kompass/database')
const path = require('path')
const router = Router()

var IP;
var IC;
var ventaGrande = function(req, res) {
    console.log("Entre");
    var { user } = req.payload
    db.raw('select receptorrfc, emisorname, total from clientes where (receptorrfc = "' + user.rfc + '" and emisorname is not null and emisorname <> " ") order by total desc limit 1;').
    then(datos => {
        if (datos.length === 0) {
            return res.status(401).json({
                message: 'User don\'t foud',
                code: 401
            })
        } else {
            res.status(200).json(datos);
        }
    })
}
var mejorCliente = function(req, res) {
    console.log("Entre al mejor Cliente");
    var { user } = req.payload
    db.raw('select emisorname, sum(total) as TotalClientes from clientes where receptorrfc = "' + user.rfc + '" group by emisorname order by TotalClientes desc limit 1').
    then(datos => {
        if (datos.length === 0) {
            return res.status(401).json({
                message: 'User don\'t foud',
                code: 401
            })
        } else {
            res.status(200).json(datos);
        }
    })
}
var gastoGrande = function(req, res) {
    console.log("Entre al gasta mas grande");
    var { user } = req.payload
    db.raw('select receptorname, emisorrfc, total from clientes where (emisorrfc = "' + user.rfc + '" and receptorname is not null and receptorname <> " ") order by total desc limit 1').
    then(datos => {
        if (datos.length === 0) {
            return res.status(401).json({
                message: 'User don\'t foud',
                code: 401
            })
        } else {
            res.status(200).json(datos);
        }
    })
};
var menorGasto = function(req, res) {
    console.log("Entre al gasta mas grande");
    var { user } = req.payload
    db.raw('select receptorname, total from clientes where emisorrfc = "PST1205156S0" order by total asc limit 1').
    then(datos => {
        if (datos.length === 0) {
            return res.status(401).json({
                message: 'User don\'t foud',
                code: 401
            })
        } else {
            res.status(200).json(datos);
        }
    })
}
var proovedorGrande = function(req, res) {
    var { user } = req.payload
    console.log("Entre al proovedor grande " + user.rfc);
    db.select('receptorname').
    sum('total as Gastos').
    from('clientes').
    where('emisorrfc', '=', user.rfc).
    whereNotNull('receptorname').
    andWhere('receptorname', '<>', " ").
    groupBy('receptorname').
    orderByRaw('Gastos desc').
    then(datos => {
        if (datos.length === 0) {
            return res.status(401).json({
                message: 'User don\'t foud',
                code: 401
            })
        } else {
            console.log(datos[0]['receptorname']);
            res.status(200).json(datos);
        }
    })
}
var ivaCobrado = function(req, res) {
    var { user } = req.payload
    console.log("Entre al iva cobrado");
    db.raw('select (sum(total)-sum(subtotal)) as IvaCobrado from clientes where receptorrfc = "' + user.rfc + '"').
    then(datos => {
        if (datos.length === 0) {
            return res.status(401).json({
                message: 'User don\'t foud',
                code: 401
            })
        } else {
            IC = datos[0][0]['IvaCobrado'];
            res.status(200).json(datos);
        }
    });
};
var ivaPagado = function(req, res) {
    var { user } = req.payload
    console.log("Entre al iva pagado");
    db.raw('select (sum(total)-sum(subtotal)) as IvaPagado from clientes where emisorrfc = "' + user.rfc + '"').
    then(datos => {
        if (datos.length === 0) {
            return res.status(401).json({
                message: 'User don\'t foud',
                code: 401
            })
        } else {
            IP = datos[0][0]['IvaPagado']
            res.status(200).json(datos);
            console.log(IP);
        }
    })
};
var ivaAPagar = function(req, res) {
    var { user } = req.payload
    console.log("Entre al iva cobrado");
    db.raw('select (sum(total)-sum(subtotal)) as IvaCobrado from clientes where receptorrfc = "' + user.rfc + '"').
    then(datos => {
        if (datos.length === 0) {
            return res.status(401).json({
                message: 'User don\'t foud',
                code: 401
            })
        } else {
            IC = datos[0][0]['IvaCobrado'];
            console.log("Entre al iva pagado");
            db.raw('select (sum(total)-sum(subtotal)) as IvaPagado from clientes where emisorrfc = "' + user.rfc + '"').
            then(datos => {
                if (datos.length === 0) {
                    return res.status(401).json({
                        message: 'User don\'t foud',
                        code: 401
                    })
                } else {
                    IP = datos[0][0]['IvaPagado']
                    var IAP = IC - IP;
                    var enviado = {
                        "Iva A Pagar": IAP
                    }
                    res.status(200).json(IAP);
                }
            })
        }
    });
}
var perfil = function(req, res) {
    var mejCli;
    var mejCliMount;
    var vGEmi;
    var vGTotal;
    var minGEmi;
    var minGTotal;
    var mayGRec;
    var mayGTotal;
    var ivaCobrado;
    var ivaPagado;
    var proveG;
    var proveGGastos;
    console.log("Entre al mejor Cliente");
    var { user } = req.payload
    db.raw('select emisorname, sum(total) as TotalClientes from clientes where receptorrfc = "' + user.rfc + '" group by emisorname order by TotalClientes desc limit 1').
    then(datos => {
        if (datos.length === 0) {
            return res.status(401).json({
                message: 'User don\'t foud',
                code: 401
            })
        } else {
            mejCli = datos[0][0]['emisorname'];
            mejCliMount = datos[0][0]['TotalClientes'];
            db.raw('select receptorrfc, emisorname, total from clientes where (receptorrfc = "' + user.rfc + '" and emisorname is not null and emisorname <> " ") order by total desc limit 1;').
            then(datos => {
                if (datos.length === 0) {
                    return res.status(401).json({
                        message: 'User don\'t foud',
                        code: 401
                    })
                } else {
                    var vGEmi = datos[0][0]['emisorname']
                    var vGTotal = datos[0][0]['total']
                    db.raw('select receptorname, total from clientes where emisorrfc = "PST1205156S0" order by total asc limit 1').
                    then(datos => {
                        if (datos.length === 0) {
                            return res.status(401).json({
                                message: 'User don\'t foud',
                                code: 401
                            })
                        } else {
                            minGEmi = datos[0][0]['receptorname'];
                            minGTotal = datos[0][0]['total']
                            db.raw('select receptorname, emisorrfc, total from clientes where (emisorrfc = "' + user.rfc + '" and receptorname is not null and receptorname <> " ") order by total desc limit 1').
                            then(datos => {
                                if (datos.length === 0) {
                                    return res.status(401).json({
                                        message: 'User don\'t foud',
                                        code: 401
                                    })
                                } else {
                                    mayGRec = datos[0][0]['receptorname'];
                                    mayGTotal = datos[0][0]['total']
                                    db.raw('select (sum(total)-sum(subtotal)) as IvaCobrado from clientes where receptorrfc = "' + user.rfc + '"').
                                    then(datos => {
                                        if (datos.length === 0) {
                                            return res.status(401).json({
                                                message: 'User don\'t foud',
                                                code: 401
                                            })
                                        } else {
                                            ivaCobrado = datos[0][0]['IvaCobrado'];
                                            db.raw('select (sum(total)-sum(subtotal)) as IvaPagado from clientes where emisorrfc = "' + user.rfc + '"').
                                            then(datos => {
                                                if (datos.length === 0) {
                                                    return res.status(401).json({
                                                        message: 'User don\'t foud',
                                                        code: 401
                                                    })
                                                } else {
                                                    ivaPagado = datos[0][0]['IvaPagado']
                                                    db.select('receptorname').
                                                    sum('total as Gastos').
                                                    from('clientes').
                                                    where('emisorrfc', '=', user.rfc).
                                                    whereNotNull('receptorname').
                                                    andWhere('receptorname', '<>', " ").
                                                    groupBy('receptorname').
                                                    orderByRaw('Gastos desc').
                                                    then(datos => {
                                                        if (datos.length === 0) {
                                                            return res.status(401).json({
                                                                message: 'User don\'t foud',
                                                                code: 401
                                                            })
                                                        } else {
                                                            proveG = datos[0]['receptorname'];
                                                            proveGGastos = datos[0]['Gastos']
                                                            var envio = {
                                                                "mejorCliente": {
                                                                    "MejorCliente": mejCli,
                                                                    "Total": mejCliMount
                                                                },
                                                                "ventaGrande": {
                                                                    "ClienteVentaGrande": vGEmi,
                                                                    "Total": vGTotal
                                                                },
                                                                "mayorGasto": {
                                                                    "ReceptorMayorGasto": mayGRec,
                                                                    "Total": mayGTotal
                                                                },
                                                                "menorGasto": {
                                                                    "ClienteMenorGasto": minGEmi,
                                                                    "Total": minGTotal
                                                                },
                                                                "ivaPagado": ivaPagado,
                                                                "ivaCobrado": ivaCobrado,
                                                                "proveedorGrande": {
                                                                    "NombreProveedor": proveG,
                                                                    "Gastos": proveGGastos
                                                                }
                                                            }
                                                            res.status(200).json(envio);
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    });
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}
module.exports = {
    mejorCliente,
    ventaGrande,
    gastoGrande,
    menorGasto,
    proovedorGrande,
    ivaCobrado,
    ivaPagado,
    ivaAPagar,
    perfil
};
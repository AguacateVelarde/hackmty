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
    db.select('receptorrfc', 'emisorname', 'total').
    from('clientes').
    whereNotNull('emisorname').
    andWhere('emisorname', '<>', " ").
    andWhere('receptorrfc', '=', user.rfc).
    orderByRaw('total desc').
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
    db.select('receptorname', 'emisorrfc', 'total').
    from('clientes').
    where('emisorrfc', '=', user.rfc).
    whereNotNull('receptorname').
    andWhere('receptorname', '<>', " ").
    orderBy('total', 'desc').
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
    db.raw('select receptorname, total from clientes where emisorrfc = "PST1205156S0" order by total asc').
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
module.exports = {
    mejorCliente,
    ventaGrande,
    gastoGrande,
    menorGasto,
    proovedorGrande,
    ivaCobrado,
    ivaPagado,
    ivaAPagar
};
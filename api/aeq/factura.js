'use strict'
const fs = require('fs')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { login, domain } = require('@kompass/config')
const { Router } = require('express')
const { db } = require('@kompass/database')
const path = require('path')
const router = Router()

var ventas;
var gastos;

var getGastos = function(req, res) {
    var { user } = req.payload
    db.raw('select sum(total) as GastosTotales from clientes where emisorrfc = "' + user.rfc + '"').
    then(datos => {
        if (datos.length === 0) {
            return res.status(401).json({
                message: 'User don\'t foud',
                code: 401
            })
        } else {
            gastos = datos[0][0]['GastosTotales'];
            res.status(200).json(datos);
        }
    });
}
var getVentas = function(req, res) {
    var { user } = req.payload
    db.raw('select sum(total) as VentasTotales from clientes where receptorrfc = "' + user.rfc + '"').
    then(datos => {
        if (datos.length === 0) {
            return res.status(401).json({
                message: 'User don\'t foud',
                code: 401
            })
        } else {
            ventas = datos[0][0]['VentasTotales'];
            res.status(200).json(datos);
            console.log(ventas);
        }
    });
};
var getGanancias = function(req, res) {
    var { user } = req.payload
    db.raw('select sum(total) as GastosTotales from clientes where emisorrfc = "' + user.rfc + '"').
    then(datos => {
        if (datos.length === 0) {
            return res.status(401).json({
                message: 'User don\'t foud',
                code: 401
            })
        } else {
            gastos = datos[0][0]['GastosTotales']
            db.raw('select sum(total) as VentasTotales from clientes where receptorrfc = "' + user.rfc + '"').
            then(datos => {
                if (datos.length === 0) {
                    return res.status(401).json({
                        message: 'User don\'t foud',
                        code: 401
                    })
                } else {
                    ventas = datos[0][0]['VentasTotales'];
                    var gan = ventas - gastos;
                    var envio = {
                        "Ganancias": gan,
                        "Ventas": ventas,
                        "Gastos": gastos
                    }
                    res.status(200).json(envio);
                    console.log(gan);
                }
            });
        }
    });
};
var numProvedores = function(req, res) {
    var { user } = req.payload;
    db.raw('select count(receptorrfc) as NumProvedores from clientes where emisorrfc = "' + user.rfc + '"').
    then(datos => {
        if (datos.length === 0) {
            return res.status(401).json({
                message: 'User don\'t foud',
                code: 401
            })
        } else {
            var dato = datos[0][0]['NumProvedores'];
            var envio = {
                "NumProvedores": dato
            }
            res.status(200).json(envio);
        }
    });
};

module.exports = {
    getGastos,
    getVentas,
    getGanancias,
    numProvedores
};
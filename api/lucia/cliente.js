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

var topClientes = function(req, res) {
    console.log("Entre al mejor Cliente");
    var { user } = req.payload
    db.raw('select receptorname ,count(receptorname) as numVentas from clientes where (receptorname is not null and rfc = "' + user.rfc + '" and receptorname <> " " ) group by receptorname order by numVentas desc limit 3').
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
var getClientes = function(req, res) {
    var { user } = req.payload;
    db.raw('select emisorname, sum(total) as TotalClientes from clientes where receptorrfc = "' + user.rfc + '" group by emisorname order by TotalClientes desc limit 20').
    then(datos => {
        if (datos.length === 0) {
            return res.status(401).json({
                message: 'User don\'t foud',
                code: 401
            })
        } else {
            res.status(200).json(datos);
        }
    });
}
module.exports = {
    topClientes,
    getClientes
};
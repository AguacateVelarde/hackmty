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
    db.select('receptorname').
    count('receptorname as numVentas').
    from('clientes').
    whereNotNull('receptorname').
    andWhere('receptorname', '<>', " ").
    groupBy('receptorname').
    orderByRaw('numVentas desc').
    havingRaw('receptorname','<', 3).
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

module.exports = {
    topClientes
};

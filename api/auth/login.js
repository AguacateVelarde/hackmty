'use strict'
const fs = require('fs')
const jwt = require ('jsonwebtoken')
const bcrypt = require('bcrypt')
const { login, domain } = require('@taftrip/config')
const { Router } = require('express')
const { mysql } = require('@kompass/databases')
const path = require('path')
const router = Router()

router.post('/', (req, res)=>{
  if( login ){
    mysql.select('*')
    .where( 'email', req.body.user )
    .from('Usuario')
    .then( user =>{
      if( user.length === 0 )
      return res.status(401).json({
        message : 'User don\'t foud',
        code : 401
      })

      fs.readFile( path.resolve( __dirname, 'private.key'), 'utf8',
        function( err, _private ){
          if( err )
            return res.status(500).json({
              message : 'Server Error',
              code : 5002
            })
          bcrypt.compare(req.body.password, user[0].password)
          .then( passVerify =>{
            if( !passVerify )
              return res.status( 400 ).json({
                message : 'Bad password',
                code : 4000
              })
              var payload = {
                user : user[0],
                date : Date.now()
              }
              var signOptions = {
                issuer: 	"Taftrip Corp",
                subject: 	"token@taftrip.com",
                audience: domain,
                expiresIn: 	"15d",
                algorithm: 	"RS256"
              }
              var _token = jwt.sign(payload, _private, signOptions)

              res.status( 200 ).json({
                message : 'Ok',
                token : _token,
                user : user[0]
              })

          }).catch( err =>{
            return res.status(500).json({
              message : 'Server Error',
              code : 5001,
            })
          })
        }
      )
    }).catch( err =>{
      return res.status(500).json({
        message : 'Server Error',
        code : 5002,
        err
      })
    })
  }else{
    res.status( 200 ).json({
      "message": "Ok",
      "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxLCJuYW1lIjoiTEVvbmFyZG8gVmVsYXJkZSIsInBhc3N3b3JkIjoiJDJiJDEwJFlRWW5NTjdNYkl0RWE1M0tlaWRDOGVzNGxVMEZFOHcwcE5wTzZhdjlmeVdjaWY2WnI1Nk5HIiwiY3JlYXRlX2F0IjoiMjAxOS0wNS0wNFQyMjo1NDo1Ny4wMDBaIiwidG9rZW4iOm51bGwsInV1aWQiOiIzMjAzNTljOC0xOGU4LTQwZDgtYWM0MS0zMDc1MWY0ZTRjYjIiLCJyb2xlIjoiVVNFUl9ST0xFIiwiZW1haWwiOiJsZy52ZWxhcmRlLmFuZHJhZGVAZ21haWwuY29tIiwiY29uZmlybWVkIjowLCJpbWdfcGVyZmlsIjpudWxsLCJwaG9uZSI6bnVsbCwic3RhdGUiOm51bGwsInBvaW50cyI6MH0sImRhdGUiOjE1NTY5OTI2ODgxMTQsImlhdCI6MTU1Njk5MjY4OCwiZXhwIjoxNTU4Mjg4Njg4LCJhdWQiOiJodHRwOi8vbG9jYWxob3N0Ojg4ODkiLCJpc3MiOiJUYWZ0cmlwIENvcnAiLCJzdWIiOiJ0b2tlbkB0YWZ0cmlwLmNvbSJ9.E6zBotnPorQK2FvOWVgpMa0jpedRK-XSfVppwWOUFpclHXpyIFiLRxFiNqNz1MrMJyBVyw9tHyPKk2erjOTmug"
    })
  }
})

module.exports = router

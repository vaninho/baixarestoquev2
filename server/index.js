const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const https = require('https')
const { connect } = require('./connection')
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const port = process.env.PORT || 3001
const BLANK_SPACES = '       '
const FILEPATH = 'D:/ArquivosLogtecRequisicoes/'
const FILE_EXTENSION = '.txt'

app.use(express.static(path.resolve(__dirname, '../client/build')))

async function getProductByBarCode(id) {
    const client = await connect()
    const sql = "SELECT DES_PRODUTO, VLR_VENDA1 FROM PRODUTO WHERE COD_BARRA = $1"
    const values = [id]
    const result = await client.query(sql, values)
    if (result.rowCount > 0) {
        return { desc: result.rows[0].des_produto, value1: result.rows[0].vlr_venda1 }
    }
    return false
}

function writeFile(type, barCode, quantity) {
    var line = createLine(barCode, quantity)
    fs.appendFile(FILEPATH + type + FILE_EXTENSION, line, (err) => { if (err) console.log('erro: ' + err + data) })
}

app.get('/product/:id', (req, res) => {
    const result = getProductByBarCode(req.params.id)
    result.then(r => {
        res.send({ found: r ? true : false, desc: r.desc, value: r.value1 })
    }).catch(e => console.log(e))

});

app.post('/newrequisition', (req, res) => {
    const typeRequisition = req.body.type
    const barCode = req.body.barCode
    const quantity = req.body.quantity
    getProductByBarCode(barCode).then(r => {
        if (r) {
            writeFile(typeRequisition, barCode, quantity)
            res.send({ result: true })
        } else {
            res.send({ result: false })
        }
    })
});

app.delete('/delrequisition', (req, res) => {
    const typeRequisition = req.body.type
    const barCode = req.body.barCode
    const quantity = req.body.quantity
    const line = createLine(barCode, quantity)
    data = fs.readFileSync(FILEPATH + typeRequisition + FILE_EXTENSION, 'utf-8')
    data = data.replace(line, '')
    fs.writeFileSync(FILEPATH + typeRequisition + FILE_EXTENSION, data, 'utf-8')
    res.send({ result: true })
})


app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
});

function createLine(barCode, quantity) {
    var line = barCode
    for (var i = barCode.length; i < 13; i++) {
        line = ' ' + line
    }
    line = line + BLANK_SPACES
    for (var i = (Math.trunc(quantity) + '').length; i < 6; i++) {
        line = line + '0'
    }
    //System use ,
    line = line + (quantity + '').replace(".", ",") + '\r\n'
    return line
}

const httpsServer = https.createServer({
    key: fs.readFileSync('selfsigned.key'),
    cert: fs.readFileSync('selfsigned.crt')
}, app)
httpsServer.listen(port, () => console.log(`Listening on port ${port}`))

// used on dev.
// app.listen(port, () => { console.log(`Listening on ${port}`) })
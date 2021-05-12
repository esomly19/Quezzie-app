
const express = require('express')
const app = express()
const mysql = require("mysql");
const bodyParser = require('body-parser');
const cors = require('cors')


app.use(cors())

app.use(
    bodyParser.urlencoded({
      extended: true
    })
  )
  
  app.use(bodyParser.json())


  const PORT = 3400;
  const HOST = "0.0.0.0"; 

app.get('/', function (req, res) {
    res.send('ça marche les potos')
})


app.get('/getScore', (req, res) => {
    let que = `SELECT * FROM joueurs ORDER BY  joueurs.score DESC`
               let score = []    
    db.query(que, function (err, result, fields) {
        let i = 1
        if (err) {
            console.error(err);
            res.status(404).send(err);
        } else {
            result.forEach(element => {

                let elem = '{ "id": "' + i + '" }'
                elem = JSON.parse(elem)
                let temp = Object.assign(elem, element)
                score.push('"' + i + '":' + JSON.stringify(temp))
                console.log(JSON.stringify(temp))
                i++
            });
            let final = '{ "scores":{' + score + '} }'
            console.log(i)
            res.send(JSON.parse(final))
        }
        

    })
})

app.post('/score', (req, res) => {
    let pseudo = req.body.pseudo
    let score =req.body.score
    let que=`Insert into joueurs (pseudo,score) VALUES ("${pseudo}", ${score} )`
                  
        db.query(que, function (err,result){
            if (err){
                console.error(err);
                res.status(404).send(err);
            }else{
                res.send(result)
                console.log("yes")
            }
        })
        

})





function startConnection() {
    console.error('CONNECTING');
    db = mysql.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "quezzie"
    });
    db.connect(function(err) {
        if (err) {
            console.error('CONNECT FAILED', err.code);
            startConnection();
        }
        else
            console.error('CONNECTED');
    });
    db.on('error', function(err) {
        if (err.fatal)
            startConnection();
    });
}

startConnection();

app.listen(PORT, HOST);
console.log(`API Player Running on http://${HOST}:${PORT}`)


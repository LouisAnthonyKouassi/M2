const express = require('express')
const cors = require('cors')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://127.0.0.1:27017';
const dbName = 'tourpediaDB';
let db;

MongoClient.connect(url, function(err, client) {
    console.log("Connected successfully to server");
    db = client.db(dbName);
});

app.use(cors())

app.get('/', (req,res) => {
    res.send("App is Working");
})
//On récupère les restaurants de la bdd, ici limité à 50 restaurants, on peut choisir quelles colonnes on veut avec project()
app.get('/restau', async (req,res) => {
    try {
        //const names = await db.collection('ParisRestaurant').find({}).project({"name": 1, "coord": 1}).limit(50).toArray()
        const names = await db.collection('ParisRestaurant').find({}).limit(50).toArray()
        return res.json({data: names})
    } catch (err) {
        console.log(err)
        throw err
    }
})

app.listen(5000, () => {
    console.log("App listen at port 5000")
    console.log( "http://localhost:5000");
})

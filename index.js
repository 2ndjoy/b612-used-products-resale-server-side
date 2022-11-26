const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xloqa3g.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {

        const userCollections = client.db('katherGhor').collection('userCollection');

        const productsCollections = client.db('katherGhor').collection('productsCollection');

        const bookingsCollections = client.db('katherGhor').collection('bookingsCollections');

        // Users

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollections.insertOne(user);
            res.send(result);

        })

        app.get('/users', async (req, res) => {
            const query = {};
            const users = await userCollections.find(query).toArray();
            res.send(users);
        })


        app.get('/users/:role', async (req, res) => {
            const role = req.params.role;
            const query = { role };
            const user = await userCollections.find(query).toArray();
            res.send(user);
        })

        app.put('/users/seller/:id', async (req, res) => {

            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    verify: 'verified'
                }
            }
            const result = await userCollections.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        // products
        app.post('/products', async (req, res) => {
            const products = req.body;
            const result = await productsCollections.insertOne(products);
            res.send(result);

        })
        app.get('/products', async (req, res) => {
            const query = {};
            const products = await productsCollections.find(query).toArray();
            res.send(products);
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const products = await productsCollections.findOne(query);
            res.send(products);
        })

        app.put('/products/:id', async (req, res) => {

            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    report: 'reported'
                }
            }
            const result = await productsCollections.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        // Booking
        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const result = await bookingsCollections.insertOne(booking);
            res.send(result);

        })

        app.get('/booking', async (req, res) => {
            const query = {};
            const booking = await bookingsCollections.find(query).toArray();
            res.send(booking);
        })

    } finally {

    }
}

run().catch(error => console.log(error))

app.get('/', async (req, res) => {
    console.log(uri)
    res.send('server is running')
})

app.listen(port, () => console.log('server is running on', port))
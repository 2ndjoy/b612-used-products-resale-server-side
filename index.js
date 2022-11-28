const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');
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

        const categoriesCollection = client.db('katherGhor').collection('categories');
        // Do this today
        // Make a new collection for reported item 

        // Users


        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await userCollections.findOne(query);
            console.log(user);
            res.send({ JJJ: "jjj" })
        })

        app.get('/user', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const user = await userCollections.findOne(query);
            res.send(user)
        })



        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollections.insertOne(user);
            res.send(result);


        })


        app.post('/products', async (req, res) => {
            const products = req.body;
            const result = await productsCollections.insertOne(products);
            res.send(result);

        })
        app.get('/products', async (req, res) => {
            const query = {};
            const result = await productsCollections.find(query).toArray();
            res.send(result);

        })


        // app.get('/products', async (req, res) => {
        //     const email = req.query.email;
        //     const query = { email: email };
        //     const products = await productsCollections.find(query).toArray();
        //     res.send(products)
        // })


        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const result = await bookingsCollections.insertOne(booking);
            res.send(result);

        })

        app.get('/booking', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const booking = await bookingsCollections.find(query).toArray();
            res.send(booking);
            console.log(booking)
        })

        // 
        // app.get('/myproducts', async (req, res) => {
        //     // const email = req.query.email;
        //     const email = req.query.email;
        //     const query = { email: email };
        //     const myproducts = await productsCollections.find(query).toArray();
        //     res.send(myproducts);
        // })
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
        app.get('/products/:report', async (req, res) => {
            const report = req.params.report;
            const query = { report };
            const result = await productsCollections.find(query).toArray();
            res.send(result);
        })


        app.get('/categories/:productCategory', async (req, res) => {
            const productCategory = req.params.productCategory;
            const query = { productCategory };
            const result = await productsCollections.find(query).toArray();
            res.send(result);
        })

        app.get('/category', async (req, res) => {
            const query = {};
            const result = await categoriesCollection.find(query).toArray();
            res.send(result);

        })





        app.get('/user/:role', async (req, res) => {
            const role = req.params.role;
            const query = { role };
            const user = await userCollections.find(query).toArray();
            res.send(user);
        })

        app.get('/buyer/:mybuyer', async (req, res) => {
            const buyer = req.params.sellerEmail;
            const query = { buyer };
            const buyers = await bookingsCollections.find(query).toArray();
            res.send(buyers);
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

    } finally {

    }
}

run().catch(error => console.log(error))

app.get('/', async (req, res) => {
    console.log(uri)
    res.send('server is running')
})

app.listen(port, () => console.log('server is running on', port))
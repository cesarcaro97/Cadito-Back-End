const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

//import models
const userModel = require('./models/user');
const productModel = require('./models/product');
const reviewModel = require('./models/review');
const cartModel = require('./models/cart');
const historyModel = require('./models/history');

let product_data = [];

const app = express();

const DB_URL = 'mongodb://127.0.0.1:27017/cadito';

const getId = (id) => {
    return mongoose.Types.ObjectId(id);
 }

const connect = () => {
    mongoose.connect(
        DB_URL,
        {
           keepAlive: true,
           useNewUrlParser: true,
           useUnifiedTopology: true,
        }, (err) => {
            const response = err ? `DB connection error. details: ${err.message}` : 'DB connected ...... !!';
            //console.log(response);
        });
}

app.use(cors());
app.use(bodyParser.json({limit:'20mb'}));
app.use(bodyParser.urlencoded({ extended: true }));


app.listen(3000,()=>{
    //console.log('This server is running');
});

connect();

///////////////////////////////// Users ///////////////////////////////////////////////////////////////////////////////

 
//Login API
app.post('/users/login',cors(), async (req,res)=>{
    const{ username,password } = req.body;
    userModel.findOne({username: username, password: password}, (err, docs) => {
        if(err) res.send({error: err}, 404);
        res.send(docs);
    });
});

//Pevious Login API
app.post('/users/prev-login',cors(), async (req,res)=>{
    const{ user_id } = req.body;
    console.log(user_id);
    userModel.findOne({_id: user_id}, (err, docs) => {
        console.log(docs);
        if(err) res.send({error: err}, 404);
        res.send(docs);
    });
});

//Register API
app.post('/users/register',cors(), async (req,res)=>{
    const{ display_name, username, password } = req.body;
    userModel.create({display_name: display_name, username: username, password: password}, (err, docs) => {
        if(err) res.send({error: err}, 404);
        res.send(docs);
    });
});

//User Detail API
app.get('/users', async (req,res)=>{
    const{ user_id } = req.query;

    //console.log('user id --->', user_id);
    userModel.findOne({_id: getId(user_id)}, (err, docs) => {
        if(err) res.send({error: err}, 404);
        res.send(docs);
    });
});


///////////////////////////////// Products ///////////////////////////////////////////////////////////////////////////////

// Create Product API
app.post('/posts',cors(), async (req,res)=>{
    const{ description, display_name, img_url, owner_id, price } = req.body;
    //console.log(req.body);
    productModel.create({description, display_name, img_url, owner_id, price }, (err, docs) => {
        if(err) res.send({error: err}, 404);
        res.send(docs);
    });
});

//product Detail API
app.get('/posts', async (req,res)=>{
    const{ post_id, user_id } = req.query;

    if(post_id) {

        productModel.findOne({_id: getId(post_id)}, (err, docs) => {
            if(err) res.send({error: err}, 404);
            res.send(docs);
        });

    }

    if(user_id) {

        productModel.find({owner_id: getId(user_id)}, (err, docs) => {
            if(err) res.send({error: err}, 404);
            res.send(docs);
        });

    }

    //console.log('product id from details  /posts GET --->', post_id);
    //console.log('user id from details  /posts GET --->', user_id);
    
});

//Recent products API
app.get('/posts/recent', async (req,res)=>{
    productModel.find({}, (err, docs) => {
        if(err) res.send({error: err}, 404);
        res.send(docs);
    });
});

///////////////////////////////// Reviews ///////////////////////////////////////////////////////////////////////////////

//Create review API
app.post('/reviews',cors(), async (req,res)=>{
    const{ description, product_id, rating, user_id } = req.body;
    reviewModel.create({description, product_id, rating, user_id}, (err, docs) => {
        if(err) res.send({error: err}, 404);
        res.send(docs);
    });
});

//Reviews Details API
app.get('/reviews', async (req,res)=>{
    const{ product_id, user_id } = req.query;

    if(product_id) {

        //console.log('product id from /reviews / GET --->', product_id);
        reviewModel.find({product_id: getId(product_id)}, (err, docs) => {
            if(err) res.send({error: err}, 404);
            res.send(docs);
        });

    }

    if(user_id) {

        //console.log('user id from by user /reviews GET --->', user_id);
        reviewModel.find({user_id: getId(user_id)}, (err, docs) => {
            if(err) res.send({error: err}, 404);
            res.send(docs);
        });

    }
});

///////////////////////////////// Cart ///////////////////////////////////////////////////////////////////////////////

//Create cart API
app.post('/cart',cors(), async (req,res)=>{
    const{ product_id, user_id } = req.body;
    cartModel.create({product_id, user_id}, (err, docs) => {
        if(err) res.send({error: err}, 404);
        res.send(docs);
    });
});

//cart Detail API
app.get('/cart', async (req,res)=>{
    const{ user_id } = req.query;

    if(user_id) {

        cartModel.find({user_id: getId(user_id)}, (err, docs) => {
            if(err) res.send({error: err}, 404);
            res.send(docs);
        });

    }

    ////console.log('product id from details  /posts GET --->', post_id);
    //console.log('user id from details  /cart GET --->', user_id);
    
});


//Delete item cart API
app.delete('/cart',cors(), async (req,res)=>{
    const{ item_id } = req.query;
    cartModel.deleteOne({_id: getId(item_id)}, (err, docs) => {
        if(err) res.send({error: err}, 404);
        res.send(docs);
    });
});


//Create cart API
app.post('/cart/buy',cors(), async (req,res)=>{
    const{ user_id } = req.body;

    let error = '';

    const carts = await cartModel.find({user_id});
    
    carts.forEach(cart => {

    // const productIds = carts.map(x => x.product_id);

    // console.log(carts);

    // console.log(productIds);

    // const product_data = await productModel.find({
    //     '_id': {
    //         $in: productIds
    //     }
    // });

    // console.log('product data >>>', product_data);

        historyModel.create({user_id: cart.user_id, product_id: cart.product_id}, (err, history) => {
            if(err) error = err;           
        });


    });

    cartModel.deleteMany({user_id}, (err, docs) => {
        if(err) res.send({error: err}, 404);
        if(error) res.send({error: err}, 404);
        res.send(docs);
    });
});


///////////////////////////////// History ///////////////////////////////////////////////////////////////////////////////

//History By user API
app.get('/history/:user_id', async (req,res)=>{
    const{ user_id } = req.params;

    if(user_id) {

        //console.log('user id from by user /reviews GET --->', user_id);
        historyModel.find({user_id: getId(user_id)}, (err, docs) => {
            if(err) res.send({error: err}, 404);
            res.send(docs);
        });

    }
});
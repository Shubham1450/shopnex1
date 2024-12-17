const port = 4000;
const express = require('express');
const app = express();

const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require('cors');
const { type } = require('os');
const { error } = require('console');
const validator = require("email-validator");
// const popup = require("popups");

app.use(express.json());
app.use(cors());

//database connection 
mongoose.connect("mongodb+srv://Ecomm:Ecomm123%40@cluster123.gvotf.mongodb.net/e-commerce")

//API creation
app.get("/", (req, res) => {
    res.send("Express is Running")
})
//imgae storage engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({ storage: storage })
//creating upload endpoint for uploading images
app.use('/images', express.static('upload/images'))


app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
})

//schema for creating products in mongoose

const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,

    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    }
})

app.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    }
    else {
        id = 1;
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });
    await product.save();
    console.log("saved/added");
    res.json({
        success: true,
        name: req.body.name,
    })
})

//Creating API for Deleting product
app.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name
    })
})

// creating API for getting all products
app.get('/allproducts', async (req, res) => {
    let produts = await Product.find({});
    console.log("ALL products: ");
    res.send(produts);
})
// SCHEMA FOR USER Model

const Users = mongoose.model('User', {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

//Creating endpoint for Resgistreing the user

app.post('/signup', async (req, res) => {
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ success: false, error: "existing user found" })
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }
    const user = new Users({
        name: req.body.username,
        email: req.body.email,
        password: req.body.password,
        cartData: cart,
    })
    if (validator.validate(user.email)) {
        await user.save();
        const data = {
            user: {
                id: user.id
            }
        }
        const token = jwt.sign(data, 'secret_ecom');
        res.json({ success: true, token })
    } else {
        return res.status(400).json({ success: false, error: "Wrong E-mail Format" })
    }


})

//creeating endpoint for user login

app.post('/login', async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom');
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, error: "Wrong Password" });
        }
    }
    else {
        res.json({ success: false, error: "Wrong Email id" })
    }
})

//creating endpoint for newcollection data
app.get('/newcollection', async (req, res) => {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("newcollection fetched ");
    res.send(newcollection);
})

//endpoint for popular in women section
app.get('/popularinwomen', async (req, res) => {
    let product = await Product.find({ category: "women" })
    let polar_inwomen = product.slice(0, 4);
    console.log("popular in women fetched ");
    res.send(polar_inwomen);
})
//creating middleware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.send(401).send({ errors: "Please aunticaticate using valid token" })
    }
    else {
        try {
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next();
        }
        catch (error) {
            res.status(401).send({ errors: "Auth failed" })
        }
    }
}


//creating endpoint for adding products in cartdata
app.post('/addtocart', fetchUser, async (req, res) => {
    console.log("Added", req.body.itemId);
    let userData = await Users.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData })
    res.send("Added")
})

//creating endpoint to remove product from the cart data

app.post('/removefromcart', fetchUser, async (req, res) => {
    console.log("removed", req.body.itemId);
    let userData = await Users.findOne({ _id: req.user.id });
    if (userData.cartData[req.body.itemId] > 0) {
        userData.cartData[req.body.itemId] -= 1;
    }
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData })
    res.send("Removed")
})

//creating endpoint to get cartdata
app.post('/getcart', fetchUser, async (req, res) => {
    console.log("GetCart");
    let userData = await Users.findOne({ _id: req.user.id });
    res.json(userData.cartData);
})


app.listen(port, (error) => {
    if (!error) {
        console.log("Server running :" + port);
    }
    else {
        console.log("Error: ", error);
    }
})

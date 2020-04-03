var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://localhost/swag-shop');

var Product = require('./model/product');
var WishList = require('./model/wishlist');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/product', (request, response) => {
    var product = new Product();
    product.title = request.body.title;
    product.price = request.body.price;
    product.save((err, savedProduct) => {
        if (err) {
            response.status(500).send({ error: "Could not save product" });
        } else {
            response.send(savedProduct);
        }
    })
});

app.post ('/wishlist', (request, response) => {
    var wishlist = new WishList();
    wishlist.title = request.body.title;
    // wishlist.product = request.body.products;
    wishlist.save((err, newWishList) => {
        if(!err) {
            response.send(newWishList);
        } else {
            response.status(500).send({error: "Could not create Wishlist"});
        }
    });
});

app.delete ('/wishlist/delete/:wishListId', (request, response) => {
    WishList.deleteOne({_id: request.params.wishListId}, (err, wishlist) => {
        if(!err) {
            response.send(wishlist);
        } else {
            response.status(500).send({error: "Could not find the Wishlist by the provided ID"});
        }
    });
});

app.put('/wishlist/product/add', (request, response) => {
    Product.findOne({_id: request.body.productId}, (err, product) => {
        if(!err) {
            WishList.update({_id: request.body.wishListId}, {$addToSet: {products: product._id}}, (err, wishlist) => {
                if(!err) {
                    response.send(wishlist);
                } else{
                    response.status(500).send({error: "Could not add found item to Wishlist!!"});
                }
            });
        } else {
            response.status(500).send({error: "Could not find product for wishlist!!"});
        }
    });
});

app.get ('/wishlist', (request, response) => {
    WishList.find({}).populate({path:'products', model: 'Product'}).exec((err, wishlist) => {
        if(!err) {
            response.send(wishlist);
        } else {
            response.status(500).send({error: "Could not fetch Wishlists!!"});
        }
    });
});

app.get('/product', (request, response) => {
    Product.find({}, (err, products) => {
        if (!err) {
            response.send(products);
        } else {
            response.status(500).send({ error: 'Not able to fetch products!!' });
        }
    });
    // if(!err) {
    // } else {
    // }
});

app.listen(3000, () => {
    console.log("Adwait's Swag Shop API running on port 3000...");
});
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Order = require('./models/Order');
const User = require('./models/User');
const { db } = require('./models/Order');
const prompt = require('prompt');
const app = express();

//Start App with nodemon
//connect to mongoDb
const dbURI = 'mongodb+srv://databaseUser@orders.ioiuw.mongodb.net/WebShop?retryWrites=true&w=majority'
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect(dbURI)
    .then((result) => app.listen(80))
    .catch((err) => console.log(err));

//View engine
app.set('view engine', 'ejs');
app.set('views', 'Pages');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true}));
app.use(morgan('dev'));


//Routes
app.get('/', (req, res) => {
    res.redirect('/homepage');
});

app.get('/Homepage', (req, res) => {
    Order.find().sort({ createdAt: -1 })
        .then((result) => {
            res.render('Homepage', { title: 'Home'})
        })
        .catch((err) => {
            console.log(err);
        })
});

//Sign In pages working

app.get('/Signin', (req, res) => {
    res.render('Signin', { title: 'Signin' })
    console.log(req.body);
    //User.find({ Username: /^Ant/, Password: /^Ant/ }, callback);
});

app.post('/Signedin', (req, res) => {
    console.log(req.body.Username);
    User.find({ Username: req.body.Username }, function (err, doc) {
        console.log(doc.length);
        if (doc.length >= 1) {
            User.find({ Password: req.body.Password }, function (err, doc) {
                if (!doc.length < 1) {
                    const URL = '/Signedin/User/' + doc[0].id;
                    const StringId = doc[0].id.toString();
                    res.redirect(URL);
                } else {
                    res.redirect('/Signin');
                }
            })
        } else {
            res.redirect('/Signin');
        }
    });
});

app.get('/Signedin/User/:id', (req, res) => {
    const id = req.params.id;
    Order.find({ UserID: id })
        .then((result) => {
            User.findById(id)
                .then((result1) => {
                    res.render('MyOrders', { title: 'All Orders', Order: result, User: result1 })
                })
            
        })
        .catch((err) => {
            console.log(err);
        })
});

app.get('/CreateOrder/:id', (req, res) => {
    const id = req.params.id;
    User.findById(id)
        .then((result) => {
            res.render('OrderPageSigned', { title: 'Create Order' ,User: result})
        })
    
})

app.post('/CreateOrder/:id', (req, res) => {
    console.log(req.body);
    const id = req.params.id;
    const order = new Order(req.body);
    order.save()
        .then((result) => {
            User.findById(id)
                .then((result1) => {
                    const URL = '/Signedin/User/' + result1.id;
                    res.redirect(URL);
            })
        })

})

//SignUp page
app.get('/SignUp', (req, res) => {
    res.render('SignUp', { title: 'Signup' })
    console.log(req.body);
    //User.find({ Username: /^Ant/, Password: /^Ant/ }, callback);
});

app.post('/SignedUp', (req, res) => {
    console.log(req.body.Username);
    User.find({ Username: req.body.Username }, function (err, doc) {
        console.log(doc[0]);
        console.log(doc.length);
        if (!doc.length >= 1) {
            const user = new User(req.body);
            user.save()
                .then((result) => {
                    res.redirect('/Signin');
                })
                .catch((err) => {
                    console.log(err);
                    res.redirect('/SignUp');
                })
        } else {
            res.redirect('/SignUp');
        }
    });
});


//Order Page

app.get('/OrderPage', (req, res) => {
    Order.find().sort({ createdAt: -1})
        .then((result) => {
            res.render('index', { title: 'All Orders', Order: result})
        })
        .catch((err) => {
            console.log(err);
        })
});


//Order / User post request
app.post('/OrderPage', (req, res) => {
    const order = new Order(req.body);
    order.save()
        .then((result) => {
            res.redirect('/OrderPage');
        })
        .catch((err) => {
            console.log(err);
        })
})

//OrderView Pages
app.get('/OrderPage/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    Order.findById(id)
        .then((result) => {
            res.render('details', { Order: result, title: 'Order Details', });
        })
        .catch((err) => {
            console.log(err);
        })
})

app.delete('/OrderPage/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    Order.findByIdAndRemove(id)
        .then((result) => {
            res.json({ redirect: '/OrderPage' })
        })
        .catch((err) => {
            console.log(err);
        })
})


app.get('/OrderCreate', (req, res) => {
    //console.log(res);
    res.render('OrderPage', { title: 'Order' });
});
//404 Page MUST STAY AT BOTTOM
app.use((req, res) => {
    res.status(404).render('404', { title: '404' });
});

const express = require('express');

const mongoose = require('mongoose');
const cors = require('cors');
const bodyparse = require('body-parser');
const authRoutes = require('./api/mainRoute/authentication');
const mainRoute = require('./api/mainRoute/mails');
const settingsRoute = require('./api/mainRoute/settings')


const app = express()

// <<<<<<<<<<<< PREDEFINING THE ENVORMENT VARIABLE THE WEBSITE >>>>>>>>>>>>>>





app.use(bodyparse())
app.use(bodyparse.urlencoded({ extended: true }))
app.use(cors());


mongoose.connect("mongodb+srv://me:aaaaaaaa@cluster0-ydjhc.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true
 })


app.use('/api', authRoutes)
app.use('/api/mail', mainRoute)
app.use('/api/settings' , settingsRoute)
app.use(express.static('./uploads'))
app.use(express.static('./build'))
app.use('/*', function (req, res) {
    res.sendFile('index.html');
})

var port = process.env.PORT || 9000;

app.listen(port,()=>{
    console.log('server start on port 9000');
})
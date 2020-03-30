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


mongoose.connect("mongodb://me:nkwanta442@ds159293.mlab.com:59293/mlmapi", (ee)=>{
    if(ee) return ee;
    console.log('db connected');
    
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
    console.log('server start on port 9000' );
})
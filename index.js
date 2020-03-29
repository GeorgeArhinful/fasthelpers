const express = require('express');
const expressSession = require('express-session');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyparse = require('body-parser');
const authRoutes = require('./api/mainRoute/authentication');
const mainRoute = require('./api/mainRoute/mails');
const settingsRoute = require('./api/mainRoute/settings')


const app = express()

// <<<<<<<<<<<< PREDEFINING THE ENVORMENT VARIABLE THE WEBSITE >>>>>>>>>>>>>>
const {
    SECRET = 'my name is george',
} = process.env

const sessObj = {
    secret : SECRET
}


app.use(bodyparse())
app.use(bodyparse.urlencoded({ extended: true }))
app.use(cors());
app.use(expressSession(sessObj));

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/fasthelpers',(error)=>{
    if(error) return error
    console.log('Database connected');
    
})
mongoose.connect();

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
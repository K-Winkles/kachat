var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const { reset } = require('nodemon');

var app = express()
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:false }));

mongoose.Promise = Promise;
var dburl = "mongodb+srv://Kiana:<password>@webapps.33xfb.mongodb.net/kachat?retryWrites=true&w=majority";

var Message = mongoose.model('Message', {
    name: String,
    message:String
});

app.get('/messages', (req, res) => {
    Message.find({}, (err, messages) =>{
        res.send(messages);
    });
});

app.post('/messages', async (req, res) => {
    var message = new Message(req.body);

    try{
        await message.save();
        io.emit('message', req.body);
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
        throw error;
    }
});

io.on('connection', () => {
    console.log('a user has connected');
});

mongoose.connect(dburl, (err) => {
    if (err) {
        throw err;
    }
    console.log('successfully connected to database');
})

var server = http.listen(3000, () => {
    console.log('server is listening to port ', server.address().port);
});
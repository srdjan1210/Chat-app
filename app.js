const express = require('express');
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 3000;
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const path = require('path');
const mongoose = require('mongoose');
const { setUserStatus } = require('./models/user');
const { findRoomByUsers } = require('./models/chat_room')
const { saveMessage, loadMessages } = require('./models/message');
//routers
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');

//socket
    io.on('connect', (socket) => {
        socket.on('new user', (data) => {
            setUserStatus(data, true);
            socket.broadcast.emit('load user', data);
            
        });

        socket.on('left chat', (user) => {
            setUserStatus(user, false);
            io.emit('remove user', user);
        });

        socket.on('join room', async ({ ownerId, roomId, receiverId }) => {
            const room = await findRoomByUsers([ownerId, receiverId]);
            const messages = await loadMessages(room._id, 0);
            if(roomId != null)
                socket.leave(roomId);
            socket.join(room._id + '');
            socket.emit('load messages', { messages, roomId: room._id, isFirstTimeLoading: true});
           
        });

        socket.on('sendMessage', async (data) => {
            const room = await findRoomByUsers([data.ownerId, data.receiverId]);
            const savedMessage = await saveMessage(data, [data.ownerId, data.receiverId], room);

            if(savedMessage)
                io.sockets.in(room._id + '').emit('newMessage', savedMessage);

        });

        socket.on('load messages', async ({ roomId, n }) => {
           const messages = await loadMessages(roomId, n);
           socket.emit('load messages', { messages, roomId, isFirstTimeLoading: false})
        }); 

        socket.on('disconnect', () => {
            socket.rooms = {};
        });
    });

//database


mongoose.connect('mongodb://localhost:27017/AdvChat', {useNewUrlParser: true, useUnifiedTopology: true,}).catch((err) => {
    console.log(err);
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//routes middleware
app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/', (req, res) => {
    res.render('error', { message: "UPS!", error: {
        stack: "Page not found!",
        status: 404
    }});
});

/* error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });
  */
  
http.listen(port, () => {
    console.log("listening at port " + port);
});


const fs = require('fs');
const key = fs.readFileSync('./ssl/cert.key');
const cert = fs.readFileSync('./ssl/cert.pem');
const errorMiddleware = require('./middleware/errormw');
const express = require('express')
const https = require('https');
const authRoute =require('./routes/auth')
const prodRoute =require('./routes/product')
const orderRoute = require('./routes/order')
const tableRoute = require('./routes/table')
const mongoose = require('mongoose')
const app = express();
const server = https.createServer({key: key, cert: cert }, app);
require('dotenv').config()
const PORT = 5000
const cors = require('cors')
app.use(express.json())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT_URL
}));
app.use(express.static(__dirname + '/uploads'));
app.use('/', express.static('/uploads'));
app.use("/api/auth", authRoute)
app.use("/api/product", prodRoute)
app.use("/api/table", tableRoute)
app.use("/api/order", orderRoute)
app.use(errorMiddleware);

async function runServer(){
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }, () => console.log("Connected to MongoDB"))
        server.listen(PORT, () => console.log(`Server started on PORT : ${PORT}`))
    }
    catch (e) {
        console.log(e)
    }
}
runServer();
const express = require('express');
const movieRouter = require('./routers/movieRouter')
const subscriberRouter = require('./routers/subscriberRouter')
const subscriptionRouter = require('./routers/subscriptionRouter')
const subscriberBL=require('./models/subscriberBL')
const movieBL=require('./models/movieBL')

let app = express();

require('./configs/database');
subscriberBL.initSubscribers()
movieBL.initMovies()

app.use(express.json());

app.use((req, res, next) => {
    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date+' '+time;
    console.table({'Request Type': req.method,'URL':req.originalUrl,'date':dateTime})
    let obj=req.body
    if ((obj) && !(Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype))
     console.log('body',obj)
    next();
 })

app.use('/api/movies', movieRouter);
app.use('/api/subscribers', subscriberRouter);
app.use('/api/subscriptions', subscriptionRouter);

app.use((error,req,resp,next) => {  
    console.log("server Express Error Handler",error.toString())
    return resp.status(500).json({ error: error.toString() });
})

console.log("listening to port 8000")
app.listen(8000);



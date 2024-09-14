
const express = require('express');
const mongoose = require('mongoose');
const path = require('path')
const axios = require('axios')
const Ticker = require('./models/ticker')



const app = express()

app.set('view engine' , 'ejs')
app.set('views', path.join(__dirname,'views'))


// mongoDB connecction 
mongoose.connect('mongodb://localhost:27017/QuadB-assignment',
    { useNewUrlParser: true, 
    useUnifiedTopology: true }
)
.then(()=>{
    console.log("DB connected succesfully")
})
.catch((err)=>{
    console.log("Unable to conect to database " ,err)
})


const apiData = async ()=>{

 try{

    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');

    const data = response.data;
    
    // console.log(data)

    const result = Object.values(data).slice(0,10).map(data => ({
                name: data.name,
                last: data.last,
                buy:  data.buy,
                sell: data.sell,
                volume:data.volume,
                base_unit: data.base_unit
    }))

    await Ticker.deleteMany();
    await Ticker.insertMany(result)
    console.log("data inserted succesfully")

 }   catch(err){
    console.error('Error fetching data:', err);
 }


}


apiData();

//route 

app.get('/',async (req,res)=>{
    // res.send("data page")

    try {
        const tickers = await Ticker.find();
        // console.log(data)
        // res.json(tickers);
        res.render('home', { tickers });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tickers' });
    }
})









const port = process.env.PORT || 3000 ;
app.listen(port,()=>{
    console.log(`server is running on ${port}`);
})
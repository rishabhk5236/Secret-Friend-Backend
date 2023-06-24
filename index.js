const express = require('express');
const connectToMongo=require('./db')
connectToMongo();


// this is the base url where app is running 
// https://secret-friend-backend.onrender.com/


const app = express()
const port = 5000

var cors = require('cors')
app.use(cors())

app.use(express.json());
//Available routes
app.use('/api/auth',require('./routes/auth'));
app.use('/api/notes',require('./routes/notes'));

app.listen(port, () => {
  console.log(`Secret friend app listening on port ${port}`)
})
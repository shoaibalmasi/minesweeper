const express = require("express");
const app = express();


app.use(express.urlencoded({
  extended: false
}));
app.use(express.text());
app.use(express.static('public'));

// 
app.get('/', (req , res) =>{
    res.sendFile(__dirname+'/views/minesweeper.html')
})

// get not found page
app.get('*', function (req, res) {
  res.status(404).send('not found');
});

app.listen(8000, ()=>{
    console.log('server is listening');
});

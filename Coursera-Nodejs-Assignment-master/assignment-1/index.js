const http = require("http");
const express = require("express");
const app = express();

const dishRouter1 = require('./dishRouter');
const promoRouter1 = require('./promoRouter');
const leaderRouter1 = require('./leaderRouter');


app.use("/dishes", dishRouter1); 


app.use("/promotion", promoRouter1); 


app.use("/leaders", leaderRouter1);	


const server = http.createServer(app);
server.listen(3000,"localhost",()=>{
	console.log("Hey,port is running at http://localhost:3000");
});


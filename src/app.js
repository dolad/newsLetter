const express = require("express");

const subscribeRouter = require("./routers/subscribe");

const app = express();
const port = process.env.PORT || 5000;


app.use(express.json());
app.use(subscribeRouter);

app.listen(port, () => {
  console.log('app is running on port : ' + port);
});

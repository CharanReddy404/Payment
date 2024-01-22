const express = require('express');
const { mongoose } = require('mongoose');
const cors = require('cors');
const rootRouter = require('./routes/index');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1', rootRouter);

mongoose
  .connect('mongodb://localhost:27017/paytm')
  .then(() => console.log('DB Connected!'));

app.listen(3000, () => {
  console.log('Server started at port 3000....');
});

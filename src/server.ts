import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

const port = process.env.PORT || 3000;

app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
app.use(cors());
app.use(bodyParser.json()); 

app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
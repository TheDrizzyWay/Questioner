import express from 'express';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.status(200).send('Welcome to the Questioner API!');
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server running on port ${port}`));

export default app;

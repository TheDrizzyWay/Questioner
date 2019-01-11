import express from 'express';

import routes from './v1/routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/v1', routes);

app.get('/api/v1', (req, res) => {
  res.status(200).json('Welcome to the Questioner API.');
});
app.all('/*', (req, res) => res.status(404).json({ message: 'Invalid request.' }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

export default app;

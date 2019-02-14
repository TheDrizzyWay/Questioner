import express from 'express';
import path from 'path';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import routes from './v1/routes';

const app = express();
const swaggerDoc = YAML.load(path.join(process.cwd(), './api/v1/docs/docs.yaml'));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
app.use('/api/v1', routes);

app.get('/api/v1', (req, res) => {
  res.status(200).json('Welcome to the Questioner API.');
});
app.all('/*', (req, res) => res.status(404).json({ message: 'Invalid request.' }));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));

export default app;

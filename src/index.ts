import express, { Request, Response } from 'express';
import { config } from "./config/config";
import { connectToMongoDatabase } from './data/databaseMongo';
import { fetchAllData } from './data/fetchdata';
import { loggerMiddleWare } from './logs/winston';
import userRoutes from "./routes/user.route"
import pointsRoutes from "./routes/points.route"
import teamScoresRoutes from "./routes/teamScore.route"
import { errorMiddleWaresHandler } from './middlewares/error.middleware';
const app = express();
const port = config.port;
const https = require('https');
const fs = require('fs')
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Définir les options de Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'TPFinal API',
      version: '1.0.0',
      description: 'An API to guide you in this website',
    },
  },
  apis: ['./src/routes/*.ts'], // Fichier où les routes de l'API sont définies
};

// Générer la documentation à partir des options
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Servir la documentation Swagger via '/api-docs'
app.use('/api/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/*
const options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};
*/


app.use(loggerMiddleWare);

app.use('/', userRoutes);

app.use('/', pointsRoutes);

app.use('/', teamScoresRoutes);

app.use(errorMiddleWaresHandler);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello TypeScript with Express!');
});


app.listen(port, async () => {

  console.log('MongoDB URL:', process.env.DB_PROD_URI_FINAL);
  await connectToMongoDatabase(config.DB_PROD_URI_FINAL)
  console.log("Serveur prod started");
  console.log(`Server is running on port http://localhost:${port}`);
 // fetchAllData(config.databaseFetchUrl);
});

/*

if(config.nodeEnv === "prod") {
  // Démarrer le serveur prod
   app.listen(port, async () => {
    await connectToMongoDatabase(config.DB_PROD_URI)
    populateMongoDatabase()
    console.log("Serveur prod started");
    console.log(`Server is running on port http://localhost:${port}`);
  });
} else if (config.nodeEnv === "test"){
  https.createServer(options, app).listen(port, async () => {
    fetchProdData(config.pathDatabaseProducts);
    await connectToMongoDatabase(config.DB_TEST_URI)
    populateMongoDatabase()
    console.log("Serveur test started");
    console.log(`Server is running on port https://localhost:${port}`);
  });
} else if (config.nodeEnv === "dev") {
  https.createServer(options, app).listen(port, async () => {
    await connectToMongoDatabase(config.DB_PROD_URI)
    populateMongoDatabase()
    console.log("Serveur dev started");
    console.log(`Server is running on port https://localhost:${port}`);
  });
}
*/
export default app;
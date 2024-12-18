import express, { Request, Response } from 'express';
import { config } from "./config/config";
import { connectToMongoDatabase } from './data/databaseMongo';
import { fetchAllData } from './data/fetchdata';
import { loggerMiddleWare } from './logs/winston';
import userRoutes from "./routes/user.route"
import pointsRoutes from "./routes/points.route"
import teamInfoRoutes from "./routes/teamInfo.route"
import gamesRoutes from "./routes/game.route"
import { errorMiddleWaresHandler } from './middlewares/error.middleware';
import "./"
const cors = require('cors');
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

app.use(cors({ origin: 'https://dunktheodds-projet-session-collecte-yaqa.onrender.com' }));
// Servir la documentation Swagger via '/api-docs'
app.use('/api/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


const options = {
  key: fs.readFileSync('./src/keys/key.pem'),
  cert: fs.readFileSync('./src/keys/cert.pem')
};



app.use(loggerMiddleWare);

app.use('/', userRoutes);

app.use('/', pointsRoutes);

app.use('/', teamInfoRoutes);

app.use('/', gamesRoutes);

app.use(errorMiddleWaresHandler);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello TypeScript with Express!');
});


console.log(config.nodeEnv);


if(config.nodeEnv === "prod") {

  /*
   app.listen(port, async () => {
    await connectToMongoDatabase(config.DB_PROD_URI_FINAL)
    //fetchAllData(config.databaseFetchUrl);
    console.log("Serveur prod started");
    console.log(`Server is running on port http://localhost:${port}`);
    });
*/
    https.createServer(options, app).listen(port, async () => {
      await connectToMongoDatabase(config.DB_PROD_URI_FINAL)
      //fetchAllData(config.databaseFetchUrl);
      console.log("Serveur prod started");
      console.log(`Server is running on port https://localhost:${port}`);
      }).on('error', (err: any) => {
        console.error('HTTPS server error:', err);
      });
} else {

}

export default app;
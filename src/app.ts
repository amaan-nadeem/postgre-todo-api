import express, { Application } from 'express';
import routes from './routes/routes';
const PORT = process.env.PORT || 5000 ;
const app: Application = express();


// body parser 
app.use(express.json());

app.use('/api/v1/', routes);
// 404 not found
app.use((req, res) =>
  res
    .status(404)
    .send({
      message: `API route not found`,
      route: `${req.hostname}${req.url}`
    })
);

app.listen(PORT ,() => console.log(`Server is Listening on PORT ${PORT}`));
// module.exports = app
module.exports = app;
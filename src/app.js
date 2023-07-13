import express from 'express';
import userRouter from './routes/users.router.js';
import mongoose from 'mongoose';

const app = express();
const PORT = 3000;

// Configurar la conexión a la base de datos de MongoDB
const MONGODB_URI ='mongodb+srv://selenabenitez0201:Monedas1@selenabenitezcluster.xhlcgdr.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Conectado a la base de datos MongoDB');
}).catch((error) => {
  console.log('Error al conectar a la base de datos:', error);
  process.exit(1);
});

// Configurar middlewares
app.use(express.json());

// Rutas
app.use('/api/users', userRouter);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

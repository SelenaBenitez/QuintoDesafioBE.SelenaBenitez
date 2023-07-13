import express from 'express';
import userRouter from './routes/users.router.js';
import mongoose from 'mongoose';
import http from 'http';
import socketIO from 'socket.io';
import handlebars from 'express-handlebars';

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Configurar el motor de plantillas Handlebars
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Configurar la ruta estática para los archivos públicos
app.use(express.static('public'));

// Array para almacenar los productos
let products = [];

// Configurar eventos de conexión y desconexión de websockets
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });

  // Escuchar evento de creación de producto
  socket.on('createProduct', (product) => {
    // Lógica para crear el producto
    const newProduct = { ...product, id: generateId() };
    products.push(newProduct);
    // Emitir evento de actualización de productos a todos los clientes conectados
    io.emit('updateProducts', products);
  });

  // Escuchar evento de eliminación de producto
  socket.on('deleteProduct', (productId) => {
    // Lógica para eliminar el producto
    products = products.filter((product) => product.id !== productId);
    // Emitir evento de actualización de productos a todos los clientes conectados
    io.emit('updateProducts', products);
  });
});

// Ruta para la vista home
app.get('/', (req, res) => {
  res.render('home', { products });
});

// Ruta para la vista realTimeProducts
app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { products });
});

// Ruta para la creación de producto desde HTTP
app.post('/products', (req, res) => {
  const { name, price } = req.body;
  const newProduct = { name, price, id: generateId() };
  products.push(newProduct);
  io.emit('updateProducts', products);
  res.redirect('/realtimeproducts');
});

// Ruta para la eliminación de producto desde HTTP
app.delete('/products/:id', (req, res) => {
  const productId = req.params.id;
  products = products.filter((product) => product.id !== productId);
  io.emit('updateProducts', products);
  res.redirect('/realtimeproducts');
});

// Generar un ID único para los productos
function generateId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// Iniciar el servidor en el puerto 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

// Configurar la conexión a la base de datos de MongoDB
const MONGODB_URI =
  'mongodb://localhost:27017/ecommongodb+srv://selenabenitez0201:Monedas1@selenabenitezcluster.xhlcgdr.mongodb.net/?retryWrites=true&w=majoritymerce';
mongoose.connect(MONGODB_URI, (error) => {
  if (error) {
    console.log('Cannot connect to database: ' + error);
    process.exit();
  }
});

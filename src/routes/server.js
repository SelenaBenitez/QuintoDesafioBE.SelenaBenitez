// src/controllers/socket.controller.js
import { generateId } from '../utils/generateId.js';



// Array temporal para almacenar productos
let products = [];

// Crear un producto y agregarlo al array
const createProduct = (product) => {
  const newProduct = { ...product, id: generateId() };
  products.push(newProduct);
  return newProduct;
};

// Obtener todos los productos
const getAllProducts = () => products;

// Eliminar un producto por su ID
const deleteProduct = (productId) => {
  products = products.filter((product) => product.id !== productId);
  return productId;
};

export { createProduct, getAllProducts, deleteProduct };

// src/controllers/socket.controller.js
import generateId from '../utils/generateId.js';

// Manejar eventos de conexión y desconexión de sockets
const handleSocketConnection = (io, socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });

  // Escuchar evento de creación de producto
  socket.on('createProduct', (product) => {
    const newProduct = { ...product, id: generateId() };
    products.push(newProduct);
    // Emitir evento de actualización de productos a todos los clientes conectados
    io.emit('updateProducts', products);
  });

  // Escuchar evento de eliminación de producto
  socket.on('deleteProduct', (productId) => {
    products = products.filter((product) => product.id !== productId);
    // Emitir evento de actualización de productos a todos los clientes conectados
    io.emit('updateProducts', products);
  });
};

export { handleSocketConnection };

// src/routes/product.router.js
import express from 'express';
import * as ProductController from '../controllers/product.controller.js';


// Ruta para obtener todos los productos
router.get('/products', (req, res) => {
  const products = ProductController.getAllProducts();
  res.json(products);
});

// Ruta para crear un nuevo producto
router.post('/products', (req, res) => {
  const { name, price } = req.body;
  const newProduct = ProductController.createProduct({ name, price });
  res.json(newProduct);
});

// Ruta para eliminar un producto por su ID
router.delete('/products/:id', (req, res) => {
  const productId = req.params.id;
  const deletedProductId = ProductController.deleteProduct(productId);
  res.json({ message: 'Producto eliminado con éxito', productId: deletedProductId });
});


// src/routes/socket.router.js
import express from 'express';
import { Server } from 'socket.io';
import * as SocketController from '../controllers/socket.controller.js';

const router = express.Router();

// Configurar eventos de conexión y desconexión de sockets
router.io = (server) => {
  const io = new Server(server);
  io.on('connection', (socket) => {
    SocketController.handleSocketConnection(io, socket);
  });
};

export default router;

// src/utils/generateId.js
const generateId = () => (
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15)
);

export { generateId };

// server.js
import express from 'express';
import http from 'http';
import socketIO from 'socket.io';
import handlebars from 'express-handlebars';
import dotenv from 'dotenv';
import productRouter from './routes/product.router.js';
import socketRouter from './routes/socket.router.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Configurar el motor de plantillas Handlebars
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Configurar la ruta estática para los archivos públicos
app.use(express.static('public'));

// Configurar el middleware para procesar el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar las rutas de productos y sockets
app.use('/api', productRouter);
app.use('/sockets', socketRouter);

// Configurar eventos de conexión y desconexión de sockets
socketRouter.io(server);

// Ruta para la vista home
app.get('/', (req, res) => {
  res.render('home', { products: [] }); // En este ejemplo, la vista home no muestra productos
});

// Iniciar el servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

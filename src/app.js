import express from 'express';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import GitHubStrategy from 'passport-github2';
import session from 'express-session';
import http from 'http';
import socketIO from 'socket.io';
import handlebars from 'express-handlebars';
import bcrypt from 'bcrypt';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

// Importar el logger
import { developmentLogger, productionLogger } from './logger.js';

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Configuración de Swagger
const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: 'Your API',
      version: '1.0.0',
      description: 'Your API description',
    },
    basePath: '/',
  },
  apis: ['path-to-your-routes-file.js'], // Reemplaza con la ruta a tus archivos de rutas
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Estrategia de inicio de sesión local con Passport
passport.use('login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  // Lógica para la autenticación local
  // ...
}));

// Estrategia de inicio de sesión con GitHub con Passport
passport.use('github', new GitHubStrategy({
  clientID: 'e1bd7ccee89663c64321',
  clientSecret: '03e24b4967f3cfe1a8b0496933a53dab83d18ac8',
  callbackURL: 'http://localhost:3000/auth/github/callback'
}, (accessToken, refreshToken, profile, done) => {
  // Lógica para manejar la autenticación con GitHub
  // ...
}));

// Configurar serialización y deserialización de usuario con Passport
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  // Lógica para deserializar el usuario
  // ...
});

// Configurar sesión de usuario con Passport
app.use(session({
  secret: 'secreto',
  resave: false,
  saveUninitialized: false
}));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

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

// Generar un ID único para los productos
function generateId() {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// Ruta para la vista home
app.get('/', (req, res) => {
  res.render('home', { products, user: req.user });
});

// Ruta para la vista realTimeProducts
app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { products, user: req.user });
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

// Implementa las rutas para el registro y la autenticación de usuarios con Passport
app.use('/auth', require('./src/routes/auth.router.js'));

// Implementa las rutas para los usuarios
app.use('/users', require('./src/routes/users.router.js'));

// Ruta para probar los logs
app.get('/loggerTest', (req, res) => {
  // Lógica para probar los logs
  // ...
});

// Iniciar el servidor en el puerto 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

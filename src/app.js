// app.js
import express from 'express';
import mongoose from 'mongoose';
import passport from 'passport';
import LocalStrategy from 'passport-local';
import GitHubStrategy from 'passport-github2';
import session from 'express-session';
import http from 'http';
import socketIO from 'socket.io';
import handlebars from 'express-handlebars';
import bcrypt from 'bcrypt';
import { userModel } from './src/dao/models/user.model.js';

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Configurar el motor de plantillas Handlebars
app.engine('handlebars', handlebars());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/src/views');

// Configurar la ruta estática para los archivos públicos
app.use(express.static('public'));

// Configurar el middleware para procesar el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar Passport y las estrategias de autenticación

// Estrategia de inicio de sesión local con Passport
passport.use('login', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return done(null, false, { message: 'Usuario no encontrado' });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return done(null, false, { message: 'Contraseña incorrecta' });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Estrategia de inicio de sesión con GitHub con Passport
passport.use('github', new GitHubStrategy({
  clientID: 'e1bd7ccee89663c64321', 
  clientSecret: '03e24b4967f3cfe1a8b0496933a53dab83d18ac8', 
  callbackURL: 'http://localhost:3000/auth/github/callback' // Ruta para el callback de GitHub
}, (accessToken, refreshToken, profile, done) => {
  // Lógica para manejar la autenticación con GitHub
  // ...
}));

// Configurar serialización y deserialización de usuario con Passport
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Configurar sesión de usuario con Passport
app.use(session({
  secret: 'secreto', // Puedes cambiar esto a una cadena más segura
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

// Iniciar el servidor en el puerto 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});

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

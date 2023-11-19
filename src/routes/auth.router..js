import { Router } from 'express';
import passport from 'passport';
import bcrypt from 'bcrypt';
import userModel from '../dao/models/user.model.js';
import GitHubStrategy from 'passport-github2';
import LocalStrategy from 'passport-local';

const router = Router();

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

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return done(null, false, { message: 'Contraseña incorrecta' });
    }

    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

// Configurar la estrategia de inicio de sesión con GitHub con Passport
passport.use('github', new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
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
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Nueva ruta para solicitar restablecer la contraseña
router.get('/recover', (req, res) => {
  res.render('recover-password'); // Puedes renderizar una vista o enviar una respuesta JSON, según tu preferencia
});

// Nueva ruta para manejar el envío del formulario de solicitud de restablecimiento
router.post('/recover', (req, res) => {
  const email = req.body.email; // Obtiene el correo electrónico proporcionado por el usuario

  // Aquí debes generar el token temporal, enviar el correo y realizar otras operaciones necesarias
  // ...

  // Envía una respuesta al usuario
  res.json({ message: 'Se ha enviado un correo con instrucciones para restablecer la contraseña.' });
});

// Ruta para el inicio de sesión
router.post('/login', passport.authenticate('login'), (req, res) => {
  res.json({ message: 'Inicio de sesión exitoso' });
});

// Ruta para iniciar sesión con GitHub
router.get('/github', passport.authenticate('github'));

// Ruta de callback para autenticación con GitHub
router.get('/github/callback', passport.authenticate('github', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

// Implementa la ruta y lógica para el registro de usuarios con Passport
router.post('/register', async (req, res) => {
  const { first_name, last_name, email, password } = req.body;
  try {
    const user = new userModel({ first_name, last_name, email, password });
    await user.save();
    res.redirect('/auth/login');
  } catch (error) {
    console.log('Error al registrar usuario:', error);
    res.status(500).send('Error en el servidor');
  }
});

export default router;

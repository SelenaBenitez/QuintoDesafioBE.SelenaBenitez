// src/routes/auth.router.js
import { Router } from 'express';
import passport from 'passport';
import { userModel } from '../dao/models/user.model.js';
import LocalStrategy from 'passport-local';
import GitHubStrategy from 'passport-github2'; // Requiere instalar el paquete 'passport-github2'
import bcrypt from 'bcrypt';

const router = Router();

// ... (resto del código)

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
  clientID: 'TU_CLIENT_ID', // Reemplazar con tu cliente ID de GitHub
  clientSecret: 'TU_CLIENT_SECRET', // Reemplazar con tu cliente secret de GitHub
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
  // Lógica para registrar un nuevo usuario en la base de datos
  // ...
  res.redirect('/login');
});

export default router;

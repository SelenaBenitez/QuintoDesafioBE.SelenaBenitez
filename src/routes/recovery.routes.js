// src/routes/recovery.router.js
import express from 'express';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import UserModel from '../dao/models/user.model.js';
import crypto from 'crypto'; // Importar la librería crypto para generar tokens únicos

const router = express.Router();

// Ruta para solicitar el restablecimiento de contraseña
router.post('/request', async (req, res) => {
  try {
    const { email } = req.body;

    // Verificar si el correo electrónico existe en la base de datos
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Generar un token único para el restablecimiento de contraseña
    const resetToken = crypto.randomBytes(20).toString('hex');

    // Establecer una fecha de expiración para el token (1 hora)
    const resetTokenExpiration = new Date();
    resetTokenExpiration.setHours(resetTokenExpiration.getHours() + 1);

    // Guardar el token y su expiración en la base de datos
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiration = resetTokenExpiration;

    await user.save();

    // Enviar un correo electrónico con un enlace para restablecer la contraseña
    const transporter = nodemailer.createTransport({
      service: 'tu_proveedor_de_correo', // Ejemplo: 'Gmail'
      auth: {
        user: 'tu_correo', // Debe ser un correo que permita el envío de correos desde aplicaciones
        pass: 'tu_contraseña',
      },
    });

    const resetLink = `http://tu_sitio_web/reset-password/${resetToken}`;
    const mailOptions = {
      from: 'tu_correo',
      to: email,
      subject: 'Recuperación de contraseña',
      text: `Para restablecer tu contraseña, haz clic en el siguiente enlace: ${resetLink}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error al enviar el correo de recuperación' });
      } else {
        console.log('Correo de recuperación enviado: ' + info.response);
        return res.json({ message: 'Correo de recuperación enviado' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Ruta para restablecer la contraseña con el token
router.post('/reset/:token', async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Buscar un usuario con el token de restablecimiento y verificar que no haya expirado
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpiration: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Token no válido o ha expirado' });
    }

    // Hashear la nueva contraseña y guardarla
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Limpiar el token de restablecimiento y su expiración
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiration = undefined;

    await user.save();

    return res.json({ message: 'Contraseña restablecida exitosamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

export default router;

// Importa las bibliotecas necesarias
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const User = require('../src/dao/models/user.model.js'); // Asegúrate de importar tu modelo de usuario

// Configura el transporte de nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail', // O utiliza otro servicio de correo
  auth: {
    user: 'selenabenitez4352@gmail.com',
    pass: 'Monedas1',
  },
});

// Controlador para enviar el correo de recuperación de contraseña
exports.sendPasswordResetEmail = async (req, res) => {
  const { email } = req.body;

  // Genera un token único para restablecer la contraseña
  const token = crypto.randomBytes(20).toString('hex');

  // Encuentra al usuario por su correo electrónico
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' });
  }

  // Establece el token y la fecha de expiración en el usuario
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // Expira en 1 hora

  // Guarda el usuario con la información actualizada
  await user.save();

  // Configura el correo electrónico
  const mailOptions = {
    to: email,
    from: 'selenabenitez4352@gmail.com',
    subject: 'Restablece tu contraseña',
    text: `
      Has solicitado restablecer tu contraseña en nuestra aplicación.
      Para continuar con el proceso, haz clic en el siguiente enlace:
      http://${req.headers.host}/reset/${token}
      Si no solicitaste esto, ignora este correo y tu contraseña seguirá siendo la misma.
    `,
  };

  // Envía el correo electrónico
  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error al enviar el correo de recuperación de contraseña' });
    }
    res.status(200).json({ message: 'Se ha enviado un correo de recuperación de contraseña' });
  });
};

import { Router } from 'express';
import { UserModel } from '../dao/models/user.model.js';
import multer from 'multer';
import nodemailer from 'nodemailer';

const router = Router();

// Ruta para obtener todos los usuarios (solo datos básicos)
router.get('/', async (req, res) => {
  try {
    const users = await UserModel.find({}, 'first_name last_name email role');
    res.send({ result: 'success', payload: users });
  } catch (error) {
    console.log('Error al obtener usuarios:', error);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para actualizar un usuario
router.put('/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const { first_name, last_name, email } = req.body;

    const userToUpdate = await UserModel.findById(uid);

    if (!userToUpdate) {
      return res.status(404).send({ status: 'error', error: 'Usuario no encontrado' });
    }

    userToUpdate.first_name = first_name;
    userToUpdate.last_name = last_name;
    userToUpdate.email = email;

    await userToUpdate.save();

    res.send({ status: 'success', payload: userToUpdate });
  } catch (error) {
    console.log('Error al actualizar usuario:', error);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para eliminar un usuario (inactivo en los últimos 2 días)
router.delete('/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    const userToDelete = await UserModel.findById(uid);

    if (!userToDelete) {
      return res.status(404).send({ status: 'error', error: 'Usuario no encontrado' });
    }

    // Calcular la diferencia de tiempo
    const currentTime = new Date();
    const lastConnectionTime = userToDelete.last_connection;
    const timeDifference = currentTime - lastConnectionTime;
    const daysDifference = timeDifference / (1000 * 3600 * 24);

    if (daysDifference <= 2) {
      return res.status(400).send({ status: 'error', error: 'Usuario no cumple con el período de inactividad' });
    }

    await UserModel.findByIdAndDelete(uid);

    // Envía un correo al usuario
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'tu_correo@gmail.com', // Cambia al correo desde el que enviarás
        pass: 'tu_contraseña', // Cambia a la contraseña del correo
      },
    });

    const mailOptions = {
      from: 'tu_correo@gmail.com', // Cambia al correo desde el que enviarás
      to: userToDelete.email,
      subject: 'Notificación de eliminación de cuenta',
      text: 'Tu cuenta ha sido eliminada debido a inactividad.',
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error al enviar correo de notificación:', error);
      } else {
        console.log('Correo de notificación enviado:', info.response);
      }
    });

    res.send({ status: 'success', message: 'Usuario eliminado' });
  } catch (error) {
    console.log('Error al eliminar usuario:', error);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para cambiar el rol de un usuario
router.post('/change-role/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const { newRole } = req.body;

    const userToChangeRole = await UserModel.findById(uid);

    if (!userToChangeRole) {
      return res.status(404).send({ status: 'error', error: 'Usuario no encontrado' });
    }

    // Verificar que el nuevo rol sea válido, por ejemplo: 'user', 'premium', 'admin'
    if (['user', 'premium', 'admin'].includes(newRole)) {
      userToChangeRole.role = newRole;
      await userToChangeRole.save();
      res.send({ status: 'success', payload: userToChangeRole });
    } else {
      res.status(400).send({ status: 'error', error: 'Rol no válido' });
    }
  } catch (error) {
    console.log('Error al cambiar el rol de usuario:', error);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para subir documentos utilizando Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Reemplaza 'uploads/' con la ruta donde deseas guardar los archivos
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post('/:uid/documents', upload.single('file'), async (req, res) => {
  try {
    const { uid } = req.params;
    const { file } = req;
    const user = await UserModel.findById(uid);

    if (!user) {
      return res.status(404).send({ status: 'error', error: 'Usuario no encontrado' });
    }

    if (file) {
      // Procesar el archivo y actualizar el estado del usuario
      // Guardar información del documento en el usuario
      user.documents.push({
        name: file.originalname,
        reference: file.path, // Esto es un ejemplo, guarda la referencia correcta
      });
      user.last_connection = new Date(); // Actualizar la última conexión

      await user.save();

      res.send({ status: 'success', payload: user });
    } else {
      res.status(400).send({ status: 'error', error: 'Archivo no subido' });
    }
  } catch (error) {
    console.log('Error al subir documentos:', error);
    res.status(500).send('Error en el servidor');
  }
});

export default router;

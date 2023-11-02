// src/routes/users.router.js
import { Router } from 'express';
import { UserModel } from '../dao/models/user.model.js';

const router = Router();

// Ruta para obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const users = await UserModel.find();
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

// Ruta para eliminar un usuario
router.delete('/:uid', async (req, res) => {
  try {
    const { uid } = req.params;

    const result = await UserModel.findByIdAndDelete(uid);

    if (!result) {
      return res.status(404).send({ status: 'error', error: 'Usuario no encontrado' });
    }

    res.send({ status: 'success', payload: result });
  } catch (error) {
    console.log('Error al eliminar usuario:', error);
    res.status(500).send('Error en el servidor');
  }
});

export default router;

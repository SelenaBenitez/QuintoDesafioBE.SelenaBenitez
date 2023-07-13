import { Router } from 'express';
import { userModel } from '../dao/models/user.model.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const users = await userModel.find();
    res.send({ result: 'success', payload: users });
  } catch (error) {
    console.log('Cannot get users with mongoose: ' + error);
    res.status(500).send('Error en el servidor');
  }
});

router.put('/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const userToReplace = req.body;
    if (!userToReplace.first_name || !userToReplace.last_name || !userToReplace.email) {
      return res.status(400).send({ status: 'error', error: 'Valores incompletos' });
    }
    const result = await userModel.updateOne({ _id: uid }, userToReplace);
    res.send({ status: 'success', payload: result });
  } catch (error) {
    console.log('Error al actualizar el usuario: ' + error);
    res.status(500).send('Error en el servidor');
  }
});

router.delete('/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const result = await userModel.deleteOne({ _id: uid });
    res.send({ status: 'success', payload: result });
  } catch (error) {
    console.log('Error al eliminar el usuario: ' + error);
    res.status(500).send('Error en el servidor');
  }
});

export default router;

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Agrega un producto al carrito del usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *             example:
 *               productId: 'productoID123'
 *               quantity: 3
 *     responses:
 *       200:
 *         description: Producto agregado al carrito con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: 'Producto agregado al carrito con éxito'
 *       400:
 *         description: Error al agregar el producto al carrito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: 'No se pudo agregar el producto al carrito'
 */

import { Router } from 'express';
import UserDAO from '../dao/user.dao.js';

const router = Router();

/**
 * @swagger
 * /cart/add:
 *   post:
 *     summary: Agrega un producto al carrito del usuario.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *             example:
 *               productId: 'productoID123'
 *               quantity: 3
 *     responses:
 *       200:
 *         description: Producto agregado al carrito con éxito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *             example:
 *               message: 'Producto agregado al carrito con éxito'
 *       400:
 *         description: Error al agregar el producto al carrito.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: 'No se pudo agregar el producto al carrito'
 */
router.post('/cart/add', async (req, res) => {
  const userId = req.user.id; // Obtener el ID del usuario desde el middleware de autenticación
  const { productId, quantity } = req.body;

  try {
    const cart = await UserDAO.addToCart(userId, productId, quantity);
    res.json({ message: 'Producto agregado al carrito con éxito' });
  } catch (error) {
    console.error('Error al agregar producto al carrito:', error);
    res.status(400).json({ error: 'No se pudo agregar el producto al carrito' });
  }
});

export default router;

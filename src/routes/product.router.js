// src/routes/product.router.js
import express from 'express';
import ProductDAO from '../dao/product.dao.js';

const router = express.Router();

// Ruta para obtener todos los productos
router.get('/products', (req, res) => {
  try {
    const products = ProductDAO.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para crear un nuevo producto
router.post('/products', (req, res) => {
  const { name, price } = req.body;

  try {
    const newProduct = ProductDAO.createProduct({ name, price });
    res.json(newProduct);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para actualizar un producto por su ID
router.put('/products/:pid', (req, res) => {
  const productId = req.params.pid;
  const { name, price } = req.body;

  try {
    const updatedProduct = ProductDAO.updateProduct(productId, name, price);
    if (!updatedProduct) {
      return res.status(404).send('Producto no encontrado');
    }
    res.json(updatedProduct);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para eliminar un producto por su ID
router.delete('/products/:pid', (req, res) => {
  const productId = req.params.pid;

  try {
    const deletedProduct = ProductDAO.deleteProduct(productId);
    if (!deletedProduct) {
      return res.status(404).send('Producto no encontrado');
    }
    res.json(deletedProduct);
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    res.status(500).send('Error en el servidor');
  }
});

export default router;

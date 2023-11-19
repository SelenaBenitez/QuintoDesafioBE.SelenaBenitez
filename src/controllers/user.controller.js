const express = require('express');
const router = express.Router();
const ProductModel = require('../dao/models/product.model');
const UserModel = require('../dao/models/user.model');

// En el controlador que maneja la acción de agregar al carrito
router.post('/add-to-cart/:productId', async (req, res) => {
    const { productId } = req.params;
    const user = req.user; // Suponiendo que el usuario actual se almacena en req.user

    try {
        const product = await ProductModel.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        // Verifica si el usuario es el propietario del producto
        if (product.owner.equals(user._id)) {
            return res.status(400).json({ message: 'No puedes agregar tu propio producto al carrito' });
        }


        const updatedUser = await UserModel.addToCart(user._id, productId);
        
        // Maneja la respuesta según tus necesidades
        res.status(200).json({ message: 'Producto agregado al carrito con éxito', user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

module.exports = router;

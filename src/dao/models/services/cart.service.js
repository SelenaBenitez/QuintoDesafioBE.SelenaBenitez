// cart.service.js
const Cart = require('../dao/models/cart.model');
const Product = require('../dao/models/product.model');
const CustomError = require('../../../utils/customError');

class CartService {
  async addToCart(userId, productId, quantity) {
    try {
      // Verificar si el producto existe
      const product = await Product.findById(productId);
      if (!product) {
        throw new CustomError('Producto no encontrado', 404);
      }

      // Verificar si el carrito ya existe para el usuario
      let cart = await Cart.findOne({ userId });

      // Si no existe, crear un nuevo carrito
      if (!cart) {
        cart = new Cart({ userId, products: [] });
      }

      // Verificar si el producto ya está en el carrito
      const existingProduct = cart.products.find(item => item.productId === productId);

      // Si existe, actualizar la cantidad; de lo contrario, agregarlo al carrito
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }

      // Guardar el carrito actualizado en la base de datos
      await cart.save();

      return cart;
    } catch (error) {
      console.error(error);
      throw new CustomError('Error al agregar producto al carrito', 500);
    }
  }

  async removeFromCart(userId, productId) {
    try {
      // Buscar el carrito del usuario
      const cart = await Cart.findOne({ userId });

      // Si no hay carrito, devolver un error
      if (!cart) {
        throw new CustomError('Carrito no encontrado', 404);
      }

      // Filtrar los productos para excluir el que se va a eliminar
      cart.products = cart.products.filter(item => item.productId !== productId);

      // Guardar el carrito actualizado en la base de datos
      await cart.save();

      return cart;
    } catch (error) {
      console.error(error);
      throw new CustomError('Error al eliminar producto del carrito', 500);
    }
  }

  async getCartDetails(userId) {
    try {
      // Buscar el carrito del usuario
      const cart = await Cart.findOne({ userId });

      // Si no hay carrito, devolver un error
      if (!cart) {
        throw new CustomError('Carrito no encontrado', 404);
      }

      return cart;
    } catch (error) {
      console.error(error);
      throw new CustomError('Error al obtener detalles del carrito', 500);
    }
  }
}

module.exports = new CartService();

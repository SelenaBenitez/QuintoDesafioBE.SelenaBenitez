
const cartsArray = [];

class CartController {
  static async addToCart(req, res) {
    try {
      const { userId, productId, quantity } = req.body;

      // Verificar si el producto existe
      const product = productsArray.find(product => product.id === productId);

      if (!product) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }

      // Verificar si el carrito ya existe para el usuario
      let cart = cartsArray.find(cart => cart.userId === userId);

      // Si no existe, crear un nuevo carrito
      if (!cart) {
        cart = { userId, products: [] };
        cartsArray.push(cart);
      }

      // Verificar si el producto ya está en el carrito
      const existingProduct = cart.products.find(item => item.productId === productId);

      // Si existe, actualizar la cantidad; de lo contrario, agregarlo al carrito
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }

      res.status(200).json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async removeFromCart(req, res) {
    try {
      const { userId } = req.params;
      const productId = req.params.productId;

      // Buscar el carrito del usuario
      const cartIndex = cartsArray.findIndex(cart => cart.userId === userId);

      // Si no hay carrito, devolver un error
      if (cartIndex === -1) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }

      // Filtrar los productos para excluir el que se va a eliminar
      cartsArray[cartIndex].products = cartsArray[cartIndex].products.filter(item => item.productId !== productId);

      res.status(200).json(cartsArray[cartIndex]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }

  static async getCartDetails(req, res) {
    try {
      const { userId } = req.params;

      // Buscar el carrito del usuario
      const cart = cartsArray.find(cart => cart.userId === userId);

      // Si no hay carrito, devolver un error
      if (!cart) {
        return res.status(404).json({ error: 'Carrito no encontrado' });
      }

      res.status(200).json(cart);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
}

module.exports = CartController;

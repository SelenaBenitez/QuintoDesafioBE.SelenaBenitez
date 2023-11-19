// persistence/product.dao.js
import Product from '../dao/models/product.model.js';

class ProductDAO {
  static productsArray = []; // Array para almacenar productos

  static async getAllProducts() {
    try {
      return this.productsArray;
    } catch (error) {
      throw error;
    }
  }

  static async getProductById(productId) {
    try {
      return this.productsArray.find(product => product._id === productId);
    } catch (error) {
      throw error;
    }
  }

  // Agrega otros métodos para operaciones con productos
}

export default ProductDAO;

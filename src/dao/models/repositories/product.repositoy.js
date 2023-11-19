// repositories/product.repository.js
import ProductDAO from '../../../persistence/product.dao.js';

class ProductRepository {
  static async getAllProducts() {
    return ProductDAO.getAllProducts();
  }

  // Implementa otros métodos según tus necesidades
}

export default ProductRepository;

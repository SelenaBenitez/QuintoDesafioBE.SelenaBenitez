class Cart {
    constructor(userId) {
      this.userId = userId;
      this.products = [];
    }
  
    addToCart(productId, quantity) {
      const existingProduct = this.products.find(item => item.productId === productId);
  
      if (existingProduct) {
        // Si el producto ya está en el carrito, actualizar la cantidad
        existingProduct.quantity += quantity;
      } else {
        // Si el producto no está en el carrito, agregarlo
        this.products.push({ productId, quantity });
      }
    }
  
    removeFromCart(productId) {
      this.products = this.products.filter(item => item.productId !== productId);
    }
  
    getCartDetails() {
      return {
        userId: this.userId,
        products: this.products,
      };
    }
  }
  
  module.exports = Cart;

const generateMockProducts = () => {
    const products = [];
    for (let i = 0; i < 100; i++) {
      const product = {
        _id: `${i + 1}`,
        name: `Producto ${i + 1}`,
        price: Math.random() * 100,
        // Agregar más propiedades si es necesario
      };
      products.push(product);
    }
    return products;
  };
  
  module.exports = { generateMockProducts };
  
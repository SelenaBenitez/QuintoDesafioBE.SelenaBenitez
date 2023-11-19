// mocking.js

module.exports = () => {
  let mockingProducts = Array.from({ length: 100 }, (_, i) => ({
    _id: `mocking${i + 1}`,
    name: `Product ${i + 1}`,
    price: Math.floor(Math.random() * 100) + 1,
  }));

  return mockingProducts;
};

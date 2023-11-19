// src/dao/product.dao.js
import generateId from '../utils/generateId.js';

// Array temporal para almacenar productos
let products = [];

// Crear un producto y agregarlo al array
const createProduct = (product) => {
  const newProduct = { ...product, id: generateId() };
  products.push(newProduct);
  return newProduct;
};

// Obtener todos los productos
const getAllProducts = () => products;

// Actualizar un producto por su ID
const updateProduct = (productId, name, price) => {
  const existingProduct = products.find((product) => product.id === productId);

  if (existingProduct) {
    existingProduct.name = name;
    existingProduct.price = price;
    return existingProduct;
  }

  return null;
};

// Eliminar un producto por su ID
const deleteProduct = (productId) => {
  const deletedProduct = products.find((product) => product.id === productId);

  if (deletedProduct) {
    products = products.filter((product) => product.id !== productId);
  }

  return deletedProduct;
};

export default { createProduct, getAllProducts, updateProduct, deleteProduct };

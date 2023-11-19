// src/controllers/product.controller.js
import { generateId } from '../utils/generateId.js';

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

// Eliminar un producto por su ID
const deleteProduct = (productId) => {
  products = products.filter((product) => product.id !== productId);
  return productId;
};

export { createProduct, getAllProducts, deleteProduct, products };

// src/controllers/socket.controller.js
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

const handleSocketConnection = (io, socket) => {
  console.log('Nuevo cliente conectado');

  socket.on('disconnect', () => {
    console.log('Cliente desconectado');
  });

  // Escuchar evento de creación de producto
  socket.on('createProduct', (product) => {
    const newProduct = { ...product, id: generateId() };
    products.push(newProduct);
    // Emitir evento de actualización de productos a todos los clientes conectados
    io.emit('updateProducts', products);
  });

  // Escuchar evento de eliminación de producto
  socket.on('deleteProduct', (productId) => {
    products = products.filter((product) => product.id !== productId);
    // Emitir evento de actualización de productos a todos los clientes conectados
    io.emit('updateProducts', products);
  });
};

export { createProduct, getAllProducts, deleteProduct, handleSocketConnection };

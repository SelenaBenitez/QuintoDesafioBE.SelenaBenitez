const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../app'); // Importa tu aplicación principal

describe('Router de productos', () => {
  it('Debería obtener una lista de productos', (done) => {
    request(app)
      .get('/api/products') // Reemplaza esto con la ruta real de tu router de productos
      .end((err, res) => {
        expect(res).to.have.status(200); // Verifica si la respuesta tiene el código de estado 200
        expect(res.body).to.be.an('array'); // Verifica si la respuesta es un arreglo
        done();
      });
  });
});

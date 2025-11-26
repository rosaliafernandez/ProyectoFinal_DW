const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000;

app.use(cors());

// Serviendo los JSONs del API de e_mercado
app.use('/cats', express.static(path.join(__dirname, '../emercado-api/cats')));
app.use('/cats_products', express.static(path.join(__dirname, '../emercado-api/cats_products')));
app.use('/products', express.static(path.join(__dirname, '../emercado-api/products')));
app.use('/products_comments', express.static(path.join(__dirname, '../emercado-api/products_comments')));
app.use('/user_cart', express.static(path.join(__dirname, '../emercado-api/user_cart')));
app.use('/sell', express.static(path.join(__dirname, '../emercado-api/sell')));
app.use('/cart', express.static(path.join(__dirname, '../emercado-api/cart')));

// Prueba
app.get('/', (req, res) => {
  res.send('Backend de e_mercado funcionando en http://localhost:3000');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`El Backend está listo. Abre: http://localhost:${PORT}`);
});
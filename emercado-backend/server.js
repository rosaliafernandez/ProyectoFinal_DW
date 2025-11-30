const express = require('express');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const PORT = 3000;

// Clave secreta para JWT
const SECRET_KEY = 'clave_secreta_emercado_2025';

app.use(cors());
app.use(express.json());

// Middleware de verificación de token
const verificarToken = (req, res, next) => {
  const token = req.header('access-token');
  if (!token) return res.status(403).json({ message: 'Acceso denegado' });
  try {
    jwt.verify(token, SECRET_KEY);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

// Serviendo los JSONs del API de e_mercado
app.use('/cats', verificarToken, express.static(path.join(__dirname, '../emercado-api/cats')));
app.use('/cats_products', verificarToken, express.static(path.join(__dirname, '../emercado-api/cats_products')));
app.use('/products', verificarToken, express.static(path.join(__dirname, '../emercado-api/products')));
app.use('/products_comments', verificarToken, express.static(path.join(__dirname, '../emercado-api/products_comments')));
app.use('/user_cart', verificarToken, express.static(path.join(__dirname, '../emercado-api/user_cart')));
app.use('/sell', verificarToken, express.static(path.join(__dirname, '../emercado-api/sell')));
app.use('/cart', verificarToken, express.static(path.join(__dirname, '../emercado-api/cart')));

// LOGIN CON JWT

// Usuarios hardcodeados para prueba
const usuarios = [
  { usuario: 'admin', contrasena: 'admin123' },
  { usuario: 'prueba', contrasena: 'prueba123' },
  { usuario: 'usuario1', contrasena: 'pass123' }
];

// Endpoint de login
app.post('/login', (req, res) => {
  const { usuario, contrasena } = req.body;
  
  console.log('Intento de login:', usuario); // Para debugging
  
  // Buscar el usuario
  const usuarioEncontrado = usuarios.find(
    u => u.usuario === usuario && u.contrasena === contrasena
  );
  
  if (usuarioEncontrado) {
    // Generar token JWT
    const token = jwt.sign(
      { usuario: usuarioEncontrado.usuario }, 
      SECRET_KEY, 
      { expiresIn: '24h' }
    );
    
    console.log('Login exitoso para:', usuario);
    
    res.json({ 
      success: true, 
      token: token,
      usuario: usuarioEncontrado.usuario
    });
  } else {
    console.log('Login fallido para:', usuario);
    
    res.status(401).json({ 
      success: false, 
      message: 'Usuario o contraseña incorrectos' 
    });
  }
});

// Prueba
app.get('/', (req, res) => {
  res.send('Backend de e_mercado funcionando en http://localhost:3000');
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`El Backend está listo. Abre: http://localhost:${PORT}`);
});
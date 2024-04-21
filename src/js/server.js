const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const { Sequelize, DataTypes } = require('sequelize');
const jwt = require('jsonwebtoken'); // Importa jsonwebtoken


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const sequelize = new Sequelize('taskmaster', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

const Usuario = sequelize.define('Usuario', {
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelize.sync().then(() => {
  console.log('Conectado a la base de datos MySQL');
}).catch((err) => {
  console.error('Error al conectar a la base de datos:', err);
});

// Ruta para manejar el envío de datos desde el formulario de registro
app.post('signup', async (req, res) => {
  const { nombre, email, password, confirmPassword } = req.body;
  
  if (password !== confirmPassword) {
    return res.status(400).send('Las contraseñas no coinciden');
  }

  try {
    const usuario = await Usuario.create({ nombre, email, password });
    console.log('Usuario creado:', usuario);
    res.status(201).send('¡Registro exitoso!');
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para manejar el inicio de sesión
app.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ where: { email } });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    if (usuario.password !== password) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Genera un token JWT válido por 1 hora (3600 segundos)
    const token = jwt.sign({ email: usuario.email }, 'secreto', { expiresIn: '1h' });

    return res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Middleware para verificar el token en rutas protegidas
function verificarToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, 'secreto', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.usuario = decoded;
    next();
  });
}

app.get('/dashboard', verificarToken, (req, res) => {
  // Si el token es válido, el middleware verificarToken habrá añadido el objeto `usuario` al objeto `req`
  const usuario = req.usuario;
  res.json({ message: 'Acceso permitido al dashboard', usuario });
});

app.listen(port, () => {
  console.log(`Servidor Node.js ejecutándose en http://localhost:${port}`);
});

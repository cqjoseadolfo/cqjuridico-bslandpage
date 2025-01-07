const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;  // Usa el puerto proporcionado por Railway o 3000

// Configuración de la base de datos
const db = mysql.createConnection({
    host: 'giklabs.com',
    user: 'c26_vacunos',
    password: 'Report$51',
    database: 'c26_vacunos'
});

// Conectar a la base de datos
db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        process.exit(1);
    }
    console.log('Conectado a la base de datos remota');
});

// Middleware para parsear datos JSON
app.use(bodyParser.json());

// Servir archivos estáticos del frontend desde /dist
app.use(express.static(path.join(__dirname, 'dist')));

// Ruta para manejar el formulario de contacto
app.post('/api/leads', (req, res) => {
    const { phone } = req.body;

    if (!phone || !/^\d{9}$/.test(phone)) {
        return res.status(400).json({ error: 'El teléfono es requerido y debe tener 9 dígitos' });
    }

    const query = 'INSERT INTO leads (phone) VALUES (?)';
    db.query(query, [phone], (err, result) => {
        if (err) {
            console.error('Error al guardar el lead en la base de datos:', err);
            return res.status(500).json({ error: 'Error al guardar el lead en la base de datos' });
        }
        res.status(200).json({ success: 'Lead guardado con éxito' });
    });
});

// Ruta principal para el frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'agenda'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Conectado a la base de datos MySQL');
});

app.post('/api/addEntry', (req, res) => {
    const { nombre, apellidos, domicilio, telefono_casa, celular, fecha_nacimiento, correo } = req.body;
    const query = 'INSERT INTO agenda (Nombre, Apellidos, Domicilio, Telefono_Casa, Celular, Fecha_de_Nacimiento, Correo) VALUES (?, ?, ?, ?, ?, ?, ?)';
    connection.query(query, [nombre, apellidos, domicilio, telefono_casa, celular, fecha_nacimiento, correo], (err, result) => {
        if (err) {
            res.status(500).json({ success: false, message: err.message });
        } else {
            res.status(200).json({ success: true, message: 'Datos insertados correctamente' }); 
        }
    });
});

app.get('/api/search', (req, res) => {
    const searchTerm = req.query.q;
    const query = 'SELECT * FROM agenda WHERE Nombre LIKE ?';
    connection.query(query, [`%${searchTerm}%`], (err, results) => {
        if (err) {
            res.status(500).json({ success: false, message: err.message });
        } else {
            res.status(200).json({ success: true, results });
        }
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

// Ruta para obtener todos los registros
app.get('/api/entries', (req, res) => {
    const query = 'SELECT * FROM agenda';
    
    connection.query(query, (err, results) => {
        if (err) {
            res.json({ success: false, message: err.message });
        } else {
            res.json({ success: true, entries: results });
        }
    });
});


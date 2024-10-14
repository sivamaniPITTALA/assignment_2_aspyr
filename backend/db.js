const mysql = require('mysql2');   

const connection = mysql.createConnection({
    host: 'localhost',              
    user: 'root',                   
    password: 'Root1@',             
    database: 'client_data'         
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to the database.');
});

module.exports = connection;

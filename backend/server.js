const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db'); // Import the MySQL connection

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS for cross-origin requests
app.use(bodyParser.json());

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Get all clients
app.get('/api/getClients', (req, res) => {
    const query = 'SELECT PTY_ID, PTY_FirstName, PTY_LastName FROM OPT_Party';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Failed to fetch clients' });
        } else {
            res.json(results);
        }
    });
});

// Get client by name
app.get('/api/getClientwithName', (req, res) => {
    const { name } = req.query; // Get the name from query parameters
    const query = 'SELECT PTY_ID, PTY_FirstName, PTY_LastName, PTY_Phone, PTY_SSN FROM OPT_Party WHERE PTY_FirstName = ? OR PTY_LastName = ?';
    db.query(query, [name, name], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Failed to fetch client by name' });
        } else {
            res.json(results);
        }
    });
});

// Get address by client ID
app.get('/api/getAddressforClient/:id', (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT A.Add_Line1, A.Add_Line2, A.Add_City, S.Stt_Name, A.Add_Zip
        FROM OPT_Address A
        JOIN SYS_State S ON A.Add_State = S.Stt_ID
        WHERE A.Add_PartyID = ?`;
    db.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Failed to fetch address for client' });
        } else {
            res.json(results);
        }
    });
});

// Get address by client name
// Get address by client name
app.get('/api/getAddressforClient/name/:name', (req, res) => {
    const clientName = req.params.name; // Capture the client name from the URL
    const query = `
        SELECT A.Add_Line1, A.Add_Line2, A.Add_City, S.Stt_Name, A.Add_Zip
        FROM OPT_Address A
        JOIN OPT_Party P ON A.Add_PartyID = P.PTY_ID
        JOIN SYS_State S ON A.Add_State = S.Stt_ID
        WHERE P.PTY_FirstName = ? OR P.PTY_LastName = ?`;

    db.query(query, [clientName, clientName], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch address' });
        }
        res.json(results);
    });
});


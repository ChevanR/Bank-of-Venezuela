const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const port = 3000;

app.use(bodyParser.json());

let db;
const maxRetries = 10;  // Increase retries
const retryDelay = 5000; // Increase delay to 5 seconds
let retryCount = 0;
const maxFailedAttempts = 3; // Maximum allowed failed login attempts

function connectToDatabase() {
    db = mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'api',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'BOV'
    });

    db.connect((err) => {
        if (err) {
            console.error(`Database connection error: ${err.message}`);
            if (retryCount < maxRetries) {
                retryCount++;
                console.log(`Retrying database connection (${retryCount}/${maxRetries})...`);
                setTimeout(connectToDatabase, retryDelay); // Retry after delay
            } else {
                console.error('Max retries reached. Exiting.');
                process.exit(1);
            }
        } else {
            console.log('Connected to the database.');
            startServer();
        }
    });
}

function startServer() {
    app.post('/login', (req, res) => {
        const { client_id, pin } = req.body;

        // Check the status and failed attempts first
        const checkStatusQuery = 'SELECT status, failed_attempts FROM clients WHERE client_id = ?';
        db.query(checkStatusQuery, [client_id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ success: false, message: 'An error occurred while processing your request.' });
                return;
            }

            if (results.length === 0) {
                res.status(401).json({ success: false, message: 'Invalid credentials.' });
                return;
            }

            const client = results[0];

            if (client.status === 'inactive') {
                res.status(403).json({ success: false, message: 'Account is locked.' });
                return;
            }

            if (client.failed_attempts >= maxFailedAttempts) {
                const lockAccountQuery = 'UPDATE clients SET status = "inactive" WHERE client_id = ?';
                db.query(lockAccountQuery, [client_id], (err, results) => {
                    if (err) {
                        console.error('Error executing query:', err);
                        res.status(500).json({ success: false, message: 'An error occurred while processing your request.' });
                        return;
                    }

                    res.status(403).json({ success: false, message: 'Account is locked due to too many failed attempts.' });
                });
                return;
            }

            // Verify the pin
            const loginQuery = 'SELECT * FROM clients WHERE client_id = ? AND pincode = ?';
            db.query(loginQuery, [client_id, pin], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    res.status(500).json({ success: false, message: 'An error occurred while processing your request.' });
                    return;
                }

                if (results.length > 0) {
                    // Reset failed attempts on successful login
                    const resetAttemptsQuery = 'UPDATE clients SET failed_attempts = 0 WHERE client_id = ?';
                    db.query(resetAttemptsQuery, [client_id], (err, results) => {
                        if (err) {
                            console.error('Error resetting failed attempts:', err);
                        }
                    });

                    res.json({ success: true });
                } else {
                    // Increment failed attempts on failed login
                    const incrementAttemptsQuery = 'UPDATE clients SET failed_attempts = failed_attempts + 1 WHERE client_id = ?';
                    db.query(incrementAttemptsQuery, [client_id], (err, results) => {
                        if (err) {
                            console.error('Error incrementing failed attempts:', err);
                        }
                    });

                    res.status(401).json({ success: false, message: 'Invalid credentials.' });
                }
            });
        });
    });

    app.post('/lock_account', (req, res) => {
        const { clientId } = req.body;

        const query = 'UPDATE clients SET status = "inactive" WHERE client_id = ?';
        db.query(query, [clientId], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ success: false, message: 'An error occurred while processing your request.' });
                return;
            }

            res.json({ success: true, message: 'Account locked successfully.' });
        });
    });

    app.get('/summary', (req, res) => {
        const { client_id } = req.query;

        const query = 'SELECT name as client_name, client_id, balance FROM clients WHERE client_id = ?';
        db.query(query, [client_id], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                res.status(500).json({ success: false, message: 'An error occurred while fetching client details.' });
                return;
            }

            if (results.length > 0) {
                const client = results[0]; // Assuming client_id is unique
                res.json({ success: true, client });
            } else {
                res.status(404).json({ success: false, message: 'Client not found.' });
            }
        });
    });

    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}/`);
    });
}

connectToDatabase();

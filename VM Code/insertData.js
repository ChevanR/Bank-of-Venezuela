const mysql = require('mysql2');
const data = {
  "transactions": [
    {
      "transaction_id": 1,
      "date": "2024-03-26",
      "amount": 50.0,
      "description": "Purchase at Grocery Store",
      "client_id": 101,
      "card_id": 201
    },
    {
      "transaction_id": 2,
      "date": "2024-03-25",
      "amount": 30.0,
      "description": "Online Purchase",
      "client_id": 102,
      "card_id": 202
    },
    {
      "transaction_id": 3,
      "date": "2024-03-24",
      "amount": 20.0,
      "description": "Restaurant Bill",
      "client_id": 103,
      "card_id": 203
    }
  ],
  "clients": [
    {
      "client_id": 101,
      "name": "Alice",
      "email": "alice@example.com",
      "phone": "+1234567890",
      "rfid": "RFID101",
      "pincode": "123456",
      "balance": 1000
    },
    {
      "client_id": 102,
      "name": "Bob",
      "email": "bob@example.com",
      "phone": "+1987654321",
      "rfid": "RFID102",
      "pincode": "567890",
      "balance": 1000
    },
    {
      "client_id": 103,
      "name": "Charlie",
      "email": "charlie@example.com",
      "phone": "+1122334455",
      "rfid": "RFID103",
      "pincode": "987654",
      "balance": 1000
    },
    {
      "client_id": 104,
      "name": "David",
      "email": "david@example.com",
      "phone": "+9988776655",
      "rfid": "RFID104",
      "pincode": "246890",
      "balance": 1000
    },
    {
      "client_id": 105,
      "name": "Eva",
      "email": "eva@example.com",
      "phone": "+1122334455",
      "rfid": "RFID105",
      "pincode": "135790",
      "balance": 1000
    },
    {
      "client_id": 106,
      "name": "Frank",
      "email": "frank@example.com",
      "phone": "+6677889900",
      "rfid": "RFID106",
      "pincode": "789012",
      "balance": 1000
    },
    {
      "client_id": 107,
      "name": "Grace",
      "email": "grace@example.com",
      "phone": "+1122334455",
      "rfid": "RFID107",
      "pincode": "802345",
      "balance": 1000
    },
    {
      "client_id": 108,
      "name": "Helen",
      "email": "helen@example.com",
      "phone": "+5566778899",
      "rfid": "RFID108",
      "pincode": "975312",
      "balance": 1000
    },
    {
      "client_id": 109,
      "name": "Ian",
      "email": "ian@example.com",
      "phone": "+1122334455",
      "rfid": "RFID109",
      "pincode": "641290",
      "balance": 1000
    },
    {
      "client_id": 110,
      "name": "Jack",
      "email": "jack@example.com",
      "phone": "+9988776655",
      "rfid": "RFID110",
      "pincode": "357912",
      "balance": 1000
    }
  ],
  "cards": [
    {
      "card_id": 201,
      "number": "1234 5678 9012 3456",
      "expiration_date": "2026-05",
      "client_id": 101
    },
    {
      "card_id": 202,
      "number": "2345 6789 0123 4567",
      "expiration_date": "2027-08",
      "client_id": 102
    },
    {
      "card_id": 203,
      "number": "3456 7890 1234 5678",
      "expiration_date": "2025-11",
      "client_id": 103
    },
    {
      "card_id": 204,
      "number": "4567 8901 2345 6789",
      "expiration_date": "2024-09",
      "client_id": 104
    },
    {
      "card_id": 205,
      "number": "5678 9012 3456 7890",
      "expiration_date": "2028-02",
      "client_id": 105
    },
    {
      "card_id": 206,
      "number": "6789 0123 4567 8901",
      "expiration_date": "2023-12",
      "client_id": 106
    },
    {
      "card_id": 207,
      "number": "7890 1234 5678 9012",
      "expiration_date": "2027-06",
      "client_id": 107
    },
    {
      "card_id": 208,
      "number": "8901 2345 6789 0123",
      "expiration_date": "2025-10",
      "client_id": 108
    },
    {
      "card_id": 209,
      "number": "9012 3456 7890 1234",
      "expiration_date": "2029-04",
      "client_id": 109
    },
    {
      "card_id": 210,
      "number": "0123 4567 8901 2345",
      "expiration_date": "2026-08",
      "client_id": 110
    }
  ]
};

const db = mysql.createConnection({
  host: 'localhost',
  user: 'api',
  password: 'password',
  database: 'BOV'
});

db.connect(err => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to database');
  }
});

const insertData = () => {
  data.clients.forEach(client => {
    const query = 'INSERT INTO clients (client_id, name, email, phone, rfid, pincode, balance) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [client.client_id, client.name, client.email, client.phone, client.rfid, client.pincode, client.balance], (err, results) => {
      if (err) {
        console.error('Error inserting client:', err);
      } else {
        console.log('Inserted client:', client.client_id);
      }
    });
  });

  data.cards.forEach(card => {
    const query = 'INSERT INTO cards (card_id, number, expiration_date, client_id) VALUES (?, ?, ?, ?)';
    db.query(query, [card.card_id, card.number, card.expiration_date, card.client_id], (err, results) => {
      if (err) {
        console.error('Error inserting card:', err);
      } else {
        console.log('Inserted card:', card.card_id);
      }
    });
  });

  data.transactions.forEach(transaction => {
    const query = 'INSERT INTO transactions (transaction_id, date, amount, description, client_id, card_id) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [transaction.transaction_id, transaction.date, transaction.amount, transaction.description, transaction.client_id, transaction.card_id], (err, results) => {
      if (err) {
        console.error('Error inserting transaction:', err);
      } else {
        console.log('Inserted transaction:', transaction.transaction_id);
      }
    });
  });
};

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the database');
  insertData();
});

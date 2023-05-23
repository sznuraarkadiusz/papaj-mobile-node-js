const sqlite3 = require('sqlite3').verbose();

// Połączenie z bazą danych
const db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) return console.error(err.message);
    console.log('Połączono z bazą danych SQLite');
});

// Utworzenie tabeli
const createTable = () => {
    const sql = `CREATE TABLE IF NOT EXISTS cars (
    id INTEGER PRIMARY KEY,
    brand TEXT,
    model TEXT,
    year_of_production INTEGER,
    price_per_day REAL,
    available BOOLEAN DEFAULT 1
  )`;

    db.run(sql, (err) => {
        if (err) return console.error(err.message);
        console.log('Utworzono tabelę "cars"');
    });
};

// Dodawanie samochodu
const addCar = (carData) => {
    const { brand, model, year_of_production, price_per_day } = carData;

    const sql = `INSERT INTO cars (brand, model, year_of_production, price_per_day) VALUES (?, ?, ?, ?)`;
    const values = [brand, model, year_of_production, price_per_day];

    db.run(sql, values, function (err) {
        if (err) return console.error(err.message);
        console.log(`Dodano samochód o ID ${this.lastID}`);
    });
};

// Usuwanie samochodu
// const deleteCar = (carId) => {
//     const sql = `DELETE FROM cars WHERE id = ?`;
//
//     db.run(sql, carId, function (err) {
//         if (err) return console.error(err.message);
//         console.log(`Usunięto samochód o ID ${carId}`);
//     });
// };

// Wypożyczenie samochodu
const rentCar = (carId) => {
    const sql = `UPDATE cars SET available = 0 WHERE id = ?`;

    db.run(sql, carId, function (err) {
        if (err) return console.error(err.message);
        console.log(`Wypożyczono samochód o ID ${carId}`);
    });
};

// Inicjalizacja aplikacji
const initApp = () => {
    createTable();

    // Dodawanie samochodów
    addCar({ brand: 'Toyota', model: 'Corolla', year_of_production: 2020, price_per_day: 50.0 });
    addCar({ brand: 'Honda', model: 'Civic', year_of_production: 2019, price_per_day: 45.0 });
    addCar({ brand: 'Ford', model: 'Mustang', year_of_production: 2021, price_per_day: 70.0 });

    // Usuwanie samochodu o ID 2
    //deleteCar(2);

    // Wypożyczenie samochodu o ID 1
    rentCar(1);

    // Zamknięcie połączenia z bazą danych po zakończeniu operacji
    db.close((err) => {
        if (err) return console.error(err.message);
        console.log('Zamknięto połączenie z bazą danych SQLite');
    });
};

// Wywołanie inicjalizacji aplikacji
initApp();

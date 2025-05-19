const fs = require("fs");
const csv = require("csv-parser");
const mongoose = require("mongoose");
const Perfume = require("./models/Perfumes");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const importCSV = async (filePath) => {
    return new Promise((resolve, reject) => {
        const results = [];

        fs.createReadStream(filePath)
            .pipe(csv({ separator: "," })) // Ensure the separator matches your file
            .on("data", (row) => {
                try {
                    row.price = row.price ? parseFloat(row.price) : 0;
                    row.sold = row.sold ? parseInt(row.sold) : 0;
                    row.lastUpdated = row.lastUpdated ? new Date(row.lastUpdated) : new Date();
                    row.available = row.available ? parseFloat(row.available ) : 0;

                    results.push(row);
                } catch (error) {
                    console.error("Error processing row:", error);
                }
            })
            .on("end", async () => {
                try {
                    await Perfume.insertMany(results);
                    console.log(`Imported ${results.length} records from ${filePath}`);
                    resolve();
                } catch (error) {
                    console.error(" Error inserting data:", error);
                    reject(error);
                }
            })
            .on("error", (error) => {
                console.error("Error reading the file:", error);
                reject(error);
            });
    });
};

const startImport = async () => {
    try {
        await connectDB(); // Ensure the database connection before inserting data
        console.log("Successfully connected to the database!");

        await importCSV("./Data_Analyse/cleaned_mens_perfume.csv");
        await importCSV("./Data_Analyse/cleaned_womens_perfume.csv");

        console.log("Successfully imported all data!");
        mongoose.connection.close();
    } catch (error) {
        console.error(" Error in the process:", error);
        mongoose.connection.close();
    }
};

startImport();

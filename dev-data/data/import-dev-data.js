const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: '../../config.env' });
const fs = require('fs');
const Tour = require('../../models/tourModel');

const DB = process.env.DATABASE;
console.log(DB);
//connection with database
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then((con) => {
    console.log('DB connection successful.....');
  })
  .catch((er) => {
    console.log('Error is : ' + er);
  });

// Read JSON file
const tours = JSON.parse(fs.readFileSync('./tours-simple.json', 'utf-8'));
//console.log(tours);

// Import Data into DB

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('inserted succesfully');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

// Delete Data from DB

const deleteData = async () => {
  try {
    await Tour.deleteMany();
    process.exit();
  } catch (err) {
    console.log(err);
  }
};
if (process.argv[2] === '--import') {
  console.log('function called');
  importData();
} else if (process.argv[2] === '--delete') deleteData();
console.log(process.argv);
//process.exit();

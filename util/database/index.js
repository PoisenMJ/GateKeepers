/* eslint-disable no-underscore-dangle */
const dotenv = require('dotenv');

dotenv.config();

const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const User = require('../../models/user');
const Creator = require('../../models/creator');

const { argv } = yargs(hideBin(process.argv));

const { operation, type } = argv;

const TYPES = [
  'USER',
  'CREATOR',
];

const connectToDB = async () => {
  await mongoose.connect(process.env.DB_URI, { useNewUrlParser: true }).catch((e) => {
    console.log(`Error connecting to mongodb: ${e}`);
  });
  return mongoose;
};

async function readFile() {
  console.log('Reading file:', path.join(__dirname, 'data.json'));
  const data = await fs.readFile(path.join(__dirname, 'data.json'), 'utf8');
  const parsedData = JSON.parse(data);
  return parsedData;
}

async function insert() {
  const data = await readFile();
  // console.log('Data from file:', data);
  const userKeys = Object.keys(data[type.toLowerCase()]);
  /**
   * IF TYPE ISN'T CREATOR THEN EVERYTHING IS NORMAL
   * IF IT IS THEN YOU HAVE TO CREATE BOTH A USER AND CREATOR
   */
  for (let i = 0; i < userKeys.length; i += 1) {
    const current = data.user[userKeys[i]];

    const { password } = current;
    const hashedPassword = crypto.createHash('md5').update(password, 'utf-8').digest('hex');
    let newUser;
    try {
      // eslint-disable-next-line no-await-in-loop
      newUser = await User.replaceOne({ username: userKeys[i] }, {
        username: userKeys[i],
        firstName: current.firstName,
        lastName: current.lastName,
        password: hashedPassword,
        email: current.email,
        image: current.image,
        accountType: current.accountType,
        accountActivated: current.accountActivated,

      }, {
        upsert: true,
      });
      console.log(`Created User: ${userKeys[i]}, with password: ${password}`);
    } catch (e) {
      console.log(`Error adding user: ${userKeys[i]}, ${e}`);
      break;
    }
    if (type === 'CREATOR') {
      const currentCreator = data.creator[userKeys[i]];
      try {
        // eslint-disable-next-line no-await-in-loop
        await Creator.replaceOne({ user: newUser._id }, {
          name: currentCreator.name,
          user: newUser._id,
          email: currentCreator.email,
          tag: currentCreator.tag,
          links: currentCreator.links,
          image: currentCreator.image,
        }, {
          upsert: true,
        });
        console.log(`Creating CREATOR: ${userKeys[i]}.`);
      } catch (e) {
        console.log('ERROR SAVING CREATOR:', e);
      }
    }
  }
}

(async function () {
  await connectToDB();
  console.log(`Connected to DB: ${process.env.DB_URI}`);
  if (TYPES.includes(type)) {
    if (operation === 'insert') {
      await insert();
      mongoose.disconnect();
    } else {
      console.log('Invalid operation.');
    }
  } else {
    console.log('Invalid type.');
  }
}());

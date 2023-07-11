const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(__dirname, 'db.json');

const getHouses = (req, res) => {
  try {
    const houses = loadDatabase();
    res.status(200).json(houses);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteHouse = (req, res) => {
  try {
    const { id } = req.params;
    const houses = loadDatabase();

    const houseIndex = houses.findIndex((house) => house.id === Number(id));
    if (houseIndex === -1) {
      return res.status(404).json({ error: 'House not found' });
    }

    houses.splice(houseIndex, 1);
    saveDatabase(houses);

    res.status(200).json(houses);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createHouse = (req, res) => {
  try {
    const { address, price, imageURL } = req.body;
    const houses = loadDatabase();

    const newHouse = {
      id: getNextHouseId(),
      address,
      price,
      imageURL,
    };

    houses.push(newHouse);
    saveDatabase(houses);

    res.status(201).json(houses);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateHouse = (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    const houses = loadDatabase();

    const houseIndex = houses.findIndex((house) => house.id === Number(id));
    if (houseIndex === -1) {
      return res.status(404).json({ error: 'House not found' });
    }

    if (type === 'minus') {
      houses[houseIndex].price -= 10000;
    } else if (type === 'plus') {
      houses[houseIndex].price += 10000;
    }

    saveDatabase(houses);

    res.status(200).json(houses);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

function loadDatabase() {
  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
}

function saveDatabase(data) {
  const jsonData = JSON.stringify(data, null, 2);
  fs.writeFileSync(dbPath, jsonData, 'utf8');
}

function getNextHouseId() {
  const houses = loadDatabase();
  const maxId = Math.max(...houses.map((house) => house.id));
  return maxId + 1;
}

module.exports = {
  getHouses,
  deleteHouse,
  createHouse,
  updateHouse,
};

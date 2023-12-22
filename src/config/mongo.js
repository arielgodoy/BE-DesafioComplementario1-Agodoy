// 'mongodb+srv://arielgodoy:Ag13135401@clustermongodb.k5c43jz.mongodb.net/?retryWrites=true&w=majority';

//const { MongoClient } = require('mongodb');
const { connect } = require('mongoose')

const uri = 'mongodb+srv://arielgodoy:Ag13135401@clustermongodb.k5c43jz.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectDb() {
  try {
    await client.connect();
    console.log('Conexión a MongoDB establecida correctamente');
    return client.db();  // Retorna el objeto de la base de datos
  } catch (error) {
    console.error('Error de conexión a MongoDB:', error);
    throw error;
  }
}

module.exports = { connectDb };


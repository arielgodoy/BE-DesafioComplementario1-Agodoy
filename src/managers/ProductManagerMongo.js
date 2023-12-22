const { model, Schema } = require('mongoose');

// Define el esquema del producto
const productSchema = new Schema({
  title: String,
  description: String,
  code: String,
  price: Number,
  thumbnail: String,
  stock: Number,
  status: String,
  category: String,
});

// Crea el modelo de Producto
const Product = model('Product', productSchema);

class ProductManager {
  constructor() {}

  async addProduct(title, description, price, thumbnail, code, stock, status, category) {
    try {
      const existingProduct = await Product.findOne({ code });
      if (existingProduct) {
        return { success: false, message: `El código del producto ya existe, Code=${code}` };
      }

      const product = new Product({
        title,
        description,
        code,
        price,
        thumbnail,
        stock,
        status,
        category,
      });

      await product.save();
      return { success: true, message: 'Producto agregado con éxito.' };
    } catch (error) {
      console.error('Error al agregar producto:', error);
      return { success: false, message: 'Error al agregar el producto.' };
    }
  }

  async deleteProduct(id) {
    try {
      const result = await Product.deleteOne({ _id: id });
      if (result.deletedCount > 0) {
        return { success: true, message: `Producto con ID ${id} eliminado con éxito.` };
      } else {
        return { success: false, message: `No se encontró un producto con ID ${id}.` };
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      return { success: false, message: 'Error al eliminar el producto.' };
    }
  }

  async updateProduct(id, updatedProduct) {
    try {
      const result = await Product.updateOne({ _id: id }, { $set: updatedProduct });
      if (result.modifiedCount > 0) {
        return { success: true, message: `Producto con ID ${id} actualizado con éxito.` };
      } else {
        return { success: false, message: `No se encontró un producto con ID ${id}.` };
      }
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      return { success: false, message: 'Error al actualizar el producto.' };
    }
  }

  async getProducts() {
    try {
      const products = await Product.find();
      return Promise.resolve(products);
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return Promise.resolve([]);
    }
  }

  async getProductById(id) {
    try {
      const product = await Product.findById(id);
      return product;
    } catch (error) {
      console.error('Error al obtener producto por ID:', error);
      return null;
    }
  }

  async getProductByCode(code) {
    try {
      const product = await Product.findOne({ code });
      return product !== null;
    } catch (error) {
      console.error('Error al verificar producto por código:', error);
      return false;
    }
  }
}

module.exports = ProductManager;

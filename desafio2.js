// En el codigo trabajo con un archivo productos.json para almacenar los datos de los productos

const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  getProducts() {
    try {
      const data = fs.readFileSync(this.path, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  addProduct(product) {
    const products = this.getProducts();
    const id = this.generateUniqueId(products);
    const newProduct = { ...product, id };
    products.push(newProduct);
    this.saveToFile(products);
    return newProduct;
  }

  getProductById(id) {
    const products = this.getProducts();
    const product = products.find(p => p.id === id);
    if (!product) {
      throw new Error('Producto no encontrado');
    }
    return product;
  }

  updateProduct(id, updatedFields) {
    const products = this.getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Producto no encontrado');
    }
    const updatedProduct = { ...products[index], ...updatedFields, id };
    products[index] = updatedProduct;
    this.saveToFile(products);
    return updatedProduct;
  }

  deleteProduct(id) {
    const products = this.getProducts();
    const updatedProducts = products.filter(p => p.id !== id);
    if (updatedProducts.length === products.length) {
      throw new Error('Product not found');
    }
    this.saveToFile(updatedProducts);
  }

  generateUniqueId(products) {
    const ids = products.map(p => p.id);
    let id;
    do {
      id = Math.floor(Math.random() * 1000);
    } while (ids.includes(id));
    return id;
  }

  saveToFile(products) {
    fs.writeFileSync(this.path, JSON.stringify(products, null, 2), 'utf-8');
  }
}

const productManager = new ProductManager('productos.json');

// Obtener productos
console.log(productManager.getProducts());

// Agrega un producto
const newProduct = {
  title: 'producto prueba',
  description: 'Este es un producto prueba',
  price: 200,
  thumbnail: 'Sin imagen',
  code: 'abc123',
  stock: 25
};
console.log(productManager.addProduct(newProduct));

// Obtener productos nuevamente
console.log(productManager.getProducts());

// Obtener producto por ID 
console.log(productManager.getProductById(newProduct.id));

// Actualizar producto
const updatedFields = { price: 250, stock: 30 };
console.log(productManager.updateProduct(newProduct.id, updatedFields));

// Eliminar producto
productManager.deleteProduct(newProduct.id);

// Obtener productos después de eliminar
console.log(productManager.getProducts());
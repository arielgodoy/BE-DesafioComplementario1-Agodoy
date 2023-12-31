const express = require('express');
const path = require("path");
const { Server } = require('socket.io');
const { engine } = require("express-handlebars");
const productRouter = require('./routes/products.router.js');
const cartRouter = require('./routes/carts.router.js');
const hbsrouter = require('./routes/handlebars.router.js');
const userRouter = require('./routes/users.router.js')
const ProductManager = require('./managers/ProductManagerMongo.js');
const { connect } = require('mongoose')
//Mongo
// Conectar a la base de datos
const connectDb = async () => {
  // await connect('mongodb+srv://<username>:<pasword>@coderexample.hjzrdtr.mongodb.net/c55625?retryWrites=true&w=majority')
  await connect('mongodb+srv://arielgodoy:Ag13135401@clustermongodb.k5c43jz.mongodb.net/?retryWrites=true&w=majority')
  console.log('Base de datos conectada')
}
connectDb()


const app = express();
const port = 8080;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '/public')));
// handlebars
app.engine("handlebars", engine());  // Usa la propiedad engine de la instancia
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname + '/views'));


// routers
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

app.use('/',hbsrouter);
app.use('/api/users', userRouter)

const httpServer = app.listen(port, (err) => {
    if (err) throw err;
    console.log(`server running on ${port}`);
});

// Winsocket
const io = new Server(httpServer);
io.on('connection',socket=>{    
    console.log('Nueva conexion entrante.. por WS');      
    socket.on('addproduct',formData => {                    
        const status=productManager.addProduct(formData.title,
            formData.description,
            formData.price,
            formData.thumbnail,
            formData.code,
            formData.stock,
            formData.status,
            formData.category);        
        socket.emit('resultado.addproduct',status)
        socket.broadcast.emit('productosactualizados',status       
        
        );
        })
        socket.on('getproducts', async (limit) => {
            console.log("Data solicitada por getProducts " + limit);
          
            try {
              // Espera a que la operación asíncrona se complete
              let products = await productManager.getProducts(parseInt(limit));        
              
              socket.emit('resultado.getproducts', products);
            } catch (error) {
              console.error('Error al obtener productos:', error);
              socket.emit('resultado.getproducts', { error: 'Error al obtener productos' });
            }
          });
          
    socket.on('eliminaProducto',id =>{
            console.log("Eliminando Producto ID = "+ id);
            let resultado=productManager.deleteProduct(id);
            //socket.emit('resultado.eliminaproducto',resultado);
            socket.broadcast.emit('productosactualizados',resultado);
            });

    

})
// hasta aqui Winsocket


// Multer
// app.post('/single', uploader(), (req, res) => {
//     res.send('Archivo subido correctamente');
// });
// hasta aqui Multer
// Throw error
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('error de server');
});

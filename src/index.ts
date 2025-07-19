//console.log("Hello from TypeScript!");

import express, { Request, Response } from 'express';
import { Product } from './Products';
import { v4 as uuidv4 } from 'uuid';
import { Update } from './Update';
import mongoose, { Schema, Document } from 'mongoose';
import connectDB from './db';
import ProductModel, { IProduct } from './Models/Product';

export interface IProduct extends Document {
  id: string;
  title: string;
  image: string;
  price: number;
  link: string;
}

const ProductSchema: Schema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  link: { type: String, required: true },
});

export default mongoose.model<IProduct>('Product', ProductSchema);
const app = express();
const port = process.env.PORT || 3000;



let products: Product[] = [
    {
        id: '1',
        title: 'Sample Product',
        image: 'https://example.com/image.jpg',
        price: 99.99,
        link: 'https://example.com/product'
    }
    
];

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
      res.send('Hello from Express with TypeScript!');
});

//Returning All Products//
app.get('/products', (req: Request, res: Response<Product[]>) => {
    res.json(products);

}); 

// CREATE a new product
app.post('/product', async (req: Request, res: Response) => {
  try {
    const newProduct = new ProductModel({ id: uuidv4(), ...req.body });
    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});


// Update or modify product
app.put('/products/:id', (req: Request<{ id: string }, {}, Update>, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;
      
    const index = products.findIndex(p => p.id === id);
    console.log("the index is ",index);
    console.log("the old data is ",products[index]);
    console.log("the new data is ",updateData);
    if (index === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    products[index] = { ...products[index], ...updateData };
    res.json(products[index]);
});

app.delete('/products/:id', (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;

  const index = products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Product not found' });
    }

})

app.listen(
    port, 
    () => {
        console.log('Server is running on http://localhost:'+port)
    } 
);
const mongoose = require('mongoose');
const Product = require('./models/Product');

mongoose.connect('mongodb://lalithapavani:pavani13@ac-7x5vm3m-shard-00-00.xyqld7e.mongodb.net:27017,ac-7x5vm3m-shard-00-01.xyqld7e.mongodb.net:27017,ac-7x5vm3m-shard-00-02.xyqld7e.mongodb.net:27017/ecommerce?ssl=true&replicaSet=atlas-3xvmbq-shard-0&authSource=admin&appName=Cluster0')
.then(async () => {
  console.log('Connected!');
  await Product.findOneAndUpdate(
    {name: 'Floral Summer Dress'},
    {image: 'https://images.unsplash.com/photo-1623609163859-ca93c959b98a?w=500'}
  );
  await Product.findOneAndUpdate(
    {name: 'Suede Ankle Boots'},
    {image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500'}
  );
  await Product.findOneAndUpdate(
    {name: 'Premium Kitchen Knife Set'},
    {image: 'https://images.unsplash.com/photo-1588891825842-c0b531f5c8c8?w=500'}
  );
  console.log('All images updated!');
  process.exit();
})
.catch(err => {
  console.error(err); 
  process.exit(1);
});


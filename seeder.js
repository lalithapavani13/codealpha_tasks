const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const sampleProducts = [
  {
    name: 'Sport Runner Sneakers',
    shortDescription: 'Lightweight running shoes with breathable mesh and cushioned sole.',
    description: 'Designed for everyday training and city runs, these sneakers feature a soft foam midsole for comfort, breathable mesh upper, and a flexible rubber outsole. The low-profile design delivers a modern sporty look whether you are heading to the gym or running errands.',
    category: 'fashion',
    price: 74.99,
    image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80',
    stock: 65,
  },
  {
    name: 'Smartphone Pro Max',
    shortDescription: 'Latest-generation smartphone with stunning display and fast performance.',
    description: 'A powerful smartphone with a large OLED display, advanced camera system, and long-lasting battery. Features fast charging, facial unlock, and seamless multitasking for work and entertainment. Comes with 128GB storage, dual-SIM support, and premium build quality.',
    category: 'electronics',
    price: 899.99,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
    stock: 40,
  },
  {
    name: 'Classic Cotton T-Shirt',
    shortDescription: 'Breathable cotton tee, regular fit, perfect for everyday wear.',
    description: 'Premium 100% cotton material with soft finish and breathability. Available in classic crew neck styling with durable stitching. Gentle machine wash care keeps color bright and fit consistent. Ideal for layering, casual outings, and all-day comfort.',
    category: 'fashion',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
    stock: 100,
  },
  {
    name: 'Wireless Noise Cancelling Headphones',
    shortDescription: 'Premium sound, active noise canceling, and soft ear cushions.',
    description: 'High-fidelity audio with active noise cancellation and plush memory foam ear pads. Lightweight design delivers hours of comfortable listening. Includes built-in mic for hands-free calls and Bluetooth connectivity. Great for travel, work, and immersive entertainment.',
    category: 'electronics',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1200&q=80',
    stock: 45,
  },
  {
    name: 'Floral Summer Dress',
    shortDescription: 'Lightweight floral dress with soft fabric and breezy fit.',
    description: 'A mid-length floral dress crafted from breathable fabric with adjustable straps and a flattering waistline. Soft lining ensures comfort while the vibrant print adds fresh seasonal style. Machine washable fabric keeps care easy and color crisp. Great for brunch, outdoor events, and weekend wear.',
    category: 'fashion',
    price: 54.99,
    image: 'https://images.unsplash.com/photo-1623609163859-ca93c959b98a?w=500',
    stock: 70,
  },
  {
    name: 'Leather Crossbody Handbag',
    shortDescription: 'Compact leather handbag with adjustable strap and multiple pockets.',
    description: 'Premium faux leather construction with a secure zip closure and interior pockets for phone and cards. Adjustable crossbody strap offers hands-free convenience while the structured silhouette stays polished. Durable hardware and easy-to-clean surface make it a go-to everyday bag. Perfect for shopping trips and city style.',
    category: 'fashion',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
    stock: 35,
  },
  {
    name: 'Suede Ankle Boots',
    shortDescription: 'Stylish suede boots with cushioned footbed and durable sole.',
    description: 'Chic ankle boots featuring a supple suede upper and supportive padded insole. Sturdy rubber outsole delivers traction for city streets and brisk weather. Side zip closure makes them easy to slip on, while the neutral tone complements denim and dresses alike. Ideal for fall outfits and casual weekend looks.',
    category: 'fashion',
    price: 99.99,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500',
    stock: 40,
  },
  {
    name: 'Denim Jacket',
    shortDescription: 'Classic denim jacket with soft lining and relaxed fit.',
    description: 'A wardrobe essential crafted from durable denim with a slightly relaxed silhouette. Button-front closure, twin chest pockets, and comfortable interior lining make it versatile for layering. Washable construction keeps it easy to care for and ready for everyday styling. Great over tees, dresses, and knitwear.',
    category: 'fashion',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80',
    stock: 55,
  },
  {
    name: 'Modern Ceramic Vase',
    shortDescription: 'Elegant home decor piece with matte finish and sculpted silhouette.',
    description: 'Handcrafted ceramic vase with a minimalist matte finish and sculpted form. Perfect for dried flowers, tabletop decor, or accent styling. Durable glaze resists scratches and adds premium texture. Ideal for modern living rooms, entryways, and gift giving.',
    category: 'home',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    stock: 60,
  },
  {
    name: 'Textured Throw Cushion',
    shortDescription: 'Soft cushion with textured knit cover and plush filling.',
    description: 'Decorative living room cushion with a soft textured knit cover and supportive polyester fill. Neutral tones blend easily with modern and cozy interiors. The removable cover makes cleaning simple, while the plush cushion remains comfortable for lounging. Perfect for sofas, armchairs, and bedroom styling.',
    category: 'home',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80',
    stock: 75,
  },
  {
    name: 'Decorative Table Lamp',
    shortDescription: 'Stylish table lamp with warm LED lighting and ceramic base.',
    description: 'A contemporary table lamp featuring a ceramic base and soft linen shade. The warm LED bulb provides ambient lighting ideal for bedrooms, desks, or living spaces. Easy on/off switch and energy-efficient performance make it practical as well as decorative. Great for reading nooks, bedside tables, and cozy corners.',
    category: 'home',
    price: 59.99,
    image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80',
    stock: 50,
  },
  {
    name: 'Abstract Wall Art Print',
    shortDescription: 'Modern abstract print in muted colors for stylish wall decor.',
    description: 'High-quality giclée print on durable art paper with rich tonal detail. The modern abstract design adds visual interest to living rooms, bedrooms, and offices. Easy to frame and hang, it creates a polished gallery wall effect. Perfect for updating decor with a fresh, contemporary accent.',
    category: 'home',
    price: 45.99,
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
    stock: 40,
  },
  {
    name: 'Premium Kitchen Knife Set',
    shortDescription: 'Five-piece stainless steel knife set with ergonomic handles.',
    description: 'Professional-grade kitchen knives crafted from high-carbon stainless steel for lasting sharpness. Ergonomic handles provide balance and comfort during prep work. Includes chef knife, bread knife, utility knife, paring knife, and kitchen shears. Ideal for home cooks who value precision and durability.',
    category: 'home',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1588891825842-c0b531f5c8c8?w=500',
    stock: 55,
  },
];

const seed = async () => {
  try {
    for (const product of sampleProducts) {
      const exists = await Product.exists({ name: product.name });
      if (!exists) {
        await Product.create(product);
        console.log(`Added product: ${product.name}`);
      } else {
        console.log(`Skipped existing product: ${product.name}`);
      }
    }
    console.log('Seeder finished without deleting existing products');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();

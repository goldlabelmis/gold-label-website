const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Product Catalog pointing to your local images folder
const products = [
  { 
    id: 1, 
    name: 'Pancit Canton', 
    category: 'Noodles', 
    description: 'Classic Filipino stir-fry noodles, rich in flavor and aroma.', 
    tag: 'Bestseller', 
    image: '/images/canton.jpg' 
  },
  { 
    id: 2, 
    name: 'Spaghetti Pasta', 
    category: 'Pasta', 
    description: 'Premium quality pasta ideal for Pinoy-style sweet spaghetti.', 
    tag: 'Bestseller', 
    image: '/images/spag.jpg' 
  },
  { 
    id: 3, 
    name: 'Pancit Bihon', 
    category: 'Noodles', 
    description: 'Traditional thin rice flour noodles for special family celebrations.', 
    tag: 'Popular', 
    image: '/images/bihon.jpg' 
  },
  { 
    id: 4, 
    name: 'Elbow Macaroni', 
    category: 'Pasta', 
    description: 'Perfect for chicken macaroni soup and creamy cold pasta salads.', 
    tag: 'Family Favorite', 
    image: '/images/macaroni.jpg' 
  },
  { 
    id: 5, 
    name: 'Special Misua', 
    category: 'Noodles', 
    description: 'Ultra-thin wheat flour vermicelli, ideal for patola, meatball, or almondigas soups.', 
    tag: 'Traditional', 
    image: '/images/misua.jpg' 
  },
  { 
    id: 6, 
    name: 'Fresh Miki Noodles', 
    category: 'Noodles', 
    description: 'Flat yellowish wheat noodles crafted for Pancit Lomi, Mami, or Molo broth.', 
    tag: 'Chef Choice', 
    image: '/images/miki.jpg' 
  },
  { 
    id: 7, 
    name: 'Golden Egg Noodles', 
    category: 'Noodles', 
    description: 'Rich noodles crafted with wheat flour and fresh eggs for extra springy texture.', 
    tag: 'Extra Egg-ilicious', 
    image: '/images/egg.jpg' 
  },
  { 
    id: 8, 
    name: 'Sweet Style Spaghetti Sauce', 
    category: 'Sauces', 
    description: 'Savory-sweet tomato sauce blend crafted specifically for authentic Pinoy sweet spaghetti.', 
    tag: 'New Item', 
    image: '/images/sauce.jpg' 
  }
];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  console.log(`Inquiry from ${name} (${email}): ${message}`);
  res.json({ success: true, message: 'Thank you for reaching out! We will respond shortly.' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
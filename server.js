const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Replace this string with your actual Google Apps Script Web App URL
const GOOGLE_SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxK614aEI2A4E5-rU6CG_Kdy_ISFT7qAEcBzFTm_FWALoytGIwg811NiJXrH_qT0HTO/exec';

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

// Serve Main Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// API Route: Get Product Catalog
app.get('/api/products', (req, res) => {
  res.json(products);
});

// API Route: Careers / Applicant Form Submission -> Google Sheets
app.post('/api/careers', async (req, res) => {
  const { name, email, position, resume } = req.body;

  // Log locally in terminal
  console.log('--- New Career Application ---');
  console.log(`Applicant Name : ${name}`);
  console.log(`Email Address  : ${email}`);
  console.log(`Position       : ${position}`);
  console.log(`Resume Link    : ${resume || 'None provided'}`);

  try {
    // Send data asynchronously to your Google Sheet Web App endpoint
    const sheetResponse = await fetch(GOOGLE_SHEET_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, position, resume: resume || '' })
    });

    const result = await sheetResponse.json();

    if (result.status === 'success') {
      res.json({ 
        success: true, 
        message: 'Thank you for your application! Our HR team will review your submission shortly.' 
      });
    } else {
      throw new Error('Google Apps Script returned a failed status response.');
    }
  } catch (error) {
    console.error('Error forwarding data to Google Sheet:', error.message);
    
    // Still send a fallback success response if local server received it, or return an error message
    res.status(500).json({ 
      success: false, 
      message: 'Failed to record application to Google Sheets. Please try again later.' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
/**
 * Seed Firestore with sample products so the app can run locally without manual data entry.
 *
 * Prerequisites:
 * 1. Create a Firebase project and enable Firestore.
 * 2. Generate a service account key: Firebase Console → Project Settings → Service accounts → Generate new private key.
 * 3. Set the path to the JSON key file:
 *    Windows: set GOOGLE_APPLICATION_CREDENTIALS=path\to\your-service-account.json
 *    macOS/Linux: export GOOGLE_APPLICATION_CREDENTIALS=path/to/your-service-account.json
 *
 * Run: npm run seed
 */

const admin = require('firebase-admin');

const PROJECT_ID = 'advanced-ecom-web-app';

const SAMPLE_PRODUCTS = [
  {
    title: 'Sample T-Shirt',
    price: 19.99,
    description: 'A comfortable cotton t-shirt for everyday wear.',
    category: 'Clothing',
    image: 'https://via.placeholder.com/300x300?text=T-Shirt',
  },
  {
    title: 'Wireless Mouse',
    price: 29.99,
    description: 'Ergonomic wireless mouse with long battery life.',
    category: 'Electronics',
    image: 'https://via.placeholder.com/300x300?text=Mouse',
  },
  {
    title: 'Desk Lamp',
    price: 34.99,
    description: 'Modern LED desk lamp with adjustable brightness.',
    category: 'Home',
    image: 'https://via.placeholder.com/300x300?text=Lamp',
  },
  {
    title: 'Running Shoes',
    price: 89.99,
    description: 'Lightweight running shoes with cushioned sole.',
    category: 'Clothing',
    image: 'https://via.placeholder.com/300x300?text=Shoes',
  },
  {
    title: 'USB-C Hub',
    price: 49.99,
    description: '7-in-1 USB-C hub with HDMI and SD card reader.',
    category: 'Electronics',
    image: 'https://via.placeholder.com/300x300?text=Hub',
  },
];

async function seed() {
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    console.error(
      'GOOGLE_APPLICATION_CREDENTIALS is not set. Please set it to the path of your Firebase service account JSON key.\n' +
      'See Firebase Console → Project Settings → Service accounts → Generate new private key.'
    );
    process.exit(1);
  }

  try {
    if (!admin.apps.length) {
      admin.initializeApp({ projectId: PROJECT_ID });
    }
  } catch (e) {
    console.error('Failed to initialize Firebase Admin:', e.message);
    process.exit(1);
  }

  const db = admin.firestore();

  console.log('Seeding products collection...');
  const batch = db.batch();
  const col = db.collection('products');

  for (const product of SAMPLE_PRODUCTS) {
    const ref = col.doc();
    batch.set(ref, product);
  }

  await batch.commit();
  console.log(`Added ${SAMPLE_PRODUCTS.length} sample products.`);
  console.log('Done. You can run the app and visit Manage Products or the home page to see them.');
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

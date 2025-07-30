import { db } from "../server/db";
import { portfolioProjects, products, profiles } from "../shared/schema";

async function seedData() {
  try {
    console.log('Seeding database with sample data...');

    // Add admin profile
    const adminProfile = {
      id: '10c866a7-9913-42f3-b0dc-f7ed753cda55',
      email: 'admin@celestiallights.com',
      role: 'admin'
    };

    await db.insert(profiles).values(adminProfile).onConflictDoNothing();
    console.log('✓ Admin profile created');

    // Add sample portfolio projects
    const sampleProjects = [
      {
        title: 'Luxury Residential Complex',
        category: 'residential',
        description: 'Smart LED integration with automated control systems for modern living spaces.',
        features: ['Smart Controls', 'Energy Efficient', 'Custom Design'],
        location: 'Mumbai, Maharashtra',
        isPublished: true,
        isFeatured: true
      },
      {
        title: 'Corporate Headquarters',
        category: 'commercial',
        description: 'Architectural facade lighting creating a stunning nighttime landmark.',
        features: ['Facade Lighting', 'RGB Controls', 'Weather Resistant'],
        location: 'Pune, Maharashtra',
        isPublished: true,
        isFeatured: false
      },
      {
        title: 'Hotel Ambience Project',
        category: 'hospitality',
        description: 'Sophisticated lighting design enhancing guest experience and brand identity.',
        features: ['Mood Lighting', 'Dimming Systems', 'Brand Integration'],
        location: 'Goa',
        isPublished: true,
        isFeatured: true
      }
    ];

    await db.insert(portfolioProjects).values(sampleProjects);
    console.log('✓ Portfolio projects created');

    // Add sample products
    const sampleProducts = [
      {
        title: 'Smart LED Panels',
        category: 'Smart Lighting',
        description: 'Advanced LED panels with smart controls and customizable lighting effects for modern spaces.',
        technicalSpecifications: ['WiFi Enabled', 'Color Changing', 'Voice Control', 'Energy Efficient'],
        isPublished: true,
        isFeatured: true
      },
      {
        title: 'Commercial Floodlights',
        category: 'Outdoor Lighting',
        description: 'High-performance LED floodlights designed for commercial and industrial applications.',
        technicalSpecifications: ['IP65 Waterproof', '50,000 Hour Lifespan', 'Motion Sensor', 'Adjustable Brightness'],
        isPublished: true,
        isFeatured: false
      },
      {
        title: 'Residential Track Lighting',
        category: 'Indoor Lighting',
        description: 'Elegant track lighting system perfect for highlighting artwork and architectural features.',
        technicalSpecifications: ['Adjustable Heads', 'Dimmable', 'Easy Installation', 'Modern Design'],
        isPublished: true,
        isFeatured: true
      }
    ];

    await db.insert(products).values(sampleProducts);
    console.log('✓ Products created');

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedData();
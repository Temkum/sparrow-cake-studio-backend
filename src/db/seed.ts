import { db } from './index';
import { cakes, reviews } from './schema';

// Sample cake data
const sampleCakes = [
  {
    name: 'Classic Chocolate Cake',
    description:
      'Rich, moist chocolate cake with layers of chocolate buttercream frosting. Perfect for chocolate lovers.',
    price: '45.00',
    category: 'Chocolate',
    imageUrl:
      'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=300&fit=crop',
  },
  {
    name: 'Vanilla Bean Celebration Cake',
    description:
      'Light and fluffy vanilla cake with vanilla bean frosting and fresh berries. A timeless classic.',
    price: '42.00',
    category: 'Vanilla',
    imageUrl:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
  },
  {
    name: 'Red Velvet Delight',
    description:
      'Moist red velvet cake with cream cheese frosting. A Southern favorite with a modern twist.',
    price: '48.00',
    category: 'Red Velvet',
    imageUrl:
      'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=400&h=300&fit=crop',
  },
  {
    name: 'Carrot Cake Supreme',
    description:
      'Spiced carrot cake with walnuts, raisins, and cream cheese frosting. Healthy and delicious!',
    price: '46.00',
    category: 'Spiced',
    imageUrl:
      'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=300&fit=crop',
  },
  {
    name: 'Strawberry Shortcake',
    description:
      'Fresh strawberry layers with whipped cream and sponge cake. Light and refreshing.',
    price: '44.00',
    category: 'Fruit',
    imageUrl:
      'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&h=300&fit=crop',
  },
  {
    name: 'Lemon Blueberry Cake',
    description:
      'Tangy lemon cake studded with fresh blueberries and lemon frosting. Bright and zesty.',
    price: '47.00',
    category: 'Fruit',
    imageUrl:
      'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&h=300&fit=crop',
  },
  {
    name: 'Tiramisu Layer Cake',
    description:
      'Coffee-soaked ladyfingers with mascarpone cream and cocoa dusting. Italian classic.',
    price: '52.00',
    category: 'Specialty',
    imageUrl:
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=300&fit=crop',
  },
  {
    name: 'Black Forest Cake',
    description:
      'Chocolate cake with cherry filling and whipped cream. A German tradition.',
    price: '50.00',
    category: 'Chocolate',
    imageUrl:
      'https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=400&h=300&fit=crop',
  },
  {
    name: 'Coconut Dream Cake',
    description:
      'Coconut cake with coconut frosting and toasted coconut flakes. Tropical paradise.',
    price: '45.00',
    category: 'Specialty',
    imageUrl:
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
  },
  {
    name: 'Marble Cake',
    description:
      'Swirled chocolate and vanilla cake with vanilla buttercream. Best of both worlds.',
    price: '43.00',
    category: 'Marble',
    imageUrl:
      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=400&h=300&fit=crop',
  },
];

// Sample review data
const sampleReviews = [
  {
    name: 'Sarah Johnson',
    rating: 5,
    date: new Date('2024-01-15'),
    comment:
      'Absolutely delicious! The chocolate cake was moist and the frosting was perfect. Will definitely order again.',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Mike Chen',
    rating: 5,
    date: new Date('2024-01-20'),
    comment:
      'The vanilla bean cake was amazing. Fresh, flavorful, and beautifully decorated. Great service too!',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Emily Davis',
    rating: 4,
    date: new Date('2024-01-25'),
    comment:
      'Red velvet was excellent, though I would have liked a bit more cream cheese frosting. Still fantastic!',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'David Wilson',
    rating: 5,
    date: new Date('2024-02-01'),
    comment:
      'Carrot cake with walnuts and raisins was outstanding. The spices were perfectly balanced.',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Lisa Brown',
    rating: 5,
    date: new Date('2024-02-05'),
    comment:
      'Strawberry shortcake was fresh and delightful. The berries were perfectly ripe and the cream was light.',
    avatar:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'James Taylor',
    rating: 4,
    date: new Date('2024-02-10'),
    comment:
      'Lemon blueberry cake was zesty and refreshing. Blueberries were plump and juicy. Great texture!',
    avatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Anna Martinez',
    rating: 5,
    date: new Date('2024-02-15'),
    comment:
      'Tiramisu cake was authentic and delicious. The coffee flavor was perfect, not too strong.',
    avatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Robert Lee',
    rating: 5,
    date: new Date('2024-02-20'),
    comment:
      'Black Forest cake exceeded expectations. Rich chocolate with just the right amount of cherry.',
    avatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Maria Garcia',
    rating: 4,
    date: new Date('2024-02-25'),
    comment:
      'Coconut dream cake was tropical and delicious. The toasted coconut added great texture.',
    avatar:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Thomas Anderson',
    rating: 5,
    date: new Date('2024-03-01'),
    comment:
      'Marble cake was beautifully swirled and tasted amazing. Perfect balance of chocolate and vanilla.',
    avatar:
      'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Jennifer White',
    rating: 4,
    date: new Date('2024-03-05'),
    comment:
      'Another chocolate cake order - never disappoints! Always fresh and decadent.',
    avatar:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Kevin Rodriguez',
    rating: 5,
    date: new Date('2024-03-10'),
    comment:
      'The red velvet was moist and flavorful. Cream cheese frosting was creamy and not too sweet.',
    avatar:
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Amanda Thompson',
    rating: 5,
    date: new Date('2024-03-15'),
    comment:
      'Strawberry shortcake was perfect for spring. Fresh berries and light whipped cream.',
    avatar:
      'https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Christopher Jackson',
    rating: 4,
    date: new Date('2024-03-20'),
    comment:
      'Lemon blueberry was tart and sweet. Great balance of flavors. Would recommend!',
    avatar:
      'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face',
  },
  {
    name: 'Rachel Harris',
    rating: 5,
    date: new Date('2024-03-25'),
    comment:
      'Tiramisu was authentic Italian. The mascarpone cream was silky and coffee flavor was spot on.',
    avatar:
      'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=100&h=100&fit=crop&crop=face',
  },
];

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Insert cakes
    console.log('📝 Inserting cakes...');
    const insertedCakes = await db
      .insert(cakes)
      .values(sampleCakes)
      .returning({ id: cakes.id });

    console.log(`✅ Inserted ${insertedCakes.length} cakes`);

    // Insert reviews
    console.log('📝 Inserting reviews...');
    const insertedReviews = await db
      .insert(reviews)
      .values(sampleReviews)
      .returning({ id: reviews.id });

    console.log(`✅ Inserted ${insertedReviews.length} reviews`);
    console.log('🎉 Database seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seeder
seed().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});

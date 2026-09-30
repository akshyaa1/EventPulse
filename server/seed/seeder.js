const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Event = require('../models/Event');
const Registration = require('../models/Registration');

dotenv.config({ path: __dirname + '/../.env' });

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/eventpulse';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany();
    await Event.deleteMany();
    await Registration.deleteMany();
    console.log('Cleared existing database records.');

    // Create Users
    const organizer = await User.create({
      name: 'Sarah Jenkins',
      email: 'organizer@eventpulse.com',
      password: 'password123',
      role: 'organizer',
      organization: 'TechLead Global Events',
      bio: 'Professional event producer specializing in technology, design, and industry summits.'
    });

    const attendee = await User.create({
      name: 'Alex Rivera',
      email: 'attendee@eventpulse.com',
      password: 'password123',
      role: 'attendee',
      organization: 'Digital Creations',
      bio: 'Software developer and tech enthusiast passionate about open source and community.'
    });

    console.log('Created Demo Users:');
    console.log('  Organizer: organizer@eventpulse.com / password123');
    console.log('  Attendee:  attendee@eventpulse.com / password123');

    // Create Events
    const eventsData = [
      {
        title: 'Global AI & Cloud Summit 2026',
        description: 'Join industry titans, researchers, and innovators discussing the next decade of foundation models, distributed inference, agentic workflows, and cloud hyperscalers. Keynotes, panel discussions, and deep technical tracks included.',
        category: 'Tech',
        date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        time: '09:00 AM - 05:30 PM',
        locationType: 'venue',
        location: 'Grand Convention Center, Hall B, San Francisco, CA',
        capacity: 250,
        registeredCount: 1,
        price: 99,
        imageUrl: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
        organizer: organizer._id,
        tags: ['AI', 'Cloud', 'Machine Learning', 'Conference']
      },
      {
        title: 'Full-Stack JavaScript & React Hackathon',
        description: '48 hours of intense coding, collaboration, and prototyping! Build groundbreaking web apps using React, Node.js, and modern APIs. Mentors on-site, free meals, high-speed fiber internet, and $10,000 in prizes.',
        category: 'Tech',
        date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        time: '10:00 AM Start',
        locationType: 'venue',
        location: 'Innovation Hub, Floor 4, Seattle, WA',
        capacity: 120,
        registeredCount: 0,
        price: 0, // Free event
        imageUrl: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
        organizer: organizer._id,
        tags: ['React', 'JavaScript', 'Hackathon', 'Coding']
      },
      {
        title: 'Neon Horizon Indie Music & Arts Festival',
        description: 'An electrifying outdoor evening featuring top indie bands, electronic visualizers, interactive light installations, and artisan food trucks. An unforgettable immersive experience under the night sky.',
        category: 'Music',
        date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        time: '04:00 PM - 11:30 PM',
        locationType: 'venue',
        location: 'Sunset Waterfront Amphitheater, Austin, TX',
        capacity: 500,
        registeredCount: 0,
        price: 45,
        imageUrl: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
        organizer: organizer._id,
        tags: ['Music', 'Indie', 'Live Concert', 'Festival']
      },
      {
        title: 'NextGen Startup Pitch & Angel Investor Night',
        description: 'Top 10 pre-seed and seed stage startups pitch live in front of a panel of prominent VCs and angel investors. Features networking cocktail hour and deal-flow roundtable.',
        category: 'Business',
        date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        time: '06:00 PM - 09:30 PM',
        locationType: 'venue',
        location: 'Venture Space Downtown, New York, NY',
        capacity: 150,
        registeredCount: 0,
        price: 25,
        imageUrl: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?auto=format&fit=crop&w=1200&q=80',
        organizer: organizer._id,
        tags: ['Startup', 'Pitch', 'Venture Capital', 'Networking']
      },
      {
        title: 'Design Systems & Figma Component Architecture Masterclass',
        description: 'Comprehensive virtual masterclass for UI/UX engineers and product designers. Learn tokens, variant architecture, auto-layout paradigms, and seamless handoff to modern React code.',
        category: 'Design',
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        time: '02:00 PM - 05:00 PM EST',
        locationType: 'online',
        location: 'https://zoom.us/j/eventpulse-design-masterclass',
        capacity: 300,
        registeredCount: 0,
        price: 35,
        imageUrl: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=1200&q=80',
        organizer: organizer._id,
        tags: ['Figma', 'UI/UX', 'Design Systems', 'Web Design']
      },
      {
        title: 'Cloud Native Microservices & Docker Deep Dive',
        description: 'Hands-on practical workshop covering containerization, Docker multi-stage builds, service orchestration, API gateway routing, and resilient distributed architecture.',
        category: 'Workshops',
        date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        time: '11:00 AM - 04:00 PM',
        locationType: 'online',
        location: 'https://meet.google.com/eventpulse-docker-workshop',
        capacity: 80,
        registeredCount: 0,
        price: 0,
        imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
        organizer: organizer._id,
        tags: ['Docker', 'Microservices', 'Node.js', 'DevOps']
      }
    ];

    const createdEvents = await Event.insertMany(eventsData);
    console.log(`Created ${createdEvents.length} sample events.`);

    // Create a demo registration for attendee on the first event
    const demoRegistration = await Registration.create({
      user: attendee._id,
      event: createdEvents[0]._id,
      ticketsCount: 1,
      totalAmount: createdEvents[0].price,
      attendeeName: attendee.name,
      attendeeEmail: attendee.email,
      attendeePhone: '+1 (555) 234-5678',
      status: 'confirmed',
      ticketCode: 'EP-SUMMIT-01'
    });

    console.log('Created sample registration for Alex Rivera on "Global AI & Cloud Summit 2026".');
    console.log('Database seeding completed successfully! ✨');
    process.exit(0);
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  }
};

seedData();

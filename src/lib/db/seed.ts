import { db } from './index';
import { users, prayerRequests, events, announcements, eventRegistrations } from './schema';
import { hash } from 'bcryptjs';

async function clearDatabase() {
  console.log('🗑️ Clearing existing data...');

  try {
    // Delete in reverse order of dependencies
    await db.delete(eventRegistrations);
    await db.delete(announcements);
    await db.delete(events);
    await db.delete(prayerRequests);
    await db.delete(users);

    console.log('✅ Database cleared successfully!');
  } catch (error) {
    console.log('ℹ️ Database might be empty or tables don\'t exist yet');
  }
}

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Clear existing data first
    await clearDatabase();

    // Create admin and member users
    console.log('👥 Creating users...');
    const hashedAdminPassword = await hash('admin123', 10);
    const hashedPastorPassword = await hash('pastor123', 10);
    const hashedMemberPassword = await hash('member123', 10);
    const hashedDemoPassword = await hash('demo123', 10);

    console.log('🔐 Creating SUPER ADMIN accounts:');
    console.log('   📧 Email: admin@tpwbm.org | Password: admin123 | Role: super_admin');
    console.log('🔐 Creating ADMIN accounts:');
    console.log('   📧 Email: pastor@tpwbm.org | Password: pastor123');
    console.log('👤 Creating MEMBER accounts:');
    console.log('   📧 Email: member@tpwbm.org | Password: member123');

    const [admin, pastor, member] = await db.insert(users).values([
      {
        email: 'admin@tpwbm.org',
        name: 'System Administrator',
        hashedPassword: hashedAdminPassword,
        role: 'super_admin',
        emailVerified: new Date(),
        isActive: true,
        membershipDate: new Date('2020-01-01'),
        phone: '(555) 000-0001',
        address: 'Church Administrative Office',
      },
      {
        email: 'pastor@tpwbm.org',
        name: 'Praise Olufemi',
        hashedPassword: hashedPastorPassword,
        role: 'admin',
        ministryRole: 'pastor',
        ministryLevel: 'senior_leadership',
        ministryStartDate: new Date('2020-01-01'),
        ministryDescription: 'Senior Pastor and spiritual leader of TPWBM',
        emailVerified: new Date(),
        isActive: true,
        membershipDate: new Date('2020-01-01'),
        phone: '(555) 000-0002',
        address: 'Church Pastor Office',
      },
      {
        email: 'member@tpwbm.org',
        name: 'Church Member',
        hashedPassword: hashedMemberPassword,
        role: 'member',
        emailVerified: new Date(),
        isActive: true,
        membershipDate: new Date('2022-01-01'),
        phone: '(555) 000-0003',
        address: '123 Member Street, City, State 12345',
      },
    ]).returning();

    // Add additional demo users for prayer requests
    const demoUsers = await db.insert(users).values([
      {
        email: 'mary@example.com',
        name: 'Mary Johnson',
        hashedPassword: hashedDemoPassword,
        role: 'member',
        emailVerified: new Date(),
        isActive: true,
        membershipDate: new Date('2021-03-15'),
        phone: '(555) 123-4567',
      },
      {
        email: 'anonymous@example.com',
        name: 'Anonymous User',
        hashedPassword: hashedDemoPassword,
        role: 'member',
        emailVerified: new Date(),
        isActive: true,
        membershipDate: new Date('2023-01-01'),
      },
      {
        email: 'david@example.com',
        name: 'David Wilson',
        hashedPassword: hashedDemoPassword,
        role: 'member',
        emailVerified: new Date(),
        isActive: true,
        membershipDate: new Date('2022-06-01'),
        phone: '(555) 987-6543',
      },
      {
        email: 'sarah@example.com',
        name: 'Sarah and Mike Chen',
        hashedPassword: hashedDemoPassword,
        role: 'member',
        emailVerified: new Date(),
        isActive: true,
        membershipDate: new Date('2021-09-01'),
        phone: '(555) 456-7890',
      },
      {
        email: 'ministry@example.com',
        name: 'Ministry Seeker',
        hashedPassword: hashedDemoPassword,
        role: 'member',
        emailVerified: new Date(),
        isActive: true,
        membershipDate: new Date('2023-03-01'),
      },
    ]).returning();

    // Create prayer requests
    console.log('🙏 Creating prayer requests...');
    const insertedPrayerRequests = await db.insert(prayerRequests).values([
      {
        title: 'Church Growth and Ministry',
        description: 'Please pray for our church to grow in numbers and spiritual maturity. We seek God\'s guidance for effective outreach and discipleship.',
        category: 'ministry',
        priority: 'high',
        requestedBy: admin.name || 'Admin',
        requestedById: admin.id,
        requestedByEmail: admin.email,
        isAnonymous: false,
        status: 'active',
        isPublic: true,
        tags: ['growth', 'ministry', 'outreach'],
        prayerCount: 5,
      },
      {
        title: 'Wisdom in Ministry Leadership',
        description: 'Seeking prayers for divine wisdom and guidance in leading God\'s people. Pray for anointing and clarity in decision-making.',
        category: 'ministry',
        priority: 'high',
        requestedBy: pastor.name || 'Pastor',
        requestedById: pastor.id,
        requestedByEmail: pastor.email,
        isAnonymous: false,
        status: 'active',
        isPublic: true,
        tags: ['leadership', 'wisdom', 'ministry'],
        prayerCount: 12,
      },
      {
        title: 'Healing and Restoration',
        description: 'Please pray for healing of body, mind, and spirit. Trust God for complete restoration and renewed strength.',
        category: 'health',
        priority: 'urgent',
        requestedBy: demoUsers[0].name || 'Church Member',
        requestedById: demoUsers[0].id,
        requestedByEmail: demoUsers[0].email,
        isAnonymous: false,
        status: 'active',
        isPublic: true,
        tags: ['healing', 'restoration', 'health'],
        prayerCount: 18,
      },
      {
        title: 'Family Unity and Peace',
        description: 'Praying for restored relationships, understanding, and peace in our household. God\'s love to reign in our home.',
        category: 'family',
        priority: 'normal',
        requestedBy: 'Anonymous',
        requestedById: demoUsers[1].id,
        requestedByEmail: '',
        isAnonymous: true,
        status: 'active',
        isPublic: true,
        tags: ['family', 'unity', 'peace'],
        prayerCount: 8,
      },
      {
        title: 'Career and Financial Breakthrough',
        description: 'Seeking God\'s favor in career advancement and financial stability. Trust Him for open doors and new opportunities.',
        category: 'work',
        priority: 'normal',
        requestedBy: demoUsers[2].name || 'Church Member',
        requestedById: demoUsers[2].id,
        requestedByEmail: demoUsers[2].email,
        isAnonymous: false,
        status: 'active',
        isPublic: true,
        tags: ['career', 'financial', 'breakthrough'],
        prayerCount: 6,
      },
      {
        title: 'Salvation for Loved Ones',
        description: 'Praying for family members and friends to come to know Jesus Christ as their personal Lord and Savior.',
        category: 'salvation',
        priority: 'high',
        requestedBy: demoUsers[3].name || 'Church Member',
        requestedById: demoUsers[3].id,
        requestedByEmail: demoUsers[3].email,
        isAnonymous: false,
        status: 'active',
        isPublic: true,
        tags: ['salvation', 'evangelism', 'family'],
        prayerCount: 15,
      },
      {
        title: 'Direction in Ministry Calling',
        description: 'Seeking clear direction and confirmation of God\'s calling in ministry. Pray for open doors and divine connections.',
        category: 'spiritual',
        priority: 'normal',
        requestedBy: demoUsers[4].name || 'Church Member',
        requestedById: demoUsers[4].id,
        requestedByEmail: demoUsers[4].email,
        isAnonymous: false,
        status: 'pending',
        isPublic: true,
        tags: ['ministry', 'calling', 'direction'],
        prayerCount: 3,
      },
      {
        title: 'Community Outreach Success',
        description: 'Prayers for our upcoming community outreach events. May God use us to bless our neighborhood and share His love.',
        category: 'community',
        priority: 'normal',
        requestedBy: member.name || 'Church Member',
        requestedById: member.id,
        requestedByEmail: member.email,
        isAnonymous: false,
        status: 'active',
        isPublic: true,
        tags: ['outreach', 'community', 'evangelism'],
        prayerCount: 9,
      },
    ]).returning();

    // Create events
    console.log('📅 Creating events...');
    const insertedEvents = await db.insert(events).values([
      {
        title: 'Sunday Worship Service',
        description: 'Join us for our weekly worship service filled with praise, worship, and the Word of God. Come and experience God\'s presence with us!',
        category: 'worship',
        startDate: new Date('2025-06-29T10:00:00Z'),
        endDate: new Date('2025-06-29T12:00:00Z'),
        location: 'Main Sanctuary',
        address: 'The Prevailing Word Believers Ministry, Church Address',
        organizer: pastor.name || 'Pastor',
        organizerId: pastor.id,
        capacity: 200,
        registeredCount: 0,
        requiresRegistration: false,
        isRecurring: true,
        recurringPattern: 'weekly',
        recurringDays: ['sunday'],
        status: 'published',
        contactEmail: 'info@tpwbm.org',
        tags: ['worship', 'service', 'weekly'],
        price: '0.00',
      },
      {
        title: 'Youth Conference 2025',
        description: 'A transformative conference for young believers aged 13-25. Join us for powerful sessions, worship, and fellowship designed to strengthen your faith and purpose.',
        category: 'youth',
        startDate: new Date('2025-07-15T09:00:00Z'),
        endDate: new Date('2025-07-15T17:00:00Z'),
        location: 'Conference Hall',
        address: 'The Prevailing Word Believers Ministry, Church Address',
        organizer: 'Youth Ministry Team',
        organizerId: admin.id,
        capacity: 100,
        registeredCount: 45,
        requiresRegistration: true,
        isRecurring: false,
        status: 'published',
        contactEmail: 'youth@tpwbm.org',
        tags: ['youth', 'conference', 'special'],
        price: '0.00',
        registrationDeadline: new Date('2025-07-14T23:59:59Z'),
      },
      {
        title: 'Prayer & Fasting Week',
        description: 'Join us for a week of intensive prayer and fasting for breakthrough, spiritual growth, and seeking God\'s will for our lives and ministry.',
        category: 'fellowship',
        startDate: new Date('2025-07-20T06:00:00Z'),
        endDate: new Date('2025-07-27T18:00:00Z'),
        location: 'Prayer Hall',
        address: 'The Prevailing Word Believers Ministry, Church Address',
        organizer: 'Prayer Ministry',
        organizerId: pastor.id,
        capacity: 0,
        registeredCount: 0,
        requiresRegistration: false,
        isRecurring: false,
        status: 'published',
        contactEmail: 'prayer@tpwbm.org',
        tags: ['prayer', 'fasting', 'spiritual'],
        price: '0.00',
      },
      {
        title: 'Bible Study Wednesday',
        description: 'Weekly Bible study focused on growing deeper in God\'s Word. Interactive sessions with practical application for daily Christian living.',
        category: 'ministry',
        startDate: new Date('2025-07-02T19:00:00Z'),
        endDate: new Date('2025-07-02T20:30:00Z'),
        location: 'Fellowship Hall',
        address: 'The Prevailing Word Believers Ministry, Church Address',
        organizer: pastor.name || 'Pastor',
        organizerId: pastor.id,
        capacity: 50,
        registeredCount: 25,
        requiresRegistration: false,
        isRecurring: true,
        recurringPattern: 'weekly',
        recurringDays: ['wednesday'],
        status: 'published',
        contactEmail: 'biblestudy@tpwbm.org',
        tags: ['bible-study', 'education', 'weekly'],
        price: '0.00',
      },
      {
        title: 'Community Outreach Program',
        description: 'Monthly community service initiative to bless our neighborhood. Join us in showing God\'s love through practical service.',
        category: 'outreach',
        startDate: new Date('2025-07-12T09:00:00Z'),
        endDate: new Date('2025-07-12T15:00:00Z'),
        location: 'Community Center',
        address: 'Local Community Center, Neighborhood Area',
        organizer: member.name || 'Church Member',
        organizerId: member.id,
        capacity: 30,
        registeredCount: 18,
        requiresRegistration: true,
        isRecurring: true,
        recurringPattern: 'monthly',
        status: 'published',
        contactEmail: 'outreach@tpwbm.org',
        tags: ['outreach', 'community', 'service'],
        price: '0.00',
      },
    ]).returning();

    // Create announcements
    console.log('📢 Creating announcements...');
    const insertedAnnouncements = await db.insert(announcements).values([
      {
        title: 'Welcome to The Prevailing Word Believers Ministry!',
        content: 'We are excited to welcome you to our church family! Whether you\'re visiting for the first time or joining our community, we\'re here to support you on your spiritual journey. Join us for Sunday service at 10:00 AM and discover God\'s amazing love.',
        category: 'general',
        priority: 'high',
        author: pastor.name || 'Pastor',
        authorId: pastor.id,
        status: 'published',
        expiresAt: new Date('2025-12-31T23:59:59Z'),
      },
      {
        title: 'Youth Conference 2025 Registration Open',
        content: 'Calling all young believers aged 13-25! Registration is now open for our Youth Conference 2025 on July 15th. Experience powerful worship, inspiring messages, and connect with other young believers. Register today - limited spaces available!',
        category: 'event',
        priority: 'high',
        author: 'Youth Ministry Team',
        authorId: admin.id,
        status: 'published',
        expiresAt: new Date('2025-07-15T00:00:00Z'),
      },
      {
        title: 'Prayer Request Submission Guidelines',
        content: 'We encourage you to submit your prayer requests through our website or prayer request forms. Our prayer team commits to praying for each request. You can choose to submit anonymously or publicly. All requests are treated with confidentiality and love.',
        category: 'ministry',
        priority: 'normal',
        author: pastor.name || 'Pastor',
        authorId: pastor.id,
        status: 'published',
        expiresAt: new Date('2025-12-31T23:59:59Z'),
      },
      {
        title: 'Community Outreach - July 12th',
        content: 'Join us for our monthly community service on July 12th from 9:00 AM to 3:00 PM. We\'ll be serving at the local community center, providing meals and support to families in need. Come and be the hands and feet of Jesus!',
        category: 'outreach',
        priority: 'normal',
        author: member.name || 'Church Member',
        authorId: member.id,
        status: 'published',
        expiresAt: new Date('2025-07-13T00:00:00Z'),
      },
      {
        title: 'Wednesday Bible Study - Growing in Faith',
        content: 'Join us every Wednesday at 7:00 PM for our Bible study series "Growing in Faith." We\'re exploring practical ways to strengthen our relationship with God and apply biblical principles in daily life. All are welcome!',
        category: 'schedule',
        priority: 'normal',
        author: pastor.name || 'Pastor',
        authorId: pastor.id,
        status: 'published',
        expiresAt: new Date('2025-12-31T23:59:59Z'),
      },
      {
        title: 'Prayer & Fasting Week - July 20-27',
        content: 'Mark your calendars for our special Prayer & Fasting Week from July 20-27. Join us for daily prayer meetings at 6:00 AM and 6:00 PM. This is a time to seek God\'s face for breakthrough and spiritual renewal. Prayer guides will be available.',
        category: 'ministry',
        priority: 'high',
        author: pastor.name || 'Pastor',
        authorId: pastor.id,
        status: 'published',
        expiresAt: new Date('2025-07-28T00:00:00Z'),
      },
    ]).returning();

    console.log('✅ Database seeded successfully!');
    console.log('');
    console.log('🎉 SETUP COMPLETE! Use these credentials to log in:');
    console.log('');
    console.log('🔧 ADMIN ACCESS:');
    console.log('   👤 admin@tpwbm.org / admin123');
    console.log('   👤 pastor@tpwbm.org / pastor123');
    console.log('');
    console.log('👥 MEMBER ACCESS:');
    console.log('   👤 member@tpwbm.org / member123');
    console.log('');
    console.log('📊 DATA CREATED:');
    console.log(`   👥 ${insertedPrayerRequests.length} Prayer Requests`);
    console.log(`   📅 ${insertedEvents.length} Events`);
    console.log(`   📢 ${insertedAnnouncements.length} Announcements`);
    console.log('');
    console.log('💡 To create more admins: Use the Admin Panel > User Management');
    console.log('📝 Login at: /members/login');
  } catch (error) {
    console.log('❌ Error seeding database:', error);
  }
}

// Export the seed function
export default seed;

// Run if called directly
if (require.main === module) {
  seed().then(() => {
    console.log('Seeding completed!');
    process.exit(0);
  });
}

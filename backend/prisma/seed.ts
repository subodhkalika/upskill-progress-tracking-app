import { PrismaClient, TaskPriority, ResourceStatus, ResourceType, SubscriptionPlan, TaskStatus, MilestoneStatus, RoadmapStatus } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

async function main() {
  // 1. Delete data in the right order to avoid FK constraint issues
  await prisma.achievement.deleteMany();
  await prisma.timeLog.deleteMany();
  await prisma.resource.deleteMany();
  await prisma.task.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.roadmap.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.learningStats.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Old data deleted.');

  // Create User
  const passwordHash = await hashPassword('password123');
  const user = await prisma.user.create({
    data: {
      email: 'subodh@example.com',
      passwordHash,
      name: 'Subodh K.',
      profilePicture: 'https://example.com/profile.jpg',
      subscription: SubscriptionPlan.FREE,
      learningStats: {
        create: {
          totalHours: 100,
          weeklyGoal: 10,
          currentWeekHours: 5,
          dayStreak: 5,
          bestStreak: 10,
        },
      },
    },
  });

  // Create Skills
  const [backendDevSkill, nodeJsSkill, dockerSkill, systemDesignSkill] =
    await Promise.all([
      prisma.skill.create({ data: { name: 'Backend Development' } }),
      prisma.skill.create({ data: { name: 'Node.js' } }),
      prisma.skill.create({ data: { name: 'Docker' } }),
      prisma.skill.create({ data: { name: 'System Design' } }),
    ]);

  // Create Tags
  const [beginnerTag, advancedTag] = await Promise.all([
    prisma.tag.create({ data: { name: 'Beginner' } }),
    prisma.tag.create({ data: { name: 'Advanced' } }),
  ]);

  // Create Roadmap
  const roadmap = await prisma.roadmap.create({
    data: {
      title: 'Backend Development Mastery',
      description: 'Learn backend development using Node.js and related technologies.',
      status: RoadmapStatus.ACTIVE,
      userId: user.id,
      skills: {
        connect: [
          { id: backendDevSkill.id },
          { id: nodeJsSkill.id },
          { id: systemDesignSkill.id },
        ],
      },
      tags: { connect: [{ id: beginnerTag.id }] },
    },
  });

  // Create Milestones
  await prisma.milestone.createMany({
    data: [
      {
        title: 'Learn Node.js Basics',
        description: 'Understand Node.js fundamentals and how to work with Express.',
        status: MilestoneStatus.COMPLETED,
        completed: true,
        roadmapId: roadmap.id,
      },
      {
        title: 'Docker for Developers',
        description: 'Learn how to containerize applications using Docker.',
        status: MilestoneStatus.ACTIVE,
        completed: false,
        roadmapId: roadmap.id,
      },
      {
        title: 'System Design Fundamentals',
        description: 'Master the principles of system design.',
        status: MilestoneStatus.PLANNED,
        completed: false,
        roadmapId: roadmap.id,
      },
    ],
  });

  const fullRoadmap = await prisma.roadmap.findUnique({
    where: { id: roadmap.id },
    include: { milestones: true },
  });

  if (!fullRoadmap) throw new Error('Could not find roadmap after creation');

  // Create Resources
  const [resource1, resource2] = await Promise.all([
    prisma.resource.create({
      data: {
        userId: user.id,
        title: 'Node.js Complete Guide',
        description: 'Comprehensive course on Node.js from basics to advanced topics.',
        type: ResourceType.BOOK,
        status: ResourceStatus.COMPLETED,
        duration: 20,
        skills: { connect: [{ id: nodeJsSkill.id }] },
        tags: { connect: [{ id: beginnerTag.id }] },
      },
    }),
    prisma.resource.create({
      data: {
        userId: user.id,
        title: 'Docker Fundamentals Video',
        description: 'A video series that explains the basics of Docker and containers.',
        type: ResourceType.VIDEO,
        status: ResourceStatus.NOT_STARTED,
        duration: 4,
        skills: { connect: [{ id: dockerSkill.id }] },
        tags: { connect: [{ id: advancedTag.id }] },
      },
    }),
  ]);

  // Create Tasks
  const [task1, task2, task3] = await Promise.all([
    prisma.task.create({
      data: {
        userId: user.id,
        name: 'Complete Node.js Basics module',
        description: 'Complete the first module of the Node.js course.',
        priority: TaskPriority.HIGH,
        milestoneId: fullRoadmap.milestones[0].id,
        estimatedTime: 5,
        progress: 80,
        status: TaskStatus.IN_PROGRESS,
        resources: { connect: [{ id: resource1.id }] },
        skills: { connect: [{ id: nodeJsSkill.id }] },
        tags: { connect: [{ id: beginnerTag.id }] },
      },
    }),
    prisma.task.create({
      data: {
        userId: user.id,
        name: 'Watch Docker Fundamentals Video',
        description: 'Go through chapters 1-3 of the Docker Fundamentals video.',
        priority: TaskPriority.MEDIUM,
        milestoneId: fullRoadmap.milestones[1].id,
        estimatedTime: 3,
        progress: 0,
        status: TaskStatus.PENDING,
        resources: { connect: [{ id: resource2.id }] },
        skills: { connect: [{ id: dockerSkill.id }] },
      },
    }),
    prisma.task.create({
      data: {
        userId: user.id,
        name: 'Complete System Design module',
        description: 'Learn about system design principles and practice.',
        priority: TaskPriority.LOW,
        milestoneId: fullRoadmap.milestones[2].id,
        estimatedTime: 8,
        progress: 40,
        status: TaskStatus.IN_PROGRESS,
        skills: { connect: [{ id: systemDesignSkill.id }] },
        tags: { connect: [{ id: advancedTag.id }] },
      },
    }),
  ]);

  // Create Time Logs
  await prisma.timeLog.createMany({
    data: [
      {
        taskId: task1.id,
        duration: 2,
        note: 'Completed the first part of the Node.js Basics module.',
      },
      {
        taskId: task2.id,
        duration: 1.5,
        note: 'Watched Docker video chapters 1-2.',
      },
    ],
  });

  // Create Achievements
  await prisma.achievement.createMany({
    data: [
      {
        userId: user.id,
        title: 'Node.js Master',
        description: 'Completed the Node.js Basics milestone.',
        icon: '🚀',
      },
      {
        userId: user.id,
        title: 'Docker Explorer',
        description: 'Started Docker Fundamentals module.',
        icon: '🐳',
      },
    ],
  });

  console.log('✅ Seeding done!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
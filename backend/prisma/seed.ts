import { PrismaClient, TaskPriority, ResourceStatus, ResourceType, SubscriptionPlan, TaskStatus, MilestoneStatus, RoadmapStatus } from '@prisma/client';
import { hashPassword } from '../src/utils/password';

const prisma = new PrismaClient();

// helper to make unique values
const unique = (base: string) => {
  const uniqueValue = `${base}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  console.log('unique value : ', uniqueValue);
  return uniqueValue;
};

async function main() {
  // Create User with unique email
  const passwordHash = await hashPassword('password123');
  const user = await prisma.user.create({
    data: {
      email: `${unique('subodh')}@example.com`,
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

  // Create Skills with unique names
  const [backendDevSkill, nodeJsSkill, dockerSkill, systemDesignSkill] =
    await Promise.all([
      prisma.skill.create({ data: { name: unique('Backend Development') } }),
      prisma.skill.create({ data: { name: unique('Node.js') } }),
      prisma.skill.create({ data: { name: unique('Docker') } }),
      prisma.skill.create({ data: { name: unique('System Design') } }),
    ]);

  // Create Tags with unique names
  const [beginnerTag, advancedTag] = await Promise.all([
    prisma.tag.create({ data: { name: unique('Beginner') } }),
    prisma.tag.create({ data: { name: unique('Advanced') } }),
  ]);

  // Create Roadmap
  const roadmap = await prisma.roadmap.create({
    data: {
      title: unique('Backend Development Mastery'),
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
        title: unique('Learn Node.js Basics'),
        description: 'Understand Node.js fundamentals and how to work with Express.',
        status: MilestoneStatus.COMPLETED,
        completed: true,
        roadmapId: roadmap.id,
      },
      {
        title: unique('Docker for Developers'),
        description: 'Learn how to containerize applications using Docker.',
        status: MilestoneStatus.ACTIVE,
        completed: false,
        roadmapId: roadmap.id,
      },
      {
        title: unique('System Design Fundamentals'),
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
        title: unique('Node.js Complete Guide'),
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
        title: unique('Docker Fundamentals Video'),
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
        name: unique('Complete Node.js Basics module'),
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
        name: unique('Watch Docker Fundamentals Video'),
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
        name: unique('Complete System Design module'),
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
        title: unique('Node.js Master'),
        description: 'Completed the Node.js Basics milestone.',
        icon: '🚀',
      },
      {
        userId: user.id,
        title: unique('Docker Explorer'),
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
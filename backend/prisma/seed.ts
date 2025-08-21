import { PrismaClient, TaskPriority, ResourceStatus, ResourceType, SubscriptionPlan } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create User
  const user = await prisma.user.create({
    data: {
      email: 'john.doe@example.com',
      name: 'John Doe',
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
  })

  // Create Skills
  const backendDevSkill = await prisma.skill.create({
    data: { name: 'Backend Development' },
  })
  const nodeJsSkill = await prisma.skill.create({
    data: { name: 'Node.js' },
  })
  const dockerSkill = await prisma.skill.create({
    data: { name: 'Docker' },
  })
  const systemDesignSkill = await prisma.skill.create({
    data: { name: 'System Design' },
  })

  // Create Roadmap
  const roadmap = await prisma.roadmap.create({
    data: {
      title: 'Backend Development Mastery',
      description: 'Learn backend development using Node.js and related technologies.',
      status: 'active',
      userId: user.id,
      skills: {
        connect: [{ id: backendDevSkill.id }, { id: nodeJsSkill.id }, { id: systemDesignSkill.id }],
      },
    },
  })

  // Create Milestones after Roadmap is created
  const milestones = await prisma.milestone.createMany({
    data: [
      {
        title: 'Learn Node.js Basics',
        description: 'Understand Node.js fundamentals and how to work with Express.',
        completed: true,
        roadmapId: roadmap.id, // Linking to the roadmap
      },
      {
        title: 'Docker for Developers',
        description: 'Learn how to containerize applications using Docker.',
        completed: false,
        roadmapId: roadmap.id, // Linking to the roadmap
      },
      {
        title: 'System Design Fundamentals',
        description: 'Master the principles of system design.',
        completed: false,
        roadmapId: roadmap.id, // Linking to the roadmap
      },
    ],
  })

  // Fetch the roadmap with milestones for reference in tasks
  const fullRoadmap = await prisma.roadmap.findUnique({
    where: { id: roadmap.id },
    include: { milestones: true },
  });

  if (!fullRoadmap) {
    console.error('Could not find the created roadmap.');
    process.exit(1);
  }

  // Create Resources
  const resource1 = await prisma.resource.create({
    data: {
      userId: user.id,
      title: 'Node.js Complete Guide',
      description: 'Comprehensive course on Node.js from basics to advanced topics.',
      type: ResourceType.BOOK,
      status: ResourceStatus.COMPLETED,
      duration: 20,
      skills: {
        connect: [{ id: nodeJsSkill.id }],
      },
    },
  })

  const resource2 = await prisma.resource.create({
    data: {
      userId: user.id,
      title: 'Docker Fundamentals Video',
      description: 'A video series that explains the basics of Docker and containers.',
      type: ResourceType.VIDEO,
      status: ResourceStatus.NOT_STARTED,
      duration: 4,
      skills: {
        connect: [{ id: dockerSkill.id }],
      },
    },
  })

  // Create Tasks
  const task1 = await prisma.task.create({
    data: {
      userId: user.id,
      name: 'Complete Node.js Basics module',
      description: 'Complete the first module of the Node.js course.',
      priority: TaskPriority.HIGH,
      milestoneId: fullRoadmap.milestones[0].id,
      estimatedTime: 5,
      progress: 80,
      resources: {
        connect: [{ id: resource1.id }],
      },
      skills: {
        connect: [{ id: nodeJsSkill.id }],
      },
    },
  })

  const task2 = await prisma.task.create({
    data: {
      userId: user.id,
      name: 'Watch Docker Fundamentals Video',
      description: 'Go through chapters 1-3 of the Docker Fundamentals video.',
      priority: TaskPriority.MEDIUM,
      milestoneId: fullRoadmap.milestones[1].id,
      estimatedTime: 3,
      progress: 0,
      resources: {
        connect: [{ id: resource2.id }],
      },
      skills: {
        connect: [{ id: dockerSkill.id }],
      },
    },
  })

  const task3 = await prisma.task.create({
    data: {
      userId: user.id,
      name: 'Complete System Design module',
      description: 'Learn about system design principles and practice.',
      priority: TaskPriority.LOW,
      milestoneId: fullRoadmap.milestones[2].id,
      estimatedTime: 8,
      progress: 40,
      skills: {
        connect: [{ id: systemDesignSkill.id }],
      },
    },
  })

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
  })

  // Create Achievement
  const achievement = await prisma.achievement.create({
    data: {
      userId: user.id,
      title: 'Node.js Master',
      description: 'Completed the Node.js Basics milestone.',
      icon: '🚀',
      earnedOn: new Date(),
    },
  })

  const achievement2 = await prisma.achievement.create({
    data: {
      userId: user.id,
      title: 'Docker Expert',
      description: 'Completed Docker Fundamentals module.',
      icon: '🔥',
      earnedOn: new Date(),
    },
  })

  console.log('Seeding done!')
}

main()
  .catch((e) => {
    console.error(e)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
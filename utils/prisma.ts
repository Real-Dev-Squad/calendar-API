import prisma from '../prisma/prisma';

async function checkDatabaseConnection(): Promise<void> {
  try {
    await prisma.$connect();
    logger.error('Database connected.');
  } catch (error) {
    logger.error('Database connection failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

export default checkDatabaseConnection;

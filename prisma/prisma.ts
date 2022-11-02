import { PrismaClient } from '@prisma/client'

const mySqlUsername = config.get('providers.mySql.username')
const mySqlPassword = config.get('providers.mySql.password')
const mySqlHost = config.get('providers.mySql.host')
const mySqlName = config.get('providers.mySql.name')

const prisma: PrismaClient = new PrismaClient({
  datasources: {
    db: {
      url: `mysql://${mySqlUsername}:${mySqlPassword}@${mySqlHost}/${mySqlName}`
    }
  }
})

export default prisma

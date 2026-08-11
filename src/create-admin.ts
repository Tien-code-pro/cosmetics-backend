// import { PrismaClient } from '../generated/prisma/client';
// import { PrismaPg } from '@prisma/adapter-pg';
// import * as bcrypt from 'bcrypt';

// async function main() {
//   const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
//   const prisma = new PrismaClient({ adapter });
//   const hashedPassword = await bcrypt.hash('admin123', 10);
//   const user = await prisma.adminUser.create({
//     data: { email: 'admin@shop.com', password: hashedPassword, name: 'Admin' },
//   });
//   console.log('Đã tạo:', user.email);
// }
// main();
// tạo tài khoản admin lần đầu
// npx ts-node -r dotenv/config src/create-admin.ts

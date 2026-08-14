// import 'dotenv/config';
// import { PrismaClient } from './generated/prisma/client';
// import { PrismaPg } from '@prisma/adapter-pg';

// const adapter = new PrismaPg({
//   connectionString: process.env.DATABASE_URL!,
// });

// const prisma = new PrismaClient({
//   adapter,
// });

// // =========================================================
// // CONSTANTS
// // =========================================================

// const ORDER_STATUSES = [
//   'pending',
//   'confirmed',
//   'shipping',
//   'completed',
//   'cancelled',
// ] as const;

// const PAYMENT_METHODS = ['COD', 'VNPay', 'Momo'] as const;

// const PAYMENT_STATUSES = ['unpaid', 'paid'] as const;

// // =========================================================
// // HELPERS
// // =========================================================

// function randomItem<T>(items: T[]): T {
//   return items[Math.floor(Math.random() * items.length)];
// }

// function randomInt(min: number, max: number): number {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// }

// function randomDate(daysAgo: number): Date {
//   const date = new Date();

//   date.setDate(date.getDate() - randomInt(0, daysAgo));

//   date.setHours(randomInt(8, 21), randomInt(0, 59), randomInt(0, 59), 0);

//   return date;
// }

// // =========================================================
// // CUSTOMER DATA
// // =========================================================

// const customerNames = [
//   'Nguyễn Văn An',
//   'Trần Thị Bình',
//   'Lê Hoàng Nam',
//   'Phạm Minh Anh',
//   'Đỗ Quốc Huy',
//   'Vũ Thu Hà',
//   'Bùi Đức Long',
//   'Hoàng Ngọc Mai',
//   'Đặng Tuấn Kiệt',
//   'Phan Thùy Linh',
//   'Ngô Minh Quân',
//   'Dương Khánh Ly',
//   'Trịnh Gia Bảo',
//   'Mai Thanh Tùng',
//   'Cao Phương Anh',
//   'Lý Quốc Việt',
//   'Nguyễn Đức Anh',
//   'Trần Minh Khang',
//   'Lê Thu Trang',
//   'Phạm Quang Huy',
// ];

// const cities = ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Hải Phòng', 'Cần Thơ'];

// // =========================================================
// // CATEGORY DATA
// // =========================================================

// const categoryData = [
//   {
//     name: 'Chăm sóc da',
//     slug: 'cham-soc-da',
//   },
//   {
//     name: 'Sữa rửa mặt',
//     slug: 'sua-rua-mat',
//   },
//   {
//     name: 'Serum',
//     slug: 'serum',
//   },
//   {
//     name: 'Kem dưỡng',
//     slug: 'kem-duong',
//   },
//   {
//     name: 'Kem chống nắng',
//     slug: 'kem-chong-nang',
//   },
//   {
//     name: 'Tẩy trang',
//     slug: 'tay-trang',
//   },
//   {
//     name: 'Mặt nạ',
//     slug: 'mat-na',
//   },
//   {
//     name: 'Son môi',
//     slug: 'son-moi',
//   },
// ];

// // =========================================================
// // PRODUCT DATA
// // =========================================================

// const productData = [
//   {
//     name: 'Sữa rửa mặt CeraVe Foaming Cleanser',
//     slug: 'sua-rua-mat-cerave-foaming-cleanser',
//     sku: 'TEST-CERAVE-001',
//     price: 285000,
//     originalPrice: 320000,
//     category: 'sua-rua-mat',
//     brand: 'CeraVe',
//     origin: 'Mỹ',
//   },
//   {
//     name: 'Sữa rửa mặt La Roche-Posay Effaclar',
//     slug: 'sua-rua-mat-la-roche-posay-effaclar',
//     sku: 'TEST-LRP-001',
//     price: 365000,
//     originalPrice: 410000,
//     category: 'sua-rua-mat',
//     brand: 'La Roche-Posay',
//     origin: 'Pháp',
//   },
//   {
//     name: 'Nước tẩy trang Bioderma Sensibio',
//     slug: 'nuoc-tay-trang-bioderma-sensibio',
//     sku: 'TEST-BIODERMA-001',
//     price: 395000,
//     originalPrice: 450000,
//     category: 'tay-trang',
//     brand: 'Bioderma',
//     origin: 'Pháp',
//   },
//   {
//     name: "Nước tẩy trang L'Oreal Micellar",
//     slug: 'nuoc-tay-trang-loreal-micellar',
//     sku: 'TEST-LOREAL-001',
//     price: 185000,
//     originalPrice: 220000,
//     category: 'tay-trang',
//     brand: "L'Oreal",
//     origin: 'Pháp',
//   },
//   {
//     name: 'Serum The Ordinary Niacinamide 10% + Zinc 1%',
//     slug: 'serum-the-ordinary-niacinamide',
//     sku: 'TEST-TO-001',
//     price: 285000,
//     originalPrice: 330000,
//     category: 'serum',
//     brand: 'The Ordinary',
//     origin: 'Canada',
//   },
//   {
//     name: 'Serum La Roche-Posay Hyalu B5',
//     slug: 'serum-la-roche-posay-hyalu-b5',
//     sku: 'TEST-LRP-002',
//     price: 720000,
//     originalPrice: 790000,
//     category: 'serum',
//     brand: 'La Roche-Posay',
//     origin: 'Pháp',
//   },
//   {
//     name: 'Serum Vichy Mineral 89',
//     slug: 'serum-vichy-mineral-89',
//     sku: 'TEST-VICHY-001',
//     price: 680000,
//     originalPrice: 750000,
//     category: 'serum',
//     brand: 'Vichy',
//     origin: 'Pháp',
//   },
//   {
//     name: 'Kem dưỡng CeraVe Moisturizing Cream',
//     slug: 'kem-duong-cerave-moisturizing-cream',
//     sku: 'TEST-CERAVE-002',
//     price: 420000,
//     originalPrice: 480000,
//     category: 'kem-duong',
//     brand: 'CeraVe',
//     origin: 'Mỹ',
//   },
//   {
//     name: 'Kem dưỡng Neutrogena Hydro Boost',
//     slug: 'kem-duong-neutrogena-hydro-boost',
//     sku: 'TEST-NEUTROGENA-001',
//     price: 385000,
//     originalPrice: 430000,
//     category: 'kem-duong',
//     brand: 'Neutrogena',
//     origin: 'Mỹ',
//   },
//   {
//     name: 'Kem chống nắng La Roche-Posay Anthelios',
//     slug: 'kem-chong-nang-la-roche-posay-anthelios',
//     sku: 'TEST-LRP-003',
//     price: 495000,
//     originalPrice: 550000,
//     category: 'kem-chong-nang',
//     brand: 'La Roche-Posay',
//     origin: 'Pháp',
//   },
//   {
//     name: 'Kem chống nắng Anessa Perfect UV',
//     slug: 'kem-chong-nang-anessa-perfect-uv',
//     sku: 'TEST-ANESSA-001',
//     price: 650000,
//     originalPrice: 720000,
//     category: 'kem-chong-nang',
//     brand: 'Anessa',
//     origin: 'Nhật Bản',
//   },
//   {
//     name: 'Mặt nạ giấy Mediheal N.M.F',
//     slug: 'mat-na-giay-mediheal-nmf',
//     sku: 'TEST-MEDI-001',
//     price: 35000,
//     originalPrice: 45000,
//     category: 'mat-na',
//     brand: 'Mediheal',
//     origin: 'Hàn Quốc',
//   },
//   {
//     name: 'Mặt nạ đất sét Innisfree',
//     slug: 'mat-na-dat-set-innisfree',
//     sku: 'TEST-INNISFREE-001',
//     price: 290000,
//     originalPrice: 330000,
//     category: 'mat-na',
//     brand: 'Innisfree',
//     origin: 'Hàn Quốc',
//   },
//   {
//     name: 'Son MAC Powder Kiss',
//     slug: 'son-mac-powder-kiss',
//     sku: 'TEST-MAC-001',
//     price: 520000,
//     originalPrice: 590000,
//     category: 'son-moi',
//     brand: 'MAC',
//     origin: 'Mỹ',
//   },
//   {
//     name: 'Son 3CE Velvet Lip Tint',
//     slug: 'son-3ce-velvet-lip-tint',
//     sku: 'TEST-3CE-001',
//     price: 330000,
//     originalPrice: 390000,
//     category: 'son-moi',
//     brand: '3CE',
//     origin: 'Hàn Quốc',
//   },
// ];

// // =========================================================
// // MAIN
// // =========================================================

// async function main() {
//   console.log('');
//   console.log('======================================');
//   console.log('🌱 BẮT ĐẦU SEED DATABASE');
//   console.log('======================================');

//   // =========================================================
//   // 1. CATEGORY
//   // =========================================================

//   console.log('');
//   console.log('📂 Đang tạo category...');

//   const categories: Array<{
//     id: string;
//     name: string;
//     slug: string;
//   }> = [];

//   for (const category of categoryData) {
//     const createdCategory = await prisma.category.upsert({
//       where: {
//         slug: category.slug,
//       },
//       update: {
//         name: category.name,
//         status: 'active',
//         deletedAt: null,
//       },
//       create: {
//         name: category.name,
//         slug: category.slug,
//         status: 'active',
//       },
//     });

//     categories.push(createdCategory);
//   }

//   console.log(`✅ Có ${categories.length} category`);

//   // =========================================================
//   // 2. PRODUCT
//   // =========================================================

//   console.log('');
//   console.log('🛍️ Đang tạo product...');

//   const createdProducts: Array<{
//     id: string;
//     name: string;
//     price: number;
//     sku: string;
//   }> = [];

//   for (const product of productData) {
//     const category = categories.find((item) => item.slug === product.category);

//     const createdProduct = await prisma.product.upsert({
//       where: {
//         sku: product.sku,
//       },

//       update: {
//         name: product.name,
//         slug: product.slug,
//         price: product.price,
//         originalPrice: product.originalPrice,
//         stock: randomInt(10, 200),
//         status: 'active',
//         categoryId: category?.id,
//         brand: product.brand,
//         origin: product.origin,

//         shortDescription: `${product.name} - sản phẩm test`,

//         description: `Đây là sản phẩm ${product.name} được tạo để test hệ thống.`,

//         ingredients: 'Water, Glycerin, Niacinamide, Hyaluronic Acid',

//         usageInstructions: 'Sử dụng theo hướng dẫn trên bao bì sản phẩm.',

//         specifications: {
//           Dung_tich: '100ml',
//           Xuat_xu: product.origin,
//           Thuong_hieu: product.brand,
//         },

//         skinType: ['normal', 'oily'],

//         images: [],

//         deletedAt: null,
//       },

//       create: {
//         name: product.name,
//         slug: product.slug,
//         sku: product.sku,
//         price: product.price,
//         originalPrice: product.originalPrice,
//         stock: randomInt(10, 200),
//         status: 'active',
//         categoryId: category?.id,
//         brand: product.brand,
//         origin: product.origin,

//         shortDescription: `${product.name} - sản phẩm test`,

//         description: `Đây là sản phẩm ${product.name} được tạo để test hệ thống.`,

//         ingredients: 'Water, Glycerin, Niacinamide, Hyaluronic Acid',

//         usageInstructions: 'Sử dụng theo hướng dẫn trên bao bì sản phẩm.',

//         specifications: {
//           Dung_tich: '100ml',
//           Xuat_xu: product.origin,
//           Thuong_hieu: product.brand,
//         },

//         skinType: ['normal', 'oily'],

//         images: [],
//       },
//     });

//     createdProducts.push(createdProduct);
//   }

//   console.log(`✅ Có ${createdProducts.length} product`);

//   console.log('🗑️ Đang xóa dữ liệu test cũ...');

//   await prisma.order.deleteMany({
//     where: {
//       orderNumber: {
//         startsWith: 'ORD-TEST-',
//       },
//     },
//   });

//   const deletedCustomers = await prisma.customer.deleteMany({
//     where: {
//       email: {
//         endsWith: '@test.com',
//       },
//     },
//   });

//   console.log(`✅ Đã xóa ${deletedCustomers.count} customer test cũ`);

//   // =========================================================
//   // 3. CUSTOMER
//   // =========================================================

//   console.log('');
//   console.log('👤 Đang tạo 100 customer...');

//   const customers: Array<{
//     id: string;
//     name: string;
//     email: string;
//     phone: string | null;
//   }> = [];

//   for (let i = 1; i <= 100; i++) {
//     const baseName = customerNames[(i - 1) % customerNames.length];

//     const name = i <= customerNames.length ? baseName : `${baseName} ${i}`;

//     const email = `customer${i}@test.com`;

//     const phone = `09${String(10000000 + i).slice(-8)}`;

//     const customer = await prisma.customer.upsert({
//       where: {
//         email,
//       },

//       update: {
//         name,
//         phone,
//         password: '123456',
//         isActive: true,
//       },

//       create: {
//         name,
//         email,
//         phone,
//         password: '123456',
//         isActive: true,
//       },
//     });

//     customers.push(customer);
//   }

//   console.log(`✅ Có ${customers.length} customer`);

//   // =========================================================
//   // 4. XÓA ORDER TEST CŨ
//   // =========================================================

//   console.log('');
//   console.log('🗑️ Đang xóa order test cũ...');

//   const deleted = await prisma.order.deleteMany({
//     where: {
//       orderNumber: {
//         startsWith: 'ORD-TEST-',
//       },
//     },
//   });

//   console.log(`✅ Đã xóa ${deleted.count} order test cũ`);

//   // =========================================================
//   // 5. TẠO 100 ORDER
//   // =========================================================

//   console.log('');
//   console.log('📦 Đang tạo 100 order...');

//   const orders = [];

//   for (let i = 1; i <= 100; i++) {
//     // -----------------------------------------
//     // STATUS
//     // -----------------------------------------

//     const status = ORDER_STATUSES[(i - 1) % ORDER_STATUSES.length];

//     // -----------------------------------------
//     // PAYMENT METHOD
//     // -----------------------------------------

//     const paymentMethod = PAYMENT_METHODS[(i - 1) % PAYMENT_METHODS.length];

//     // -----------------------------------------
//     // PAYMENT STATUS
//     // -----------------------------------------

//     const paymentStatus = PAYMENT_STATUSES[(i - 1) % PAYMENT_STATUSES.length];

//     // -----------------------------------------
//     // CUSTOMER
//     // -----------------------------------------

//     const customer = customers[(i - 1) % customers.length];

//     // -----------------------------------------
//     // ITEMS
//     // -----------------------------------------

//     const itemCount = randomInt(1, 4);

//     const items: Array<{
//       productId: string;
//       name: string;
//       price: number;
//       quantity: number;
//     }> = [];

//     let totalAmount = 0;

//     for (let j = 0; j < itemCount; j++) {
//       const product = randomItem(createdProducts);

//       const quantity = randomInt(1, 3);

//       items.push({
//         productId: product.id,
//         name: product.name,
//         price: product.price,
//         quantity,
//       });

//       totalAmount += product.price * quantity;
//     }

//     // -----------------------------------------
//     // SHIPPING ADDRESS
//     // -----------------------------------------

//     const city = randomItem(cities);

//     // -----------------------------------------
//     // ORDER
//     // -----------------------------------------

//     const order = await prisma.order.create({
//       data: {
//         orderNumber: `ORD-TEST-${String(i).padStart(4, '0')}`,

//         customer: {
//           connect: {
//             id: customer.id,
//           },
//         },

//         items,

//         totalAmount,

//         status,

//         paymentMethod,

//         paymentStatus,

//         shippingAddress: {
//           name: customer.name,
//           phone: customer.phone,
//           address: `${randomInt(1, 999)} Đường Test ${randomInt(1, 20)}`,
//           city,
//         },

//         note: i % 7 === 0 ? 'Đơn test có ghi chú' : null,

//         createdAt: randomDate(60),
//       },
//     });

//     orders.push(order);
//   }

//   console.log(`✅ Có ${orders.length} order`);

//   // =========================================================
//   // 6. THỐNG KÊ
//   // =========================================================

//   const statistics: Record<string, number> = {
//     pending: 0,
//     confirmed: 0,
//     shipping: 0,
//     completed: 0,
//     cancelled: 0,

//     unpaid: 0,
//     paid: 0,

//     COD: 0,
//     VNPay: 0,
//     Momo: 0,
//   };

//   for (const order of orders) {
//     statistics[order.status] = (statistics[order.status] || 0) + 1;

//     statistics[order.paymentStatus] =
//       (statistics[order.paymentStatus] || 0) + 1;

//     statistics[order.paymentMethod] =
//       (statistics[order.paymentMethod] || 0) + 1;
//   }

//   // =========================================================
//   // RESULT
//   // =========================================================

//   console.log('');
//   console.log('======================================');
//   console.log('🎉 SEED THÀNH CÔNG!');
//   console.log('======================================');

//   console.log(`📂 Category: ${categories.length}`);
//   console.log(`🛍️ Product: ${createdProducts.length}`);
//   console.log(`👤 Customer: ${customers.length}`);
//   console.log(`📦 Order: ${orders.length}`);

//   console.log('');
//   console.log('📊 THỐNG KÊ:');

//   console.table(statistics);

//   console.log('');
//   console.log('🔐 CUSTOMER TEST');
//   console.log('--------------------------------------');
//   console.log('Email: customer1@test.com');
//   console.log('Password: 123456');
//   console.log('');
//   console.log('Email: customer2@test.com');
//   console.log('Password: 123456');
//   console.log('');
//   console.log('Email: customer3@test.com');
//   console.log('Password: 123456');

//   console.log('');
//   console.log('👉 Các customer còn lại:');
//   console.log('customer4@test.com -> 123456');
//   console.log('customer5@test.com -> 123456');
//   console.log('...');
// }

// // =========================================================
// // RUN
// // =========================================================

// main()
//   .catch((error) => {
//     console.error('');
//     console.error('❌ SEED THẤT BẠI');
//     console.error(error);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { CustomersModule } from './customers/customers.module';
import { OrdersModule } from './orders/orders.module';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { AdminsModule } from './admins/admins.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [
    PrismaModule,
    CategoriesModule,
    ProductsModule,
    CustomersModule,
    OrdersModule,
    AuthModule,
    EmailModule,
    AdminsModule,
    UploadModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

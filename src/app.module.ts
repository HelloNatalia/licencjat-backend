import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AddressModule } from './address/address.module';
import { ProductModule } from './product/product.module';
import { ProductCategoryModule } from './product_category/product_category.module';
import { AnnouncementModule } from './announcement/announcement.module';
import { RequestModule } from './request/request.module';
import { RecipeModule } from './recipe/recipe.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'superuser',
      database: 'licencjat-database',
      autoLoadEntities: true,
      synchronize: true,
    }),
    AuthModule,
    AddressModule,
    ProductModule,
    ProductCategoryModule,
    AnnouncementModule,
    RequestModule,
    RecipeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

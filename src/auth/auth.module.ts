import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { Address } from 'src/address/address.entity';
import { AddressModule } from 'src/address/address.module';
import { AddressService } from 'src/address/address.service';
import { Announcement } from 'src/announcement/announcement.entity';
import { AnnouncementModule } from 'src/announcement/announcement.module';
import { AnnouncementService } from 'src/announcement/announcement.service';
import { Product } from 'src/product/product.entity';
import { Report } from 'src/report/report.entity';
import { TakenProduct } from 'src/announcement/taken-product.entity';
import { ProductCategory } from 'src/product_category/product_category.entity';
import { Request } from 'src/request/request.entity';
import { ReportService } from 'src/report/report.service';
import { RecipeService } from 'src/recipe/recipe.service';
import { Recipe } from 'src/recipe/recipe.entity';
import { RecipeModule } from 'src/recipe/recipe.module';
import { RecipeCategory } from 'src/recipe/recipe-category.entity';
import { RecipeProduct } from 'src/recipe/recipe-product.entity';
import { FavouriteRecipe } from 'src/recipe/favourite-recipe.entity';
import { TemporaryRecipe } from 'src/recipe/temporary-recipe.entity';
import { TemporaryRecipeProduct } from 'src/recipe/temporary-recipe-product.entity';
import { Rating } from 'src/rating/rating.entity';
import { RatingModule } from 'src/rating/rating.module';
import { RatingService } from 'src/rating/rating.service';
import { ReportModule } from 'src/report/report.module';
import { RequestModule } from 'src/request/request.module';
import { RequestService } from 'src/request/request.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'secret',
      signOptions: {
        expiresIn: 10800,
      },
    }),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Address]),
    AddressModule,
    TypeOrmModule.forFeature([Announcement]),
    AnnouncementModule,
    TypeOrmModule.forFeature([Product]),
    TypeOrmModule.forFeature([ProductCategory]),
    TypeOrmModule.forFeature([Request]),
    TypeOrmModule.forFeature([TakenProduct]),
    TypeOrmModule.forFeature([Report]),
    TypeOrmModule.forFeature([Recipe]),
    TypeOrmModule.forFeature([RecipeCategory]),
    TypeOrmModule.forFeature([RecipeProduct]),
    TypeOrmModule.forFeature([FavouriteRecipe]),
    TypeOrmModule.forFeature([TemporaryRecipe]),
    TypeOrmModule.forFeature([TemporaryRecipeProduct]),
    RecipeModule,
    TypeOrmModule.forFeature([Rating]),
    RatingModule,
    ReportModule,
    RequestModule,
  ],
  providers: [
    AuthService,
    JwtStrategy,
    AddressService,
    AnnouncementService,
    ReportService,
    RecipeService,
    RatingService,
    ReportService,
    RequestService,
  ],
  controllers: [AuthController],
  exports: [PassportModule, JwtStrategy],
})
export class AuthModule {}

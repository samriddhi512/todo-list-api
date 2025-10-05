import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TodosModule } from './todos/todos.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './todos/entities/todo.entity';
import { User } from './users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [User, Todo], // which entities typeorm should map to tables
      // synchronize: true, // autocreates tables based on entities. - not good for prod - can drop/alter table unexpectedly. use migrations
    }),
    UsersModule,
    TodosModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

// this is the root module of the app.
// wires together app controllers and app services.
// here to import feature modules.
// Typeorm - orm lib handles mapping bw ts classes [entities] and actual pg table
// NestJS wraps TypeORM in a module (TypeOrmModule) so it can be injected via Nest’s dependency injection system.
// Without TypeOrmModule, manually create connections, repositories, and inject them everywhere

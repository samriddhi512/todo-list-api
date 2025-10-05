import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';

@Module({
  // I want the repository for the todo entity class to be available in this module.
  // Nest/TypeORM then automatically creates a Repository<Todo>, which you can inject
  imports: [TypeOrmModule.forFeature([Todo])],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}

// the automatically created repo is a ready to use object with all the standard database methods:
// todoRepo.find(); // get all todos
// todoRepo.findOne({ id: 1 }); // get one todo
// todoRepo.save(todo); // insert or update a todo
// todoRepo.update(id, { status: 'done' });
// todoRepo.delete(id);

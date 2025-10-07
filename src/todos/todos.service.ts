import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dtos/createTodo.dto';
import { UpdateTodoDto } from './dtos/updateTodo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepo: Repository<Todo>,
  ) {}

  async findAllForUser(userId: number): Promise<Todo[]> {
    // relations: 'user' = property name in the entity that defines the relationship.
    // TypeORM looks at the entity metadata, sees that Todo.user is a ManyToOne relation to User, and automatically generates a JOIN in the SQL.
    // It will join with the users table internally using the foreign key (user_id).
    return this.todoRepo.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async findOneForUser(id: number, userId: number): Promise<Todo | null> {
    return this.todoRepo.findOne({
      where: { id, user: { id: userId } },
      relations: ['user'],
    });
  }

  async createForUser(todoData: CreateTodoDto, userId: number): Promise<Todo> {
    const todo = this.todoRepo.create({
      ...todoData,
      user: {
        id: userId,
      },
    }); // creates an entity instance
    // console.log('todo', todo);
    return this.todoRepo.save(todo);
  }

  async updateForUser(
    id: number,
    userId: number,
    todoData: UpdateTodoDto,
  ): Promise<Todo | null> {
    await this.todoRepo.update({ id, user: { id: userId } }, todoData);
    return this.findOneForUser(id, userId);
  }

  async delete(id: number, userId: number): Promise<void> {
    await this.todoRepo.delete({ id, user: { id: userId } });
  }
}

// @InjectRepository(Todo) tells Nest: “give me the repository for the Todo entity”
// Note: all typeorm repo methods are async

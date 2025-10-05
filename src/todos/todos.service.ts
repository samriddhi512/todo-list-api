import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private readonly todoRepo: Repository<Todo>,
  ) {}

  async findAll(): Promise<Todo[]> {
    // relations: 'user' = property name in the entity that defines the relationship.
    // TypeORM looks at the entity metadata, sees that Todo.user is a ManyToOne relation to User, and automatically generates a JOIN in the SQL.
    // It will join with the users table internally using the foreign key (user_id).
    return this.todoRepo.find({ relations: ['user'] });
  }

  async findOne(id: number): Promise<Todo | null> {
    return this.todoRepo.findOne({ where: { id }, relations: ['user'] });
  }

  async create(todoData: Partial<Todo>): Promise<Todo> {
    const todo = this.todoRepo.create(todoData); // creates an entity instance
    // console.log('todo', todo);
    return this.todoRepo.save(todo);
  }

  async update(id: number, todoData: Partial<Todo>): Promise<Todo | null> {
    await this.todoRepo.update(id, todoData);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.todoRepo.delete(id);
  }
}

// @InjectRepository(Todo) tells Nest: “give me the repository for the Todo entity”
// Note: all typeorm repo methods are async

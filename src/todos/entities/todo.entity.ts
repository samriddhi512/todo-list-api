import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum TodoStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

@Entity('todos') // maps to todos table in the database
export class Todo {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    // below is a lazy function reference. Typeorm only evaluates the fucntions at runtime when it needs metadata.
    // so it doesnt matter that the classes import each other
    () => User, // target entity - function returning the class of the entity being related to
    (user) => user.todos, // inverse side - not necessarily needs to exist in db, code level relation that typeorm provides **
    { onDelete: 'CASCADE' }, // options
  )
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'varchar', length: 100 })
  title: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: TodoStatus, default: TodoStatus.PENDING })
  status: TodoStatus;

  @Column({ type: 'timestamp', default: () => 'now()' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'now()' })
  updated_at: Date;
}

// NOTE:
// Suppose we dont use any dtos just use above service directly for create todos.
// few things to understand:
// user_id is a column fk in todo table in postgres,
// but in typeorm we have mapped it like above todo=>user.
// i.e user is a relation to user entity not a plain number. TypeORM handles mapping.
// in post payload = we need to send it like user: {id: 1} not user_id: 1
// better to handle dto and payload so api can accept user_id directly

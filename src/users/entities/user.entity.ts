import { Exclude } from 'class-transformer';
import { Todo } from 'src/todos/entities/todo.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];

  @Column({ type: 'varchar', length: 100, nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  email: string;

  @Column({ nullable: false })
  @Exclude() // hide password when transforming.
  // It marks the property to be ignored while transforming a class instance into a plain object
  password: string;

  @Column({ nullable: false })
  address: string;

  @Column({ type: 'timestamp', default: () => 'now()' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'now()' })
  updated_at: Date;
}

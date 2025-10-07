import { PartialType } from '@nestjs/mapped-types';
import { CreateTodoDto } from './createTodo.dto';

export class UpdateTodoDto extends PartialType(CreateTodoDto) {}

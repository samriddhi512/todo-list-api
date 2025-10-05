import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from './entities/todo.entity';
import type { Response, Request } from 'express';

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  async findAll(): Promise<Todo[]> {
    return this.todosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Todo | null> {
    // @Param('id') → Extracts the id from the URL. id is a string can use parseIntPipe to convert it.
    const customer = this.todosService.findOne(id);
    if (customer) return customer;
    else throw new HttpException('User not found!', HttpStatus.NOT_FOUND);
  }

  @Post()
  async create(@Body() todoData: Partial<Todo>): Promise<Todo> {
    // @Body extracts request body
    return this.todosService.create(todoData);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() todoData: Partial<Todo>,
  ): Promise<Todo | null> {
    return this.todosService.update(+id, todoData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    return this.todosService.delete(+id);
  }
}

// @Get(':id')
// async findOneXpress(
//   **** this is the express way of handling req, res in nest - not so good
//   @Param('id', ParseIntPipe) id: number,
//   @Req() req: Request,
//   @Res() res: Response,
// ) {
//   // if use req(), res() then you must use those to send the response back.
//   // must explicitly call res.send(). Return customer wont work.
//   const customer = await this.todosService.findOne(id);
//   if (customer) res.send(customer);
//   else {
//     res.status(404).send({ msg: 'Customer not found' });
//   }
// }

import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from './entities/todo.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import type { Request } from 'express';
import { CreateTodoDto } from './dtos/createTodo.dto';
import { UpdateTodoDto } from './dtos/updateTodo.dto';

@Controller('todos')
@UseGuards(AuthGuard)
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  async findAll(@Req() req): Promise<Todo[]> {
    const userId = req.user.sub;
    return this.todosService.findAllForUser(userId);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
  ): Promise<Todo | null> {
    // @Param('id') → Extracts the id from the URL. id is a string can use parseIntPipe to convert it.
    const userId = req.user.sub;
    const result = this.todosService.findOneForUser(id, userId);
    if (result) return result;
    else throw new NotFoundException();
  }

  @Post()
  @UsePipes(ValidationPipe)
  async create(@Body() todoData: CreateTodoDto, @Req() req): Promise<Todo> {
    // @Body extracts request body
    const userId = req.user.sub;
    return this.todosService.createForUser(todoData, userId);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() todoData: UpdateTodoDto,
    @Req() req,
  ): Promise<Todo | null> {
    const userId = req.user.sub;
    return this.todosService.updateForUser(+id, userId, todoData);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req): Promise<void> {
    const userId = req.user.sub;
    return this.todosService.delete(+id, userId);
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

import { httpResource } from "@angular/common/http";
import { Component } from "@angular/core";

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-todos',
  template: `
    <h2>Todos</h2>
    <ul>
      @for (todo of todos.value(); track todo.id) {
        <li>{{ todo.title }}</li>
      }
    </ul>
  `,
})
export class Todos {
  protected readonly todos = httpResource<Todo[]>(() => 'https://jsonplaceholder.typicode.com/todos');
}

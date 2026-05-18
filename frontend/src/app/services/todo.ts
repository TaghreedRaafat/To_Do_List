import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private apiUrl = 'http://localhost:5000/api/todos';

  constructor(private http: HttpClient) {}

  // 👇 get all todos

  getTodos() {
  return this.http.get(this.apiUrl);
}

addTodo(title: string) {
  return this.http.post(this.apiUrl, { title });
}

toggleTodo(id: string) {
  return this.http.put(`${this.apiUrl}/${id}`, {});
}

deleteTodo(id: string) {
  return this.http.delete(`${this.apiUrl}/${id}`);
}

editTodo(id: string, title: string) {
  return this.http.put(`${this.apiUrl}/edit/${id}`, { title });
}
}
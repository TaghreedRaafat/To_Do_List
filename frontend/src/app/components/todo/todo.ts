import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { TodoService } from '../../services/todo';

interface Todo {
  _id: string;
  title: string;
  completed: boolean;
}

@Component({
  selector: 'app-todo',
  imports: [CommonModule, FormsModule],
  templateUrl: './todo.html',
  styleUrls: ['./todo.css'],
  animations: [
    trigger('fadeInList', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(10px)' }),
          stagger(80, [
            animate('250ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class TodoComponent implements OnInit {

  todos: Todo[] = [];
  title: string = '';
  isDark: boolean = false;
  showMessage: string = '';

  selectedIndex: string | null = null;

  editingId: string | null = null;
  editText: string = '';

  constructor(private todoService: TodoService) {}

  ngOnInit() {
    this.loadTodos();
  }

  // 📥 Load todos (newest first)
  loadTodos() {
    this.todoService.getTodos().subscribe((data: any) => {
      this.todos = data.reverse();
    });
  }

  // 🌙 Theme toggle
  toggleTheme() {
    this.isDark = !this.isDark;
  }

  // ➕ Add todo (NO reload)
  addTodo() {
    if (!this.title.trim()) {
      this.showMessage = "⚠️ No task entered!";
      setTimeout(() => this.showMessage = '', 2000);
      return;
    }

    this.todoService.addTodo(this.title).subscribe((newTodo: any) => {
      this.title = '';

      // 👇 add instantly at top
      this.todos.unshift(newTodo);

      this.showMessage = "✅ Task Added Successfully!";
      setTimeout(() => this.showMessage = '', 2000);
    });
  }

  // ✔ Toggle completed
  toggleTodo(id: string) {
    this.todoService.toggleTodo(id).subscribe((updated: any) => {

      const index = this.todos.findIndex(t => t._id === id);
      if (index !== -1) {
        this.todos[index] = updated;
      }

      this.showMessage = "✔ Task Updated!";
      setTimeout(() => this.showMessage = '', 2000);
    });
  }

  // 🗑 Delete todo
  deleteTodo(id: string) {
    this.todoService.deleteTodo(id).subscribe(() => {

      this.todos = this.todos.filter(t => t._id !== id);

      this.showMessage = "🗑️ Task Deleted!";
      setTimeout(() => this.showMessage = '', 2000);
    });
  }

  // ✏️ Start edit
  startEdit(todo: Todo) {
    this.editingId = todo._id;
    this.editText = todo.title;
  }

  // 💾 Save edit
  saveEdit(id: string) {
    if (!this.editText.trim()) {
      this.showMessage = "⚠️ Cannot update empty task!";
      setTimeout(() => this.showMessage = '', 2000);
      return;
    }

    this.todoService.editTodo(id, this.editText).subscribe(() => {
      this.editingId = null;
      this.loadTodos();

      this.showMessage = "✏️ Task Updated Successfully!";
      setTimeout(() => this.showMessage = '', 2000);
    });
  }

  // 🎯 Select task (optional UI)
  selectTodo(id: string) {
    this.selectedIndex = id;
  }
}
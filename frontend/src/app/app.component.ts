import { Component, OnInit } from '@angular/core';
import { Task, TaskRequest } from './task.model';
import { TaskService } from './task.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  tasks: Task[] = [];

  form: TaskRequest = {
    title: '',
    description: '',
    done: false
  };

  isEditMode = false;
  editingTaskId: number | null = null;

  filterStatus: 'all' | 'done' | 'todo' = 'all';
  searchKeyword = '';

  errorMessage = '';
  successMessage = '';

  constructor(private taskService: TaskService) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    const doneParam =
      this.filterStatus === 'all' ? null :
      this.filterStatus === 'done' ? true : false;

    this.taskService.getTasks(doneParam, this.searchKeyword).subscribe({
      next: (data) => {
        this.tasks = data;
      },
      error: () => {
        this.errorMessage = 'Failed to load tasks.';
      }
    });
  }

  saveTask(): void {
    this.clearMessages();

    if (!this.form.title.trim()) {
      this.errorMessage = 'Title is required.';
      return;
    }

    const payload: TaskRequest = {
      title: this.form.title.trim(),
      description: this.form.description?.trim() || '',
      done: this.form.done ?? false
    };

    if (this.isEditMode && this.editingTaskId !== null) {
      this.taskService.updateTask(this.editingTaskId, payload).subscribe({
        next: () => {
          this.successMessage = 'Task updated successfully.';
          this.resetForm();
          this.loadTasks();
        },
        error: (err) => {
          this.errorMessage = this.extractError(err);
        }
      });
    } else {
      this.taskService.addTask(payload).subscribe({
        next: () => {
          this.successMessage = 'Task added successfully.';
          this.resetForm();
          this.loadTasks();
        },
        error: (err) => {
          this.errorMessage = this.extractError(err);
        }
      });
    }
  }

  editTask(task: Task): void {
    this.isEditMode = true;
    this.editingTaskId = task.id ?? null;
    this.form = {
      title: task.title,
      description: task.description || '',
      done: task.done
    };
    this.clearMessages();
  }

  cancelEdit(): void {
    this.resetForm();
    this.clearMessages();
  }

  toggleTask(task: Task): void {
    if (!task.id) return;

    this.clearMessages();

    this.taskService.toggleTaskStatus(task.id).subscribe({
      next: () => {
        this.successMessage = 'Task status updated.';
        this.loadTasks();
      },
      error: () => {
        this.errorMessage = 'Failed to update task status.';
      }
    });
  }

  deleteTask(id?: number): void {
    if (!id) return;

    this.clearMessages();

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        this.successMessage = 'Task deleted successfully.';
        this.loadTasks();
      },
      error: () => {
        this.errorMessage = 'Failed to delete task.';
      }
    });
  }

  applyFilter(status: 'all' | 'done' | 'todo'): void {
    this.filterStatus = status;
    this.loadTasks();
  }

  searchTasks(): void {
    this.loadTasks();
  }

  clearSearch(): void {
    this.searchKeyword = '';
    this.loadTasks();
  }

  private resetForm(): void {
    this.form = {
      title: '',
      description: '',
      done: false
    };
    this.isEditMode = false;
    this.editingTaskId = null;
  }

  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  private extractError(err: any): string {
    if (err?.error?.title) return err.error.title;
    if (err?.error?.message) return err.error.message;
    return 'Something went wrong.';
  }
}

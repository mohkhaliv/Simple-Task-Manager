package com.example.taskmanager.service;

import com.example.taskmanager.dto.TaskRequest;
import com.example.taskmanager.dto.TaskResponse;
import com.example.taskmanager.exception.ResourceNotFoundException;
import com.example.taskmanager.model.Task;
import com.example.taskmanager.repository.TaskRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;

    public TaskServiceImpl(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Override
    public List<TaskResponse> getAllTasks(Boolean done, String keyword) {
        List<Task> tasks;
        boolean hasKeyword = keyword != null && !keyword.trim().isEmpty();

        if (done != null && hasKeyword) {
            tasks = taskRepository.findByDoneAndTitleContainingIgnoreCase(done, keyword.trim());
        } else if (done != null) {
            tasks = taskRepository.findByDone(done);
        } else if (hasKeyword) {
            tasks = taskRepository.findByTitleContainingIgnoreCase(keyword.trim());
        } else {
            tasks = taskRepository.findAll();
        }

        return tasks.stream().map(this::toResponse).toList();
    }

    @Override
    public TaskResponse getTaskById(Long id) {
        return toResponse(findTaskOrThrow(id));
    }

    @Override
    public TaskResponse createTask(TaskRequest request) {
        Task task = new Task();
        task.setTitle(request.getTitle().trim());
        task.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        task.setDone(request.getDone() != null && request.getDone());
        return toResponse(taskRepository.save(task));
    }

    @Override
    public TaskResponse updateTask(Long id, TaskRequest request) {
        Task task = findTaskOrThrow(id);
        task.setTitle(request.getTitle().trim());
        task.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        if (request.getDone() != null) {
            task.setDone(request.getDone());
        }
        return toResponse(taskRepository.save(task));
    }

    @Override
    public TaskResponse toggleTaskStatus(Long id) {
        Task task = findTaskOrThrow(id);
        task.setDone(!task.isDone());
        return toResponse(taskRepository.save(task));
    }

    @Override
    public void deleteTask(Long id) {
        taskRepository.delete(findTaskOrThrow(id));
    }

    private Task findTaskOrThrow(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Task with id " + id + " not found"));
    }

    private TaskResponse toResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.isDone(),
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }
}

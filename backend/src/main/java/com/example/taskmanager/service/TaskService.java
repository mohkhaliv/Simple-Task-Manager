package com.example.taskmanager.service;

import com.example.taskmanager.dto.TaskRequest;
import com.example.taskmanager.dto.TaskResponse;

import java.util.List;

public interface TaskService {
    List<TaskResponse> getAllTasks(Boolean done, String keyword);
    TaskResponse getTaskById(Long id);
    TaskResponse createTask(TaskRequest request);
    TaskResponse updateTask(Long id, TaskRequest request);
    TaskResponse toggleTaskStatus(Long id);
    void deleteTask(Long id);
}

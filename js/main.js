"use strict";

import { TaskList } from "./taskList.js";
import { setupDragDrop } from "./dragDrop.js";

// Initialisation
document.addEventListener("DOMContentLoaded", () => {
  try {
    const taskList = new TaskList();
    const tasksContainer = document.getElementById("tasks-container");
    const taskTitleInput = document.getElementById("task-title");
    const taskDescInput = document.getElementById("task-desc");
    const taskPrioritySelect = document.getElementById("task-priority");
    const addTaskBtn = document.getElementById("add-task-btn");
    const filterButtons = document.querySelectorAll(".filter-btn");

    // Configuration du Drag & Drop
    setupDragDrop(tasksContainer, taskList);

    // Gestion de l'ajout de tâche
    const addTaskHandler = () => {
      const title = taskTitleInput.value.trim();
      const description = taskDescInput.value.trim();
      const priority = taskPrioritySelect.value;

      if (title) {
        taskList.addTask(title, description, priority);
        taskTitleInput.value = "";
        taskDescInput.value = "";
        renderTasks();
        taskTitleInput.focus();
      }
    };

    addTaskBtn.addEventListener("click", addTaskHandler);
    taskTitleInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") addTaskHandler();
    });

    // Gestion des filtres
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        renderTasks(button.dataset.filter);
      });
    });

    /**
     * Affiche les tâches filtrées
     * @param {string} filterType - Type de filtre (all/active/completed)
     */
    function renderTasks(filterType = "all") {
      const tasks = taskList.getFilteredTasks(filterType);

      tasksContainer.innerHTML = tasks
        .map(
          (task) => `
        <div class="task" draggable="true" data-id="${
          task.id
        }" data-priority="${task.priority}">
          <input 
            type="checkbox" 
            ${task.isCompleted ? "checked" : ""} 
            onchange="window.taskList.toggleTask(${
              task.id
            }); window.renderTasks()"
          >
          <div class="task-content">
            <div class="task-title ${task.isCompleted ? "completed" : ""}">${
            task.title
          }</div>
            ${
              task.description
                ? `<div class="task-desc">${task.description}</div>`
                : ""
            }
          </div>
          <div class="task-actions">
            <button class="edit-btn" onclick="editTask(${task.id})">
              <i class="fas fa-edit"></i>
            </button>
            <button class="delete-btn" onclick="window.taskList.deleteTask(${
              task.id
            }); window.renderTasks()">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `
        )
        .join("");
    }

    // Fonction d'édition (exemple basique)
    window.editTask = (id) => {
      const task = taskList.tasks.find((t) => t.id === id);
      if (task) {
        taskTitleInput.value = task.title;
        taskDescInput.value = task.description;
        taskPrioritySelect.value = task.priority;
        taskList.deleteTask(id);
        tasksContainer.scrollTo(0, 0);
      }
    };

    // Exposer les fonctions globalement
    window.taskList = taskList;
    window.renderTasks = renderTasks;

    // Premier rendu
    renderTasks();
  } catch (error) {
    console.error("Erreur d'initialisation:", error);
    alert("Une erreur est survenue lors du chargement de l'application.");
  }
});

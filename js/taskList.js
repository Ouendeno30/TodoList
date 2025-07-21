"use strict";

import { Task } from "./task.js";

/**
 * Gestionnaire de la liste de tâches avec persistance locale
 * @class
 */
export class TaskList {
  constructor() {
    this.tasks = this._loadFromLocalStorage();
  }

  /**
   * Charge les tâches depuis le localStorage
   * @private
   * @returns {Task[]}
   */
  _loadFromLocalStorage() {
    try {
      const savedTasks = localStorage.getItem("tasks");
      return savedTasks ? JSON.parse(savedTasks) : [];
    } catch (error) {
      console.error("Erreur de chargement:", error);
      return [];
    }
  }

  /**
   * Sauvegarde les tâches dans le localStorage
   * @private
   */
  _saveToLocalStorage() {
    try {
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
    } catch (error) {
      console.error("Erreur de sauvegarde:", error);
    }
  }

  /**
   * Ajoute une nouvelle tâche
   * @param {string} title - Titre
   * @param {string} description - Description
   * @param {string} priority - Priorité
   */
  addTask(title, description, priority = "medium") {
    if (!title) throw new Error("Le titre est obligatoire");

    const newTask = new Task(Date.now(), title, description, false, priority);

    this.tasks.push(newTask);
    this._saveToLocalStorage();
  }

  /**
   * Supprime une tâche
   * @param {number} id - ID de la tâche
   */
  deleteTask(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this._saveToLocalStorage();
  }

  /**
   * Bascule l'état d'une tâche
   * @param {number} id - ID de la tâche
   */
  toggleTask(id) {
    const task = this.tasks.find((task) => task.id === id);
    if (task) {
      task.toggleCompletion();
      this._saveToLocalStorage();
    }
  }

  /**
   * Filtre les tâches
   * @param {string} filter - Type de filtre (all/active/completed)
   * @returns {Task[]}
   */
  getFilteredTasks(filter = "all") {
    switch (filter) {
      case "active":
        return this.tasks.filter((task) => !task.isCompleted);
      case "completed":
        return this.tasks.filter((task) => task.isCompleted);
      default:
        return [...this.tasks];
    }
  }
}
if (typeof window !== undefined) {
  window.TaskList = TaskList;
}

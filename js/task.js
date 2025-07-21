/**
 * Modèle d'une tâche avec priorité
 * @class
 */
export class Task {
  /**
   * Crée une instance de Task
   * @param {number} id - ID unique
   * @param {string} title - Titre
   * @param {string} description - Description
   * @param {boolean} isCompleted - État
   * @param {string} priority - Priorité (low/medium/high)
   */
  constructor(
    id,
    title,
    description = "",
    isCompleted = false,
    priority = "medium"
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.isCompleted = isCompleted;
    this.priority = priority;
  }

  /**
   * Bascule l'état de complétion
   */
  toggleCompletion() {
    this.isCompleted = !this.isCompleted;
  }
}
if (typeof window !== undefined) {
  window.Task = Task;
}

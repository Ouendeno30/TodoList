"use strict";

/**
 * Configure le système de Drag & Drop
 * @param {HTMLElement} container - Conteneur des tâches
 * @param {TaskList} taskList - Instance de TaskList
 */
export function setupDragDrop(container, taskList) {
  let draggedItem = null;

  // Événement de début de drag
  container.addEventListener("dragstart", (e) => {
    if (e.target.classList.contains("task")) {
      draggedItem = e.target;
      e.target.classList.add("dragging");
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.setData("text/plain", e.target.dataset.id);
    }
  });

  // Événement pendant le drag
  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    const afterElement = getDragAfterElement(container, e.clientY);
    const draggingItem = container.querySelector(".dragging");

    if (draggingItem) {
      if (afterElement) {
        container.insertBefore(draggingItem, afterElement);
      } else {
        container.appendChild(draggingItem);
      }
    }
  });

  // Événement de fin de drag
  container.addEventListener("dragend", () => {
    if (draggedItem) {
      draggedItem.classList.remove("dragging");
      updateTaskOrder(taskList, container);
      draggedItem = null;
    }
  });

  /**
   * Trouve l'élément après lequel positionner l'élément dragué
   * @param {HTMLElement} container - Conteneur
   * @param {number} y - Position Y de la souris
   * @returns {HTMLElement|null}
   */
  function getDragAfterElement(container, y) {
    const draggableElements = [
      ...container.querySelectorAll(".task:not(.dragging)"),
    ];

    return draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    ).element;
  }

  /**
   * Met à jour l'ordre des tâches dans taskList
   * @param {TaskList} taskList
   * @param {HTMLElement} container
   */
  function updateTaskOrder(taskList, container) {
    const newOrder = [...container.querySelectorAll(".task")].map((el) =>
      parseInt(el.dataset.id)
    );

    taskList.tasks.sort(
      (a, b) => newOrder.indexOf(a.id) - newOrder.indexOf(b.id)
    );
    taskList._saveToLocalStorage();
  }
}

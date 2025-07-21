import { Task, TaskList } from "../js/taskList.js";

// ==================== TESTS UNITAIRES ====================
QUnit.module("Modèle Task", () => {
  QUnit.test("Priorités valides", (assert) => {
    const task = new Task(1, "Test", "", false, "medium");
    assert.ok(
      ["low", "medium", "high"].includes(task.priority),
      "Doit avoir une priorité valide"
    );
  });
});

QUnit.module("TaskList - Tests Avancés", (hooks) => {
  let taskList;

  hooks.beforeEach(() => {
    localStorage.clear();
    taskList = new TaskList();
    taskList.addTask("Tâche 1", "Desc 1", "low");
    taskList.addTask("Tâche 2", "Desc 2", "high", true);
  });

  QUnit.test("Tri par priorité", (assert) => {
    const highPriorityTasks = taskList.tasks.filter(
      (t) => t.priority === "high"
    );
    assert.equal(
      highPriorityTasks.length,
      1,
      "Doit filtrer par haute priorité"
    );
  });

  QUnit.test("Toggle multiple", (assert) => {
    const taskId = taskList.tasks[0].id;
    taskList.toggleTask(taskId);
    taskList.toggleTask(taskId);
    assert.notOk(
      taskList.tasks[0].isCompleted,
      "Doit revenir à l'état initial après 2 toggles"
    );
  });
});

// ==================== TESTS D'INTÉGRATION ====================
QUnit.module("Drag & Drop Simulation", (hooks) => {
  hooks.beforeEach(() => {
    document.getElementById("qunit-fixture").innerHTML = `
      <div id="tasks-container">
        <div class="task" data-id="1">Tâche 1</div>
        <div class="task" data-id="2">Tâche 2</div>
      </div>
    `;
  });

  QUnit.test("Simulation de drag", (assert) => {
    const done = assert.async();
    const taskList = new TaskList();
    taskList.tasks = [{ id: 1 }, { id: 2 }];

    setupDragDrop(document.getElementById("tasks-container"), taskList);

    setTimeout(() => {
      const event = new DragEvent("dragover", { clientY: 100 });
      document.getElementById("tasks-container").dispatchEvent(event);

      assert.equal(taskList.tasks[0].id, 1, "L'ordre doit être préservé");
      done();
    }, 100);
  });
});

<template>
  <b-container>
    <div class="header">
      <h1>Bem Vindo a Lista To-Do!</h1>
      <img alt="logo" src="../assets/imgs/list2.svg" />
    </div>
    <b-form @submit.prevent="save" class="mb-3">
      <input id="task-id" type="hidden" v-model="task.id" />
      <input id="task-check" type="hidden" v-model="task.check" />
      <input id="task-complete" type="hidden" v-model="task.complete" />
      <b-row align-h="center">
        <b-col md="6" sm="12">
          <b-form-input
            id="task"
            v-model.trim="task.name"
            type="text"
            :readonly="mode === 'remove'"
            placeholder="Digite sua Tarefa"
          />
        </b-col>
      </b-row>
    </b-form>
    <b-row align-h="center">
      <b-col md="6" sm="12">
        <b-button v-if="mode === 'save'" class="mr-2" @click="save" variant="primary">Salvar</b-button>
        <b-button v-if="mode === 'remove'" class="mr-2" variant="danger" @click="remove">Excluir</b-button>
        <b-button class="mr-2" variant="secondary" @click="reset">Cancelar</b-button>
        <b-button v-show="showReset" @click="emptyData" variant="warning">Limpar Base</b-button>
      </b-col>
    </b-row>
    <b-table class="mt-5" hover striped table-variant="light" :items="tasks" :fields="fields">
      <template slot="cell(check)" slot-scope="data">
        <b-form-checkbox v-model="data.item.check" @change="taskCompleted(data.item)" />
      </template>
      <template slot="cell(actions)" slot-scope="data">
        <b-button
          :disabled="data.item.complete"
          variant="warning"
          @click="loadTask(data.item)"
          class="mr-2"
        >
          <i class="fa fa-pencil"></i>
        </b-button>
        <b-button
          :disabled="data.item.complete"
          variant="danger"
          @click="loadTask(data.item, 'remove')"
        >
          <i class="fa fa-trash"></i>
        </b-button>
      </template>
    </b-table>
  </b-container>
</template>

<script>
import { keyStorage } from "@/global";

export default {
  name: "ToDoList",
  data() {
    return {
      mode: "save",
      id: 0,
      task: {},
      tasks: [],
      showReset: false,
      fields: [
        { key: "check", label: "" },
        { key: "id", label: "Código", sortable: true },
        { key: "name", label: "Nome", sortable: true },
        {
          key: "complete",
          label: "Posição",
          sortable: true,
          formatter: value => (value ? "Concluída" : "Pendente")
        },
        { key: "actions", label: "Ações" }
      ]
    };
  },
  methods: {
    loadTasks() {
      const data = JSON.parse(localStorage.getItem(keyStorage));

      if (!data) return;

      this.id = data.count;
      this.tasks = data.dataT;

      this.tasks.map(task =>
        task.complete ? (task._rowVariant = "dark") : null
      );

      if (this.tasks) {
        this.showReset = true;
      }
    },

    loadTask(task, mode = "save") {
      this.mode = mode;
      this.task = { ...task };
      window.scrollTo(0, 0);
    },

    reset() {
      this.task = {};
      this.mode = "save";
    },

    save() {
      if (!this.task.id) {
        if (this.task.name) {
          this.id++;
          const newTask = { ...this.task };

          newTask.id = this.id;
          newTask.check = false;
          newTask.complete = false;

          this.tasks = this.tasks || [];
          this.tasks.push(newTask);

          this.showReset = true;
        }
      } else {
        const index = this.tasks.findIndex(
          element => element.id === this.task.id
        );

        if (index > -1) {
          let alteredTask = this.tasks[index];
          this.tasks.splice(index, 1);

          alteredTask.name = this.task.name;
          this.tasks.splice(index, 0, alteredTask);
        }
      }

      this.reset();
      this.salveLocal();
    },

    remove() {
      const index = this.tasks.findIndex(
        element => element.id === this.task.id
      );

      if (index > -1) {
        this.tasks.splice(index, 1);
      }

      this.salveLocal();
      this.reset();
    },

    emptyData() {
      localStorage.removeItem(keyStorage);
      this.tasks = [];
      this.id = 0;
      this.showReset = false;
      this.reset();
    },

    taskCompleted(item) {
      const index = this.tasks.findIndex(element => element.id === item.id);

      if (index > -1) {
        let alteredTask = this.tasks[index];
        this.tasks.splice(index, 1);

        alteredTask.check = !alteredTask.check;
        alteredTask.complete = !alteredTask.complete;
        alteredTask.complete
          ? (alteredTask._rowVariant = "dark")
          : (alteredTask._rowVariant = "");
        this.tasks.splice(index, 0, alteredTask);
      }

      this.salveLocal();
    },

    salveLocal() {
      const dataStore = { count: this.id, dataT: this.tasks };
      localStorage.setItem(keyStorage, JSON.stringify(dataStore));
    }
  },
  mounted() {
    this.loadTasks();
  }
};
</script>

<style>
.header {
  display: flex;
  justify-content: center;
  align-items: center;
}

.header h1 {
  color: #dadada;
  padding: 20px;
}

.header img {
  width: 40px;
}
</style>
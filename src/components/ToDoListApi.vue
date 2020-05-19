<template>
  <div class="ToDoLisApi">
    <b-container class="header">
      <b-row class="justify-content-md-center">
        <h1>Bem Vindo a Lista To-Do!</h1>
        <img alt="logo" src="../assets/imgs/list2.svg" />
      </b-row>
    </b-container>
    <b-form @submit.prevent="save" class="mb-5">
      <input id="task-id" type="hidden" v-model="task.id" />
      <b-row align-h="center">
        <b-col md="6" sm="12">
          <b-form-input
            id="task-name"
            type="text"
            v-model="task.name"
            required
            :readonly="mode === 'remove'"
            placeholder="Digite sua Tarefa"
          />
        </b-col>
      </b-row>
      <b-row align-h="center" class="mt-3">
        <b-col md="6" sm="12">
          <b-button variant="primary" v-if="mode === 'save'" @click="save">Salvar</b-button>
          <b-button variant="danger" v-if="mode === 'remove'" @click="remove">Excluir</b-button>
          <b-button class="ml-2" @click="reset">Cancelar</b-button>
        </b-col>
      </b-row>
    </b-form>
    <b-container class="table-tasks">
      <b-table hover striped table-variant="light" :busy="isBusy" :items="tasks" :fields="fields">
        <template v-slot:table-busy>
          <div class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>
            <strong>Loading...</strong>
          </div>
        </template>
        <template slot="cell(check)" slot-scope="data">
          <b-form-checkbox v-model="data.item.completed" @change="taskCompleted(data.item)" />
        </template>
        <template slot="cell(actions)" slot-scope="data">
          <b-button
            :disabled="data.item.completed"
            variant="warning"
            @click="loadTask(data.item)"
            class="mr-2"
          >
            <i class="fa fa-pencil"></i>
          </b-button>
          <b-button
            :disabled="data.item.completed"
            variant="danger"
            @click="loadTask(data.item, 'remove')"
          >
            <i class="fa fa-trash"></i>
          </b-button>
        </template>
      </b-table>
    </b-container>
  </div>
</template>

<script>
import { baseApiUrl, showError } from "@/global";
import axios from "axios";

export default {
  name: "ToDoListApi",
  data: function() {
    return {
      isBusy: false,
      mode: "save",
      task: {},
      tasks: [],
      fields: [
        { key: "check", label: "" },
        { key: "id", label: "Código", sortable: true },
        { key: "name", label: "Tarefa", sortable: true },
        {
          key: "completed",
          label: "Situação",
          sortable: true,
          formatter: value => (value ? "Concluída" : "Pendente")
        },
        { key: "actions", label: "Ações" }
      ]
    };
  },
  methods: {
    loadTasks() {
      const url = `${baseApiUrl}/tasks`;
      this.isBusy = true;

      axios.get(url).then(res => {
        this.tasks = res.data;
        this.tasks.map(task =>
          task.completed ? (task._rowVariant = "dark") : null
        );
        this.isBusy = false;
      });
    },

    reset() {
      this.mode = "save";
      this.task = {};
      this.loadTasks();
    },

    save() {
      const method = this.task.id ? "put" : "post";
      const id = this.task.id ? `/${this.task.id}` : "";

      axios[method](`${baseApiUrl}/tasks${id}`, this.task)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },

    remove() {
      const id = this.task.id;

      axios
        .delete(`${baseApiUrl}/tasks/${id}`)
        .then(() => {
          this.$toasted.global.defaultSuccess();
          this.reset();
        })
        .catch(showError);
    },

    loadTask(task, mode = "save") {
      this.mode = mode;
      this.task = { ...task };
      window.scrollTo(0, 0);
    },

    taskCompleted(item) {
      this.task = item;
      this.task.completed = !this.task.completed;

      if (this.task.completed) this.task._rowVariant = "dark";

      this.save();
    }
  },
  mounted() {
    this.loadTasks();
  }
};
</script>

<style>
.header h1 {
  color: #dadada;
  padding: 20px;
}

.header img {
  width: 40px;
}

.table-tasks thead th {
  outline: none;
}
</style>

<template>
    <el-form class="add-record-form" @submit.native.prevent="handleSubmit">
      <el-form-item label="Название">
        <el-input v-model="title" placeholder="Введите название" />
      </el-form-item>
      <el-form-item label="Описание">
        <el-input v-model="description" placeholder="Введите описание" />
      </el-form-item>
      <el-button type="primary" @click="handleSubmit">Добавить</el-button>
    </el-form>
  </template>
  
  <script>
  import { ref } from 'vue';
  
  export default {
    name: 'AddRecordForm',
    emits: ['add-record'],
    setup(_, { emit }) {
      const title = ref('');
      const description = ref('');
  
      const handleSubmit = () => {
        if (title.value && description.value) {
          emit('add-record', { title: title.value, description: description.value });
          title.value = '';
          description.value = '';
        }
      };
  
      return { title, description, handleSubmit };
    },
  };
  </script>
  
  <style lang="less">
  .add-record-form {
    margin-bottom: 20px;
  
    .el-input {
      width: 100%;
    }
  
    .el-button {
      margin-top: 10px;
    }
  }
  </style>
  

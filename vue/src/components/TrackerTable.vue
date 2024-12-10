<template>
    <el-table class="tracker-table" :data="records" border>
      <el-table-column prop="title" label="Название" />
      <el-table-column prop="description" label="Описание" />
      <el-table-column label="Активное время">
        <template #default="{ row }">
          <div v-if="row.isActive">
            {{ formatTime(row.elapsedTime) }}
          </div>
          <div v-else-if="row.sessions.length > 0">
            {{ calculateTotalTime(row.sessions) }}
          </div>
          <div v-else>—</div>
        </template>
      </el-table-column>
      <el-table-column label="Действия">
        <template #default="{ row }">
          <el-button
            v-if="!row.isActive"
            @click="startTracking(row.id)"
            type="success"
          >
            Запустить
          </el-button>
          <el-button
            v-else
            @click="stopTracking(row.id)"
            type="danger"
          >
            Остановить
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </template>
  
  <script>
  export default {
    name: 'TrackerTable',
    props: {
      records: Array,
    },
    emits: ['start-tracking', 'stop-tracking'],
    setup(props, { emit }) {
      const startTracking = (id) => emit('start-tracking', id);
      const stopTracking = (id) => {
        const comment = prompt('Введите комментарий:');
        emit('stop-tracking', id, comment || '');
      };
  
      const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes} мин ${remainingSeconds} сек`;
      };
  
      const calculateTotalTime = (sessions) => {
        let total = 0;
        sessions.forEach((session) => {
          if (session.start && session.end) {
            total += Math.floor((new Date(session.end) - new Date(session.start)) / 1000);
          }
        });
        return formatTime(total);
      };
  
      return { startTracking, stopTracking, formatTime, calculateTotalTime };
    },
  };
  </script>
  
  <style lang="less">
  .tracker-table {
    margin-top: 20px;
  }
  </style>
  

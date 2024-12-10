<template>
  <div class="app">
    <h1>Трекер времени</h1>
    <add-record-form @add-record="addRecord" />
    <tracker-table
      :records="records"
      @start-tracking="startTracking"
      @stop-tracking="stopTracking"
    />
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import AddRecordForm from './components/AddRecordForm.vue';
import TrackerTable from './components/TrackerTable.vue';

export default {
  name: 'App',
  components: { AddRecordForm, TrackerTable },
  setup() {
    const records = ref([]);

    const addRecord = (record) => {
      records.value.push({
        ...record,
        id: Date.now(),
        isActive: false,
        sessions: [],
        elapsedTime: 0,
      });
    };

    const startTracking = (id) => {
      const record = records.value.find((r) => r.id === id);
      if (record && !record.isActive) {
        record.isActive = true;
        record.sessions.push({ start: new Date(), end: null, comment: '' });
      }
    };

    const stopTracking = (id, comment) => {
      const record = records.value.find((r) => r.id === id);
      if (record && record.isActive) {
        const session = record.sessions[record.sessions.length - 1];
        session.end = new Date();
        session.comment = comment;
        record.isActive = false;
      }
    };

    const updateElapsedTime = () => {
      records.value.forEach((record) => {
        if (record.isActive) {
          const activeSession = record.sessions.find((s) => !s.end);
          if (activeSession) {
            const elapsed = Math.floor((Date.now() - new Date(activeSession.start)) / 1000);
            record.elapsedTime = elapsed;
          }
        }
      });
    };

    let interval;
    onMounted(() => {
      interval = setInterval(updateElapsedTime, 1000);
    });

    onUnmounted(() => {
      clearInterval(interval);
    });

    return { records, addRecord, startTracking, stopTracking };
  },
};
</script>

<style lang="less">
.app {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}
</style>

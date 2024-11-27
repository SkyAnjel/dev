<template>
  <div>
    <GridField
      :width="600"
      :height="400"
      :dataSets="dataSets"
      :radius="5"
      :gridSize="50"
      :connectPoints="true"
    />
  </div>
</template>

<script>
import GridField from './components/GridField.vue';

export default {
  components: { GridField },
  data() {
    return {
      dataSets: [
        {
          points: [
            { x: 50, y: 50, color: '#FF0000' },
            { x: 150, y: 150, color: '#00FF00' },
            { x: 250, y: 200, color: '#0000FF' },
            { x: 350, y: 300, color: '#FFA500' },
          ],
          lineColor: '#000',
        },
        {
          points: [
            { x: 250, y: 50, color: '#FFFF00' },
            { x: 400, y: 200, color: '#FF00FF' },
            { x: 450, y: 100, color: '#00FFFF' },
            { x: 550, y: 300, color: '#FFA500' },
          ],
          lineColor: '#888',
        },
      ],
    };
  },
};
</script>

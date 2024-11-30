<template>
    <div class="grid-field">
        <h1 class="grid-field__title">SVG График</h1>
    <div class="grid-field__container"></div>
      <svg
        :width="width"
        :height="height"
        class="grid-field__svg"
        @mouseleave="hideTooltip"
      >
        <!-- Сетка -->
        <g class="grid-field__lines">
          <line
            v-for="(x, index) in gridX"
            :key="'x' + index"
            :x1="x"
            :y1="0"
            :x2="x"
            :y2="height"
            class="grid-field__line"
          />
          <line
            v-for="(y, index) in gridY"
            :key="'y' + index"
            :x1="0"
            :y1="y"
            :x2="width"
            :y2="y"
            class="grid-field__line"
          />
        </g>
  
        <!-- Соединительные линии -->
        <g class="grid-field__connections">
          <line
            v-for="(line, index) in connections"
            :key="'line' + index"
            :x1="line.x1"
            :y1="line.y1"
            :x2="line.x2"
            :y2="line.y2"
            :stroke="line.color"
            class="grid-field__connection"
          />
        </g>
  
        <!-- Точки -->
        <g
          v-for="(dataSet, setIndex) in dataSets"
          :key="'dataSet' + setIndex"
          class="grid-field__points"
        >
          <circle
            v-for="(point, index) in dataSet.points"
            :key="'point' + setIndex + '-' + index"
            :cx="point.x"
            :cy="height - point.y"
            :r="radius"
            :fill="point.color"
            class="grid-field__point"
            @mouseenter="(event) => showTooltip(point, event)"
          />
        </g>
      </svg>
  
      <!-- Тултип -->
      <div
        v-if="tooltip.visible"
        class="grid-field__tooltip"
        :style="{ left: tooltip.x + 'px', top: tooltip.y + 'px' }"
      >
        ({{ tooltip.point.x }}, {{ tooltip.point.y }})
      </div>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  
  interface Point {
    x: number;
    y: number;
    color: string;
  }
  
  interface DataSet {
    points: Point[];
    lineColor?: string;
  }
  
  export default defineComponent({
    name: 'GridField',
    props: {
      dataSets: {
        type: Array as () => DataSet[],
        required: true,
        default: () => [],
      },
      width: {
        type: Number,
        required: true,
      },
      height: {
        type: Number,
        required: true,
      },
      radius: {
        type: Number,
        required: true,
      },
      connectPoints: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      gridX() {
        const gridSize = 50;
        return Array.from(
          { length: Math.ceil(this.width / gridSize) },
          (_, i) => i * gridSize
        );
      },
      gridY() {
        const gridSize = 50;
        return Array.from(
          { length: Math.ceil(this.height / gridSize) },
          (_, i) => i * gridSize
        );
      },
      connections() {
        if (!this.connectPoints || !this.dataSets.length) return [];
        // Вычисляем линии для всех наборов данных
        return this.dataSets.flatMap((dataSet) => {
          if (!dataSet.points || dataSet.points.length < 2) return [];
          return this.computeConnections(dataSet.points, dataSet.lineColor);
        });
      },
    },
    methods: {
      computeConnections(points: Point[], color: string | undefined) {
        if (!Array.isArray(points) || points.length < 2) return [];
        return points.slice(0, -1).map((point, index) => ({
          x1: point.x,
          y1: this.height - point.y,
          x2: points[index + 1].x,
          y2: this.height - points[index + 1].y,
          color: color || '#000',
        }));
      },
      showTooltip(point: Point, event: MouseEvent) {
        this.tooltip = {
          visible: true,
          point,
          x: event.clientX + 10,
          y: event.clientY - 20,
        };
      },
      hideTooltip() {
        this.tooltip.visible = false;
      },
    },
    data() {
      return {
        tooltip: {
          visible: false,
          point: { x: 0, y: 0, color: '' },
          x: 0,
          y: 0,
        },
      };
    },
  });
  </script>
  
  <style lang="less">
  .grid-field {
    position: relative;
  
    &__svg {
      border: 1px solid #ccc;
    }
  
    &__lines {
      .grid-field__line {
      stroke: #e0e0e0;
      stroke-width: 1;
    }
  }

  &__connections {
    .grid-field__connection {
      stroke-width: 2;
    }
  }

  &__points {
    .grid-field__point {
      cursor: pointer;
      transition: transform 0.2s ease-in-out;
    }

    .grid-field__point:hover {
      transform: scale(1.2);
    }
  }

  &__tooltip {
    position: absolute;
    background-color: #333;
    color: #fff;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 12px;
    pointer-events: none;
  }
}
</style>

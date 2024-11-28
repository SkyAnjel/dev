<template>
  <div class="grid-field">
    <h1 class="grid-field__title">SVG График</h1>
    <div class="grid-field__container">
      <svg :width="width" :height="height" class="grid-field__svg">
        <!-- Сетка -->
        <g class="grid-field__lines">
          <line
            v-for="x in gridX"
            :key="'x' + x"
            :x1="x"
            :y1="0"
            :x2="x"
            :y2="height"
            class="grid-field__line"
          />
          <line
            v-for="y in gridY"
            :key="'y' + y"
            :x1="0"
            :y1="y"
            :x2="width"
            :y2="y"
            class="grid-field__line"
          />
        </g>

        <!-- Наборы точек и соединительных линий -->
        <g
          v-for="(dataSet, dataSetIndex) in dataSets"
          :key="'dataset' + dataSetIndex"
          class="grid-field__dataset"
        >
          <!-- Соединительные линии -->
          <g v-if="connectPoints" class="grid-field__connections">
            <line
              v-for="(line, index) in computeConnections(dataSet.points)"
              :key="'connection' + dataSetIndex + '-' + index"
              :x1="line.x1"
              :y1="line.y1"
              :x2="line.x2"
              :y2="line.y2"
              :stroke="dataSet.lineColor"
              class="grid-field__connection"
            />
          </g>

          <!-- Точки -->
          <g class="grid-field__points">
            <circle
              v-for="(point, pointIndex) in dataSet.points"
              :key="'point' + dataSetIndex + '-' + pointIndex"
              :cx="point.x"
              :cy="height - point.y"
              :r="radius"
              :fill="point.color"
              class="grid-field__point"
              @mouseenter="showTooltip(point, $event)"
              @mouseleave="hideTooltip"
            />
          </g>
        </g>
      </svg>

      <!-- Координатный тултип -->
      <div
        v-if="tooltip.visible"
        class="grid-field__tooltip"
        :style="{ top: `${tooltip.y}px`, left: `${tooltip.x}px` }"
      >
        {{ tooltip.text }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    dataSets: {
      type: Array,
      required: true,
    },
    radius: {
      type: Number,
      required: true,
    },
    gridSize: {
      type: Number,
      default: 50,
    },
    connectPoints: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      tooltip: {
        visible: false,
        text: '',
        x: 0,
        y: 0,
      },
    };
  },
  computed: {
    gridX() {
      return Array.from(
        { length: Math.ceil(this.width / this.gridSize) },
        (_, i) => i * this.gridSize
      );
    },
    gridY() {
      return Array.from(
        { length: Math.ceil(this.height / this.gridSize) },
        (_, i) => i * this.gridSize
      );
    },
  },
  methods: {
    computeConnections(points) {
      if (points.length < 2) return [];
      return points.slice(1).map((point, index) => ({
        x1: points[index].x,
        y1: this.height - points[index].y,
        x2: point.x,
        y2: this.height - point.y,
      }));
    },
    showTooltip(point, event) {
      this.tooltip = {
        visible: true,
        text: `(${point.x}, ${point.y})`,
        x: event.clientX + 10,
        y: event.clientY - 10,
      };
    },
    hideTooltip() {
      this.tooltip.visible = false;
    },
  },
};
</script>

<style lang="less">
@grid-line-color: #e0e0e0;
@point-stroke-color: #555;
@tooltip-bg-color: #333;
@tooltip-text-color: #fff;
@tooltip-padding: 6px;
@tooltip-radius: 4px;

.grid-field {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fafafa;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  &__title {
    font-size: 24px;
    color: #333;
    font-family: 'Arial', sans-serif;
    margin-bottom: 20px;
    text-align: center;
  }

  &__container {
    position: relative;
  }

  &__svg {
    background-color: white;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  &__lines {
    .grid-field__line {
      stroke: @grid-line-color;
      stroke-width: 1px;
    }
  }

  &__connections {
    .grid-field__connection {
      stroke-width: 2px;
    }
  }

  &__points {
    .grid-field__point {
      stroke: @point-stroke-color;
      stroke-width: 2px;
      transition: transform 0.2s;
      pointer-events: all;

      &:hover {
        fill: darkorange;
      }
    }
  }

  &__tooltip {
    position: absolute;
    background-color: @tooltip-bg-color;
    color: @tooltip-text-color;
    padding: @tooltip-padding;
    border-radius: @tooltip-radius;
    white-space: nowrap;
    font-size: 12px;
    z-index: 10;
    pointer-events: none;
  }
}
</style>

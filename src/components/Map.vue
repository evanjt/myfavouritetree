<template>
  <div class="map">
    <div class="map-inner">
      <h3>This is the placeholder for the map</h3>
      <p>
        Current selected menu entry: <b>{{ activeEntry }}</b>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    activeEntry: String
  }
};
</script>

<style scoped>
.map {
  background-color: rgba(255, 255, 255, 0.1);
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>

<template>
  <div class="menu">
    <div class="vl">
      <vl-map :load-tiles-while-animating="true" :load-tiles-while-interacting="true" data-projection="EPSG:3857" class="vl-map" ref="vl-map">
        <vl-view :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation" class="vl-view" ref="vl-view"></vl-view>

        <!-- European countries map -- Always visible-->
        <vl-layer-group id="layer-group" :z-index="20">
          <vl-layer-vector id="countries" :visible="true" :z-index="21">
          <vl-source-vector :url="urlFunction_countries"/>
            <vl-style-box>
                <vl-style-fill color="brown"></vl-style-fill>
                <vl-style-stroke :color="[0, 20, 80]" :width="4"></vl-style-stroke>
            </vl-style-box>
          </vl-layer-vector>
        </vl-layer-group>

        <!-- countries interaction -->
        <vl-interaction-select v-if="activeLayerIds.includes('countries')" :condition="singleClick" :features.sync="selectedFeatures">
        </vl-interaction-select>
        <h3 v-for="feature in selectedFeatures" :key="feature.id">
            <center>Selected country: {{ updateMap(feature)[0] }} </center>
            <center>Number of trees: {{ updateMap(feature)[1] }} </center>
        </h3>
      </vl-map>
    </div>
  </div>
</template>


<script>
import { singleClick, pointerMove } from "ol/events/condition";

export default {
  props: {
    menuEntries: Array,
    activeEntries: Array,
    activeBasemapId: String,
    activeLayerIds: Array
  },
  data() {
    return {
      baseUrl:
      process.env.NODE_ENV === "development" ? "http://carto19.ethz.ch" : "",
      center: [951000, 6002000],
      zoom: 3,
      rotation: 0,
      activeTree: false,
      hoveredFeatures: [],
      selectedFeatures: []
    };
  },
    computed: {
    singleClick() {
      return singleClick;
    },
    pointerMove() {
      return pointerMove;
    }
  },
  methods: {
    urlFunction_countries(extent, resolution, projection) {
      return (
        "/geoserver/carto3/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=carto3:world_borders&outputFormat=application%2Fjson" +
        "&srsname=" +
        projection +
        "&bbox=" +
        extent.join(",") +
        "," +
        projection
      );},

      // Tell the main map which country is actively clicked
      // and then update the menu to say which country
      updateMap: function(feature) {
        this.selectedCountry = feature.properties.NAME;
        this.treeCount = feature.properties.count;
        this.$eventHub.$emit('country-change', this.selectedCountry);
        return [this.selectedCountry, this.treeCount];
      }
  }
};
</script>

<style scoped>
.menu {
  background-color: rgba(255, 255, 255, 0.05);
  width: 100%;
  height: 80%;
  position: relative;
}

.vl,
.vl-map {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}

.menu ul {
  list-style-type: none;
}
.menu ul li {
  line-height: 1.5em;
}
.active-entry {
  list-style-type: square;
}
.active-entry span {
  font-weight: bold;
}
</style>

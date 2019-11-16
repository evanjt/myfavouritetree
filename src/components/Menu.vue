<template>
  <div class="menu">
    <ul>
      <li
        v-for="entry in menuEntries"
        :key="entry.id"
        :class="{ 'active-entry': activeEntries.includes(entry.id) }"
      >
        <a href="#" @click.prevent="entryCliked(entry)">
          <span>{{ entry.title }}</span>
        </a>
      </li>
    </ul>
    <div class="vl">
      <vl-map :load-tiles-while-animating="true" :load-tiles-while-interacting="true" data-projection="EPSG:3857" class="vl-map" ref="vl-map">
        <vl-view :zoom.sync="zoom" :center.sync="center" :rotation.sync="rotation" class="vl-view" ref="vl-view"></vl-view>

        <!-- base maps -->
        <vl-layer-group id="base-group" :z-index="10">
          <vl-layer-tile id="pk25komb" :visible="activeBasemapId === 'PKomb'" :z-index="11" >
            <vl-source-wms :url="baseUrl + '/geoserver/carto3/wms'" :layers="'carto3:pk25komb_Latest'" ></vl-source-wms>
          </vl-layer-tile>
        </vl-layer-group>

        <!-- layers -->
        <vl-layer-group id="layer-group" :z-index="20">
          <vl-layer-vector id="countries" :visible="activeLayerIds.includes('countries')" :z-index="21">
          <vl-source-vector :url="urlFunction_countries" :strategy-factory="loadingStrategyFactory"/>
            <vl-style-box>
                <vl-style-fill color="brown"></vl-style-fill>
                <vl-style-stroke :color="[0, 20, 80]" :width="4"></vl-style-stroke>
            </vl-style-box>
          </vl-layer-vector>
        </vl-layer-group>

      </vl-map>
    </div>
  </div>

</template>

<script>
import { singleClick, pointerMove } from "ol/events/condition";
import { loadingBBox } from "vuelayers/lib/ol-ext";

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
      zoom: 4,
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
    },
  },
  methods: {
    entryCliked(entry) {
      this.$emit("activeEntryChanged", entry.id);
    },
    urlFunction_countries(extent, resolution, projection) {
      return (
        "/geoserver/carto3/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=carto3:world_borders&outputFormat=application%2Fjson" +
        "&srsname=" +
        projection +
        "&bbox=" +
        extent.join(",") +
        "," +
        projection
      );}
  }
};
</script>

<style scoped>
.map {
  background-color: rgba(255, 255, 255, 0.1);
  width: 100%;
  height: 100%;
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

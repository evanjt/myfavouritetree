<template>
  <div class="map">
    <div class="vl">
      <vl-map
        :load-tiles-while-animating="true"
        :load-tiles-while-interacting="true"
        data-projection="EPSG:3857"
        class="vl-map"
        ref="vl-map"
      >
        <vl-view
          :zoom.sync="zoom"
          :center.sync="center"
          :rotation.sync="rotation"
          class="vl-view"
          ref="vl-view"
        ></vl-view>

        <!-- base maps -->
        <vl-layer-group id="base-group" :z-index="10">
          <vl-layer-tile
            id="pk25komb"
            :visible="activeBasemapId === 'PKomb'"
            :z-index="11"
          >
            <vl-source-wms
              :url="baseUrl + '/geoserver/carto3/wms'"
              :layers="'carto3:pk25komb_Latest'"
            ></vl-source-wms>
          </vl-layer-tile>
          <vl-layer-image
            id="image"
            :visible="activeBasemapId === 'PKrel'"
            :z-index="12"
          >
            <vl-source-image-static
              :url="baseUrl + 'data/pk25krel.png'"
              :size="[1770, 1722]"
              :extent="[947616.2032, 5998318.4717, 954233.3099, 6004597.5617]"
            ></vl-source-image-static>
          </vl-layer-image>
          <vl-layer-tile
            id="basemap"
            :visible="activeBasemapId === 'Hydro'"
            :z-index="13"
          >
            <vl-source-wms
              :url="baseUrl + '/geoserver/carto3/wms'"
              :layers="'carto3:basemap'"
            ></vl-source-wms>
          </vl-layer-tile>
          <vl-layer-tile
            id="osm"
            :visible="activeBasemapId === 'OSM'"
            :z-index="14"
          >
            <vl-source-osm></vl-source-osm>
          </vl-layer-tile>
        </vl-layer-group>

        <!-- layers -->
        <vl-layer-group id="layer-group" :z-index="20">
          <vl-layer-vector
            id="countries"
            :visible="activeLayerIds.includes('countries')"
            :z-index="21"
          >
          <vl-source-vector
              :url="urlFunction_countries"
              :strategy-factory="loadingStrategyFactory"
            />
            <vl-style-box>
                <vl-style-fill color="brown"></vl-style-fill>
                <vl-style-stroke
                  :color="[0, 20, 80]"
                  :width="4"
                ></vl-style-stroke>
            </vl-style-box>
          </vl-layer-vector>

          <!-- trees WFS layer -->
          <vl-layer-vector
            id="trees"
            :visible="activeLayerIds.includes('trees')"
            :z-index="22"
          >
            <vl-source-vector
              :url="urlFunction"
              :strategy-factory="loadingStrategyFactory"
            />
            <vl-style-box>
              <vl-style-circle :radius="10">
                <vl-style-fill color="lightblue"></vl-style-fill>
                <vl-style-stroke
                  :color="[0, 0, 255]"
                  :width="2"
                ></vl-style-stroke>
              </vl-style-circle>
            </vl-style-box>
          </vl-layer-vector>
        </vl-layer-group>

        <!-- trees interactions -->
        <vl-interaction-select
          v-if="activeLayerIds.includes('trees')"
          :layers="['trees']"
          :features.sync="hoveredFeatures"
          :hit-tolerance="10"
          :condition="pointerMove"
        >
          <vl-style-box>
            <vl-style-circle :radius="10">
                <vl-style-fill color="red"></vl-style-fill>
                <vl-style-stroke
                  :color="[0, 0, 255]"
                  :width="2"
                ></vl-style-stroke>
              </vl-style-circle>
          </vl-style-box>
        </vl-interaction-select>

        <vl-interaction-select
          v-if="activeLayerIds.includes('trees')"
          :layers="['trees']"
          :features.sync="selectedFeatures"
          :hit-tolerance="10"
          :condition="singleClick"
        >
        // Make the point green when clicked
          <vl-style-box>
            <vl-style-circle :radius="10">
                <vl-style-fill color="green"></vl-style-fill>
                <vl-style-stroke
                  :color="[0, 0, 255]"
                  :width="2"
                ></vl-style-stroke>
              </vl-style-circle>
          </vl-style-box>
        </vl-interaction-select>



        <!-- countries interaction -->

        <vl-interaction-select
          v-if="activeLayerIds.includes('countries')"
          :layers="['countries']"
          :hit-tolerance="10"
          :condition="singleClick"
        >
        <li v-for="country in trees" :key="COUNTRY">

            <vl-style-box>
                <vl-style-circle :radius="10">
                    <vl-style-fill color="green"></vl-style-fill>
                    <vl-style-stroke
                    :color="[0, 0, 255]"
                    :width="2"
                    ></vl-style-stroke>
                </vl-style-circle>
          </vl-style-box>
            <div v-if="country.properties.COUNTRY == selectedFeature.properties.NAME" class="tree-active">
            </div>

        </li>

        </vl-interaction-select>

      </vl-map>
    </div>
    <!-- trees information box -->
    <div
      v-if="activeLayerIds.includes('trees') && (selectedFeatures.length > 0 || hoveredFeatures.length > 0)"
      class="trees-box"
    >
      <div v-if="selectedFeatures.length > 0" class="trees-box-inner">
        <h4>Selected Features:</h4>
        <ul>
          <li v-for="feature in selectedFeatures" :key="feature.id">
            <b>{{feature.properties.baumnamede}}</b> ({{feature.properties.baumnummer}})<br>
            Species: {{feature.properties.baumgattun}} {{feature.properties.baumartlat}}<br>
            Category: {{feature.properties.kategorie}}<br>
            Locale: {{feature.properties.quartier}}<br>
            Associated European country: {{feature.properties.COUNTRY}}
          </li>
        </ul>
      </div>
      <div v-if="hoveredFeatures.length > 0" class="trees-box-inner">
        <h4>Hovered Features:</h4>
        <ul>
          <li v-for="feature in hoveredFeatures" :key="feature.id">
            <b>{{feature.properties.baumnamede}}</b> ({{feature.properties.baumnummer}})<br>
            Species: {{feature.properties.baumgattun}} {{feature.properties.baumartlat}}<br>
            Category: {{feature.properties.kategorie}}<br>
            Locale: {{feature.properties.quartier}}<br>
            Associated European country: {{feature.properties.COUNTRY}}
          </li>
        </ul>
      </div>
    </div>


  <!-- countries -->
  </div>
  </div>
</template>

<script>
import { singleClick, pointerMove } from "ol/events/condition";
import { loadingBBox } from "vuelayers/lib/ol-ext";

export default {
  props: {
    activeBasemapId: String,
    activeLayerIds: Array
  },
  data() {
    return {
      baseUrl:
      process.env.NODE_ENV === "development" ? "http://carto19.ethz.ch" : "",
      center: [951000, 6002000],
      zoom: 16,
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
    urlFunction(extent, resolution, projection) {
      return (
        "/geoserver/carto3/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=carto3%3ABaumkataster&outputFormat=application%2Fjson" +
        "&srsname=" +
        projection +
        "&bbox=" +
        extent.join(",") +
        "," +
        projection
      );
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
      );
    },
    loadingStrategyFactory() {
      return loadingBBox;
    },
    resize() {
      if (
        this.$refs["vl-map"] &&
        this.$refs["vl-map"].updateSize &&
        this.$refs["vl-map"].$map
      ) {
        this.$refs["vl-map"].updateSize();
      }
    },
    treeActive: function() {
        this.setAttribute("class", "tree-active");
    }
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

.trees-box {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(255, 255, 255, 0.9);
  color: black;
  pointer-events: none;
}

.trees-box-inner {
  margin: 0 50px;
}

.tree-active {
  color: red;
}

.tree-disabled {
  color: white;
}

.transparent {
   background-color: white!important;
   opacity: 0.65;
   border-color: transparent!important;
 }
</style>

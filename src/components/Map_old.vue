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
        <vl-layer-group id="base-group" :z-idnex="10">
          <vl-layer-tile
            id="pk25komb"
            :visible="activeBasemapId === 'PKomb'"
            :z-idnex="11"
          >
            <vl-source-wms
              :url="baseUrl + '/geoserver/carto3/wms'"
              :layers="'carto3:pk25komb_Latest'"
            ></vl-source-wms>
          </vl-layer-tile>
          <vl-layer-image
            id="image"
            :visible="activeBasemapId === 'PKrel'"
            :z-idnex="12"
          >
            <vl-source-image-static
              :url="'data/pk25krel.png'"
              :size="[1770, 1722]"
              :extent="[947616.2032, 5998318.4717, 954233.3099, 6004597.5617]"
            ></vl-source-image-static>
          </vl-layer-image>
          <vl-layer-tile
            id="basemap"
            :visible="activeBasemapId === 'Hydro'"
            :z-idnex="13"
          >
            <vl-source-wms
              :url="baseUrl + '/geoserver/carto3/wms'"
              :layers="'carto3:basemap'"
            ></vl-source-wms>
          </vl-layer-tile>
          <vl-layer-tile
            id="osm"
            :visible="activeBasemapId === 'OSM'"
            :z-idnex="14"
          >
            <vl-source-osm></vl-source-osm>
          </vl-layer-tile>
        </vl-layer-group>

        <!-- layers -->
        <vl-layer-group id="layer-group" :z-idnex="20">
        <vl-layer-vector
            id="trees"
            :visible="activeLayerIds.includes('trees')"
            :z-idnex="21"
          >
            <vl-source-vector
              :url="urlFunction"
              :strategy-factory="loadingStrategyFactory"
            />
            <vl-style-box>
              <vl-style-stroke
                color="red"
                :width="10"
              />
            </vl-style-box>
        </vl-layer-vector>



          <vl-layer-tile
            id="rivers"
            :visible="activeLayerIds.includes('countries')"
            :z-idnex="22"
          >
            <vl-source-wms
              :url="baseUrl + '/geoserver/carto3/wms'"
              :layers="'carto3:world_borders'"
            ></vl-source-wms>
          </vl-layer-tile>
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
            <vl-style-stroke color="yellow" :width="10"></vl-style-stroke>
          </vl-style-box>
        </vl-interaction-select>
        <vl-interaction-select
          v-if="activeLayerIds.includes('trees')"
          :layers="['trees']"
          :features.sync="selectedFeatures"
          :hit-tolerance="10"
          :condition="singleClick"
        >
          <vl-style-box>
            <vl-style-stroke color="green" :width="10"></vl-style-stroke>
          </vl-style-box>
        </vl-interaction-select>

      </vl-map>
      <!-- trees information box -->
    <div
      v-if="activeLayerIds.includes('trees') && (selectedFeatures.length > 0 || hoveredFeatures.length > 0)"
      class="trees-box"
    >
      <div v-if="selectedFeatures.length > 0" class="trees-box-inner">
        <h4>Selected Features:</h4>
        <ul>
          <li v-for="feature in selectedFeatures" :key="feature.id">
            <b>{{feature.id}} {{feature.properties.NAME}}</b>
            (Gewässerlaufnummer: {{feature.properties.GWL_NR}})
          </li>
        </ul>
      </div>
      <div v-if="hoveredFeatures.length > 0" class="trees-box-inner">
        <h4>Hovered Features:</h4>
        <ul>
          <li v-for="feature in hoveredFeatures" :key="feature.id">
            <b>{{feature.id}} {{feature.properties.NAME}}</b>
            (Gewässerlaufnummer: {{feature.properties.GWL_NR}})
          </li>
        </ul>
      </div>
    </div>
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
  computed: {
    singleClick() {
      return singleClick;
    },
    pointerMove() {
      return pointerMove;
    }
  },

  data() {
    return {
      layers: [
        {
            id: 'trees',
            title: 'Trees (WFS)',
            cmp: 'vl-layer-vector',
            visible: false,
            renderMode: 'image',
            source: {
              cmp: 'vl-source-vector',
              features: [],
              url () {
                return 'http://carto19.ethz.ch/geoserver/carto3/wfs/?service=WFS&version=1.1.0&request=GetFeature&typename=carto3:Baumkataster'
              },
               strategyFactory () {
                 return loadingBBox
               },
            },
        }
      ],
      baseUrl:
        process.env.NODE_ENV === "development" ? "http://carto19.ethz.ch" : "",
      center: [951000, 6002000],
      zoom: 16,
      rotation: 0
    };
  },
  created() {
    this.resetWell();
  },
  methods: {
    resize() {
      if (
        this.$refs["vl-map"] &&
        this.$refs["vl-map"].updateSize &&
        this.$refs["vl-map"].$map
      ) {
        this.$refs["vl-map"].updateSize();
      }
    },
  },
    urlFunction(extent, resolution, projection) {
      return (
        "http://carto19.ethz.ch/geoserver/carto19/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=carto19:Baumkataster&outputFormat=application%2Fjson" +
        "&srsname=" +
        projection +
        "&bbox=" +
        extent.join(",") +
        "," +
        projection
      );
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

</style>

<template>
  <div class="map">

    <div class="vl-map">

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
          <vl-layer-tile
            id="osm"
            :visible="activeBasemapId === 'OSM'"
            :z-index="14"
          >
            <vl-source-osm></vl-source-osm>
          </vl-layer-tile>

          <!-- trees WFS layer -->
        <vl-layer-group>
          <vl-layer-vector id="trees" :visible="activeLayerIds.includes('trees')" :z-index="22">
            <vl-source-vector :url="urlFunction" :strategy-factory="loadingStrategyFactory" />
            <vl-style-func :factory="treesStyleFunc" />
          </vl-layer-vector>
        </vl-layer-group>

        <!-- trees interactions -->
        <vl-interaction-select
          v-if="activeLayerIds.includes('trees')" :layers="['trees']" :features.sync="hoveredFeatures" :hit-tolerance="10" :condition="pointerMove">
          <vl-style-box>
            <vl-style-circle :radius="10">
                <vl-style-fill color="red"></vl-style-fill>
                <vl-style-stroke :color="[0, 0, 255]" :width="2"></vl-style-stroke>
              </vl-style-circle>
          </vl-style-box>
        </vl-interaction-select>

        <vl-interaction-select v-if="activeLayerIds.includes('trees')" :layers="['trees']" :features.sync="selectedFeatures" :hit-tolerance="10" :condition="singleClick">
          <vl-style-box>
            <vl-style-circle :radius="10">
                <vl-style-fill color="green"></vl-style-fill>
                <vl-style-stroke :color="[0, 0, 255]" :width="2"></vl-style-stroke>
              </vl-style-circle>
          </vl-style-box>
        </vl-interaction-select>
      </vl-map>
    </div>

    <!-- trees information box -->
    <div v-if="activeLayerIds.includes('trees') && (selectedFeatures.length > 0 || hoveredFeatures.length > 0)" class="trees-box">
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
  </div>
</template>

<script>
import { singleClick, pointerMove } from "ol/events/condition";
import { loadingBBox, createStyle } from "vuelayers/lib/ol-ext";

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
      zoom: 13,
      rotation: 0,
      activeTree: false,
      hoveredFeatures: [],
      selectedFeatures: [],
      countryName: ''

    };
  },
  computed: {
    singleClick() {
      return singleClick;
    },
    pointerMove() {
      return pointerMove;
    },
    treesStyleFunc () {
      // we read selectedCountries here in order to restyle the features when selectedCountries changes
      // (see https://github.com/ghettovoice/vuelayers/issues/68#issuecomment-404223423 for more information)
      //       this.selectedCountries
      // Thanks for your help, Michael!!
      this.countryName
      // the actual styling function factory
      return () => {
        // the default circleStyle that will be used by all visible features
        const circleStyle = [createStyle({
          imageRadius: 10,
          strokeColor: [0, 0, 255],
          strokeWidth: 2,
          fillColor: "lightblue",
        })];
        return (feature) => {
          // check if features should be filtered based on countryName
          if(this.countryName && this.countryName.length > 0) {
            const uniqueSelectedCountryNames = this.countryName;
            if(uniqueSelectedCountryNames.includes(feature.values_.COUNTRY)) {
              // features that matches countryName get the feafult circleStyle
              return circleStyle;
            } else {
              // all other featres get an empty style (invisible)
              return [];
            }
          } else {
            return circleStyle;
          }
        }
      }
    },
  },
  created() {
    this.$eventHub.$on('country-change', this.changeCountry);
  },
  methods: {
    // Set the selected country name
    changeCountry(country) {
        this.countryName = country;
    },
    urlFunction(extents, resolution, projection) {
      return (
        "/geoserver/carto3/ows?service=WFS&version=1.1.0&request=GetFeature&typeName=carto3%3ABaumkataster&outputFormat=application%2Fjson" +
        "&srsname=" +
        projection
      );
    },
    loadingStrategyFactory() {
        return loadingBBox;
    },
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
</style>

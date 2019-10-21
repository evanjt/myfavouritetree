<template>
  <div id="app">
    <div class="layout">
      <div class="layout-header">
        <Banner :title="title">
          <img alt="ETH Logo" src="./assets/ethz_logo_white.svg" />
        </Banner>
      </div>
      <div class="layout-body">
        <section class="layout-content">
          <Map
            :activeBasemapId="activeBasemapId"
            :activeLayerIds="activeLayerIds"
            ref="map"
          />
        </section>
        <div class="layout-sidebar-1 hg-sidebar">
          <h3>Layers:</h3>
          <Menu
            :menuEntries="layers"
            :activeEntries="activeLayerIds"
            @activeEntryChanged="activeLayerChanged"
          />
          <h3>Basemaps:</h3>
          <Menu
            :menuEntries="basemaps"
            :activeEntries="[activeBasemapId]"
            @activeEntryChanged="activeBasemapChanged"
          />
        </div>
        <transition
          name="slide-fade"
          v-on:enter="resizeMap"
          v-on:after-leave="resizeMap"
        >
        </transition>
      </div>

      <div class="layout-footer">
        <p>&copy; 2019 ETH Zürich</p>
      </div>
    </div>
  </div>
</template>

<script>
import Banner from "./components/Banner.vue";
import Menu from "./components/Menu.vue";
import Map from "./components/Map.vue";

export default {
  name: "app",
  components: {
    Banner,
    Menu,
    Map
  },
  data() {
    return {
      title: "MyFavouriteTree Zürich",
      layers: [
        {
          id: "trees",
          title: "Trees (WMS)"
        },
        {
          id: "countries",
          title: "Worldwide countries (WMS)"
        }
      ],
      activeLayerIds: [],
      basemaps: [
        {
          id: "PKomb",
          title: "Pixel Map without Relief (WMS)"
        },
        {
          id: "PKrel",
          title: "Pixel Map with Relief (IMAGE)"
        },
        {
          id: "Hydro",
          title: "Lakes and Rivers on Pixel Map (WMS - Combined)"
        },
        {
          id: "OSM",
          title: "OpenStreetMap (WMTS)"
        }
      ],
      activeBasemapId: null
    };
  },
  created() {
    // set first base map id as activeBasemapId
    this.activeBasemapId = this.basemaps[0].id;
    // add id of first layer to activeLayerIds
    this.activeLayerIds.push(this.layers[0].id);
  },
  methods: {
    activeBasemapChanged(basemapId) {
      this.activeBasemapId = basemapId;
    },
    activeLayerChanged(layerId) {
      this.activeLayerIds.includes(layerId)
        ? this.activeLayerIds.splice(this.activeLayerIds.indexOf(layerId), 1)
        : this.activeLayerIds.push(layerId);
    },
    resizeMap() {
      this.$refs["map"].resize();
    }
  }
};
</script>

<style>
* {
  box-sizing: border-box;
}

html,
body {
  margin: 0;
  padding: 0;
}

body {
  background-color: #006837;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #ffff;
}

a {
  color: #ffff;
}

a:hover {
  color: #0069b4;
}

.layout .layout-header,
.layout .layout-footer,
.hg-sidebar,
.layout-content {
  padding: 1em;
}
.layout .layout-header,
.layout .layout-footer {
  background: rgba(255, 255, 255, 0);
}
.hg-sidebar {
  margin-left: 1em;
  min-width: 500px;
}
.layout-footer {
  text-align: right;
}

.layout {
  min-height: 100vh;
  overflow-x: hidden;
}
.layout,
.layout-body {
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
}
.layout-content {
  flex: 1 1 auto;
}
@media (min-width: 768px) {
  .layout-sidebar-1 {
    order: -1;
  }
  .layout-body {
    flex-direction: row;
  }
  .hg-sidebar {
    flex: 0 0 260px;
  }
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 1s ease;
}
.slide-fade-leave-active {
  transform: translate(-100%, 0);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translate(100%, 0);
}
</style>

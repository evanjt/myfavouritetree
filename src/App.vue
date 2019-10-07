<template>
  <div id="app">
    <div class="layout">
      <div class="layout-header">
        <Banner :title="title">
        </Banner>
      </div>
      <div class="layout-body">
        <section class="layout-content">
          <Map :activeEntry="activeEntry" />
        </section>
        <div class="layout-sidebar-1 hg-sidebar">
          <Menu
            :menuEntries="menuEntries"
            :activeEntry="activeEntry"
            @activeEntryChanged="activeEntryChanged"
          />
        </div>
        <!--
          <div class="layout-sidebar-2 hg-sidebar">
            <p>Sidebar Right</p>
          </div>
        -->
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
      menuEntries: ["alpha", "beta", "gamma", "delta", "epsilon"],
      activeEntry: null
    };
  },
  created() {
    this.activeEntry = this.menuEntries[0];
  },
  methods: {
    activeEntryChanged(entry) {
      this.activeEntry = entry;
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
.layout .layout-header {
  text-align: right;
  height: 10vh;
}
.layout .layout-footer {
  background: rgba(255, 255, 255, 0);
}
.hg-sidebar {
  margin-left: 1em;
}
.layout-footer {
  text-align: right;
}

.layout {
  min-height: 100vh;
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
</style>

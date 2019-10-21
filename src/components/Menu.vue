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
  </div>
</template>

<script>
export default {
  props: {
    menuEntries: Array,
    activeEntries: Array
  },
  methods: {
    entryCliked(entry) {
      this.$emit("activeEntryChanged", entry.id);
    }
  }
};
</script>

<style scoped>
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

<template>
  <div class="menu">
    <ul>
      <li v-for="entry in menuEntries" :key="entry">
        <a href="#" @click.prevent="entryCliked(entry)">
          <span :class="{ 'active-entry': entry === activeEntry }">{{entry}}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    menuEntries: Array,
    activeEntry: String
  },
  methods: {
    entryCliked(entry) {
      this.$emit("activeEntryChanged", entry);
    }
  }
};
</script>

<style scoped>
.active-entry {
  font-weight: bold;
}
</style>

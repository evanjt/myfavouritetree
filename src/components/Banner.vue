<template>
  <div class="banner">
    <div class="bannerInner">
      <div class="title">
        <h2>{{ title }}</h2>
      </div>
      <div class="logo">
        <slot />
      </div>
      <br style="clear:both" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String
  }
};
</script>

<style scoped>
.banner {
  width: 100%;
}

.bannerInner {
  padding: 1em;
}

.title {
  float: left;
}

.title h2 {
  margin: 0;
  padding: 0;
}

.logo {
  float: right;
}
</style>

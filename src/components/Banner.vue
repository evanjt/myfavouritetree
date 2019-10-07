<template>
  <div class="banner">
    <div class="bannerInner">
      <div class="title">
        <h2>{{ title }}</h2>
      </div>
      <div class="logo">
        <img alt="Tree logo" height="60px" width=auto src="../assets/tree-green.png">
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
  padding: 0em;
}

.title {
  float: left;
}

.title h2 {
  margin: 10;
  padding: 0;
  font-family: "Monospace";
}

.logo {
  position: relative;
  float: right;
  top: 0px;
}
</style>

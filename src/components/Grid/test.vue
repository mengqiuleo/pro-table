<script lang="ts" setup>
import Grid from './index.vue';
import GridItem from './components/GridItem.vue';
</script>

<template>
  <Grid>
    <GridItem>
      <div class="item">1312</div>
    </GridItem>
    <GridItem>
      <div class="item">1312</div>
    </GridItem>
    <GridItem suffix>
      <div class="suffix">suffix</div>
    </GridItem>
    <GridItem>
      <div class="item">1312</div>
    </GridItem>
    <GridItem>
      <div class="item">1312</div>
    </GridItem>
    <GridItem>
      <div class="item">1312</div>
    </GridItem>
  </Grid>
</template>

<style scoped>
.item {
  border: 1px solid black;
  width: 200px;
  height: 100px;
}
.suffix {
  border: 1px solid goldenrod;
  width: 300px;
  height: 100px;
}
</style>
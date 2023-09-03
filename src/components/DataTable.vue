<template>
  <div class="table-wrapper">
    <p class="px-5 mt-2 bg-grey-lighten-4">Total results (20)</p>
    <v-data-table-virtual
      :headers="headers"
      :items="resultData"
      class="elevation-1"
      height="400"
      :item-value=pk
      :fixed-header=true
    ></v-data-table-virtual>
  </div>
</template>
<script setup>
import { useDataSources } from '@/composables/dataSources'

const { pk, resultData, headers } = useDataSources()
</script>
<style scoped>
  .table-wrapper {
    max-width: 100%;
    overflow: hidden;
    height: 100%;
  }
  .bg-grey-lighten-4 {
    font-size: 12px;
  }
</style>

<template>
  <v-data-table-virtual
    :headers="headers"
    :items="resultData"
    class="elevation-1"
    height="400"
    :item-value=pk
    :fixed-header=true
  ></v-data-table-virtual>
</template>
<script setup>
import { useDataSources } from '@/composables/dataSources'

const { pk, resultData, headers } = useDataSources()
</script>

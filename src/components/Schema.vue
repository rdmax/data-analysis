<template>
  <v-table fixed-header height="300px">
    <thead>
      <tr>
        <th class="text-left">
          Field name
        </th>
        <th class="text-left">
          Data type
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(value, key) in schema" :key="key">
        <td>{{ key }}</td>
        <td>{{ value }}</td>
      </tr>
    </tbody>
  </v-table>
</template>

<script setup>
import { useDataSources } from '@/composables/dataSources'

const { schema } = useDataSources()
</script>
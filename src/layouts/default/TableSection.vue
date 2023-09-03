<template>
  <v-card>
    <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="left">
      <v-tab value="result">Result</v-tab>
      <v-tab value="schema">Schema</v-tab>
      <v-tab value="charts">Charts</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item value="result">
        <DataTable />
      </v-window-item>
      <v-window-item value="schema">
        <Schema />
      </v-window-item>
      <v-window-item value="charts">
        Charts to be added
      </v-window-item>
    </v-window>
  </v-card>
</template>
<script setup>
import { ref } from 'vue'

import DataTable from '@/components/DataTable.vue'
import Schema from '@/components/Schema.vue'

const tab = ref('')
</script>


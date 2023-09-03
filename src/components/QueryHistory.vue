<template>
  <v-card>
    <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="left">
      <v-tab value="recent">Recent</v-tab>
      <v-tab value="saved">Saved Queries</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item value="recent">
        <v-card class="mx-auto">
          <v-list density="comfortable">
            <v-list-item v-for="(query, i) in [...recentQueries]" :key="i" :value="query" color="primary" @click="recentClicked(query)">
              <v-list-item-title v-text="query"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-window-item>
      <v-window-item value="saved">
        <v-card class="mx-auto">
          <v-list density="comfortable">
            <v-list-item v-for="(query, i) in [...templateQueries]" :key="i" :value="query" color="primary" @click="savedQueryClicked(query)">
              <v-list-item-title v-text="query"></v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-window-item>
    </v-window>
  </v-card>
</template>
<script setup>
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';

import { useSourcesStore } from '@/store/sources';
import connectionsData from '../../static/connections'

const emit = defineEmits(['querySelected']);

const SAVED_TAB = 'saved'
const connectionsStore = useSourcesStore();
const { templateQueries, selectedTable, selectedConnection, selectedDb, recentQueries } = storeToRefs(connectionsStore);
const tab = ref(SAVED_TAB);
const databasesData = connectionsData[selectedConnection.value].databases

function savedQueryClicked(query) {
  connectionsStore.$patch({
    selectedQuery: query
  });
  emit('querySelected');
}
function recentClicked(query) {
  savedQueryClicked(query)
}

watch(selectedTable, (current, old) => {
  const queries = databasesData[selectedDb.value]
    .tables[current]?.queries || []
  const templateQueries = new Set(queries)
  
  connectionsStore.$patch((state) => {
    state.templateQueries = templateQueries
    state.recentQueries.clear()
    state.selectedQuery = ''
  });

  tab.value = SAVED_TAB
}, {
  immediate: true,
})
</script>

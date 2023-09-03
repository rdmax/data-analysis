<template>
  <v-container>
    <v-select v-model="selectedProvider" :items="providers" label="Select Database Provider"></v-select>
    <v-divider></v-divider>
    <v-btn prepend-icon="mdi-plus" block class="my-4">
      Add Database 
      <v-tooltip
        activator="parent"
        location="bottom"
      >Coming soon</v-tooltip>
    </v-btn>
    <v-select v-model="selectedDb" :items="databases" label="Select Database"></v-select>

    <v-text-field v-model="searchQuery" label="Search" placeholder="Search Table..."></v-text-field>
    <v-list dense>
      <v-list-item v-for="table in filteredTables" :key="table.id" @click="handleTableClick(table)" :active="table === selectedTable">
        <v-list-item-title>{{ table }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-container>
</template>
<script setup>
// Should be moved to layout?
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia'

import { useSourcesStore } from '@/store/sources'
import connectionsData from '../../static/connections'

const connectionsStore = useSourcesStore();

const {
  selectedConnection,
  selectedDb,
  selectedTable, // use for preselect?
} = storeToRefs(connectionsStore)

const searchQuery = ref('');
const selectedProvider = ref('MongoDB')
const databasesData = connectionsData[selectedConnection.value].databases
const databases = computed(() => Object.keys(databasesData))
const providers = ref(['MongoDB', 'CouchDB', 'PostgreSQL'])
const tables = computed(() => Object.keys(databasesData[selectedDb.value].tables))
const filteredTables = computed(() => {
  return tables.value.filter(table =>
    searchQuery.value === '' || table.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})

function handleTableClick(name) {
  const queries = databasesData[selectedDb.value].tables[name].queries
  const templateQueries = new Set(queries)
  
  connectionsStore.$patch({
    selectedTable: name,
    templateQueries,
    fakeQueryResults: false
  });
}
// Ramda's pathOr({}, ['selectedConnection.value', 'databases'], connectionsData) NOT Working!
</script>

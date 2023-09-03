<template>
  <v-card>
    <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="left">
      <v-tab value="query">Query Editor</v-tab>
      <v-tab value="ui">UI Editor</v-tab>
    </v-tabs>
    <v-window v-model="tab">
      <v-window-item value="query">
        <br/>
        <v-alert closable :text="queryErrorText" type="error" v-if=showQueryError @click:close=resetQueryAlert></v-alert>
        <br/>
        <v-textarea color="black" label="Sql query" v-model="selectedQuery" autofocus></v-textarea>
        <v-btn prepend-icon="mdi-play" @click="runQuery">
          Run
        </v-btn>
        <v-btn prepend-icon="mdi-play" @click="clearQuery">
          Clear
        </v-btn>
      </v-window-item>
      <v-window-item value="ui">
        <QueryEditorGUI />
      </v-window-item>
    </v-window>
  </v-card>
</template>
<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import QueryEditorGUI from '@/components/QueryEditorGUI.vue'
import { useSourcesStore } from '@/store/sources'
import { watch } from 'vue';

const connectionsStore = useSourcesStore();
const { selectedQuery, fakeQueryResults, selectedTable } = storeToRefs(connectionsStore);

const tab = ref('')
const showQueryError = ref(false)
const queryErrorText = ref('')

function resetQueryAlert() {
  queryErrorText.value = ''
  showQueryError.value = false
}
function addQueryToRecent(query) {
  connectionsStore.$patch((state) => {
    state.recentQueries.add(query)
  })
}
function runQuery() {
  console.log(`Execute query ${selectedQuery.value}`)

  if (!selectedQuery.value.length) {
    queryErrorText.value = 'Query can not be empty'
    showQueryError.value = true

    return
  }

  addQueryToRecent(selectedQuery.value)

  fakeQueryResults.value = true
}
function clearQuery() {
  fakeQueryResults.value = false
  selectedQuery.value = ''
}

watch([selectedQuery, selectedTable], () => {
  resetQueryAlert()
})
</script>

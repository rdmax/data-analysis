<template>
  <v-container fluid class="query-runner">
    <v-row no-gutters>
      <v-col sm="8" cols="12">
        <QueryEditorGUI class="editor-gui" />
      </v-col>
      <v-col sm="4" cols="12">
        <v-textarea color="black" label="Sql query" v-model="selectedQuery" autofocus></v-textarea>
        <v-toolbar height="60px" :elevation="1" rounded="0">
          <template v-slot:prepend>
            <v-btn icon @click="runQuery">
              <v-icon>
                mdi-play
              </v-icon>
              <v-tooltip activator="parent" location="top">Execute</v-tooltip>
            </v-btn>
            <v-btn icon>
              <v-icon>
                mdi-content-save
              </v-icon>
              <v-tooltip activator="parent" location="top">Save (wip)</v-tooltip>
            </v-btn>
            <v-btn icon>
              <v-icon>
                mdi-content-copy
              </v-icon>
              <v-tooltip activator="parent" location="top">Copy (wip)</v-tooltip>
            </v-btn>
            <v-btn icon @click="clearQuery">
              <v-icon>
                mdi-rotate-left
              </v-icon>
              <v-tooltip activator="parent" location="top">Clear</v-tooltip>
            </v-btn>
          </template>
        </v-toolbar>
        <v-alert closable :text="queryErrorText" type="error" v-if=showQueryError @click:close=resetQueryAlert></v-alert>
        <v-card class="my-5">
          <v-list density="compact">
            <v-list-item @click.stop="showHideHistoryDrawer">
              <template v-slot:prepend>
                <v-icon icon="mdi-history"></v-icon>
              </template>
              <v-list-item-title v-text="'Show History'"></v-list-item-title>
              <template v-slot:append>
                <v-icon icon="mdi-menu-right"></v-icon>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <v-navigation-drawer v-model="historyDrawer" location="bottom" temporary>
      <QueryHistory @query-selected="showHideHistoryDrawer" />
    </v-navigation-drawer>
  </v-container>
</template>
<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'

import QueryHistory from '@/components/QueryHistory.vue'
import QueryEditorGUI from '@/components/QueryEditorGUI.vue'
import { useSourcesStore } from '@/store/sources'
import { watch } from 'vue';

const connectionsStore = useSourcesStore();
const { selectedQuery, fakeQueryResults, selectedTable } = storeToRefs(connectionsStore);

const showQueryError = ref(false)
const queryErrorText = ref('')
const historyDrawer = ref(false)

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

function showHideHistoryDrawer() {
  return historyDrawer.value = !historyDrawer.value;
}

watch([selectedQuery, selectedTable], () => {
  resetQueryAlert()
})
</script>
<style>
.query-runner {
  padding: 0;
}

.v-input__details {
  display: none;
}

.editor-gui {
  background: #fefefe;
  max-height: 50vh;
  overflow: hidden;
  overflow-y: auto;
}
</style>

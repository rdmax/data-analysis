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
          <template v-if="$vuetify.display.smAndUp">
            <v-divider class="mx-3 align-self-center" length="24" thickness="2" vertical></v-divider>

            <v-btn icon @click.stop="historyDrawer = !historyDrawer">
              <v-icon>
                mdi-history
              </v-icon>
              <v-tooltip activator="parent" location="top">History</v-tooltip>
            </v-btn>
          </template>
        </v-toolbar>
        <v-alert closable :text="queryErrorText" type="error" v-if=showQueryError @click:close=resetQueryAlert></v-alert>
      </v-col>
    </v-row>
    <v-navigation-drawer v-model="historyDrawer" location="right">
      <QueryHistory />
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
const historyDrawer = ref(true)

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
<style scoped>
.query-runner {
  padding: 0;
}

.query-textarea {
  background: #000;
}

.editor-gui {
  background: #fefefe;
  max-height: 50vh;
  overflow: hidden;
  overflow-y: auto;
}
</style>

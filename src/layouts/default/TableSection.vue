<template>
  <v-card>
    <v-tabs v-model="tab" color="deep-purple-accent-4" align-tabs="left">
      <v-tab value="result">Result</v-tab>
      <v-tab value="schema">Schema</v-tab>
      <v-tab value="charts">Charts</v-tab>
             <v-btn
          variant="plain"
          rounded="0"
          height="100%"
        >
          Share
          <v-dialog v-model="dialog" max-width="500px" activator="parent">
            <v-card>
              <v-card-title>
                Sharable Link to this table
              </v-card-title>
              <v-card-text>
                <div>
                  <v-container>
                  <v-row align="center" class="bg-grey-lighten-3 py-2 mt-1 mb-2">
                    <v-col>
                      <p>{{ dummyLink }}</p>
                    </v-col>
                    <v-col cols="auto">
                      <v-btn flat icon @click="copyLink">
                        <v-icon>
                            mdi-content-copy
                          </v-icon>
                        <v-tooltip
                          activator="parent"
                          location="top"
                        >Copy</v-tooltip>
                      </v-btn>
                    </v-col>
                  </v-row>
                  </v-container>
                </div>
                <p>Add comma separated emails to share this link to:</p>
                <v-text-field
                  v-model="emailList"
                  label="Emails"
                  outlined
                  multi-line
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="cancel" color="error">
                  Cancel
                </v-btn>
                <v-btn color="primary">
                  Submit
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-btn>
        <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                variant="plain"
                rounded="0"
                height="100%"
                v-bind="props"
              >
                Save
                <v-icon end>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>

            <v-list class="bg-grey-lighten-3">
              <v-list-item
                v-for="item in saveOptions"
                :key="item"
              >
                {{ item }}
              </v-list-item>
            </v-list>
          </v-menu>
      <v-menu>
        <template v-slot:activator="{ props }">
          <v-btn variant="plain" rounded="0" height="100%" v-bind="props">
            Export
            <v-icon end>
              mdi-menu-down
            </v-icon>
          </v-btn>
        </template>

        <v-list class="bg-grey-lighten-3">
          <v-list-item v-for="item in exportOptions" :key="item" @click="exportTo(item)">
            {{ item }}
          </v-list-item>
        </v-list>
      </v-menu>
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
import xlsx from "json-as-xlsx"
import csvDownload from 'json-to-csv-export'

import DataTable from '@/components/DataTable.vue'
import Schema from '@/components/Schema.vue'
import { useDataSources } from '@/composables/dataSources'

const { resultData, schema, selectedTable } = useDataSources()

const tab = ref('')
const dialog = ref(false)
const exportOptions = ['csv', 'excel']
const saveOptions = ref(['Save results as new table', 'Save results to other database'])
const rules = ref([])
const dummyLink = ref('https://example.com')
const emailList = ref('')

const cancel = () => {
  dialog.value = false; 
  emailList.value = '';
};

function exportTo(exportType) {
  if (exportType === 'excel') {
    exportExcel()

    return
  }

  if (exportType === 'csv')  {
    exportCSV()

    return
  }
}

async function exportCSV() {
  const dataToConvert = {
    data: resultData.value,
    filename: selectedTable.value,
    delimiter: ',',
    headers:  Object.keys(schema.value)
  }
  const result = await csvDownload(dataToConvert)

  console.log(result)
}

function exportExcel() {
  let data = [
    {
      sheet: selectedTable.value,
      columns: Object.keys(schema.value).map((k) => {
        return { label: k, value: k }
      }),
      content: resultData.value,
    },
  ]

  let settings = {
    fileName: `Exported-${selectedTable.value}`,
    extraLength: 3,
    writeMode: "writeFile",
    writeOptions: {},
    RTL: false,
  }

  xlsx(data, settings)
}
function copyLink() {
  console.log('link copied')
}
</script>

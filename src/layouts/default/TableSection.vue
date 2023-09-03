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
          <v-dialog
            v-model="dialog"
            activator="parent"
            width="auto"
          >
            <v-card>
              <v-form>
              <v-text-field
                :rules="rules"
                label="Enter Comma separated email ids"
              ></v-text-field>
            </v-form>
              <v-card-actions>
                <v-btn color="primary" block @click="dialog = false">Close Dialog</v-btn>
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
                Export
                <v-icon end>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>

            <v-list class="bg-grey-lighten-3">
              <v-list-item
                v-for="item in exportOptions"
                :key="item"
              >
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

import DataTable from '@/components/DataTable.vue'
import Schema from '@/components/Schema.vue'

const tab = ref('')
const dialog = ref(false)
const exportOptions = ref(['csv', 'pdf'])
const rules = ref([])
</script>


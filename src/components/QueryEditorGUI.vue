<template>
  <v-container :disabled="!selectedTable" class="gui-editor">
    <v-form>
      <v-toolbar height="60px" :elevation="1" rounded="0">
        <template v-slot:prepend>
          <h3>Build your query</h3>
        </template>
        <v-divider class="mx-3 align-self-center" length="24" thickness="2" vertical></v-divider>
        <v-btn icon @click="dialog = !dialog">
          <v-icon>
            mdi-application-settings
          </v-icon>
          <v-tooltip activator="parent" location="top">Settings</v-tooltip>
        </v-btn>
      </v-toolbar>
      <v-row justify="space-between" align="center">
        <v-col>
          <h4 class="columns-heading">Columns ({{ selectedColumns.length }})</h4>
        </v-col>
        <v-col cols="auto">
          <v-switch style="height: 60px;" label="Select All Columns" v-model="selectAllColumns"
            @change="selectAllColumnsChanged"></v-switch>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-autocomplete v-model="selectedColumns" :items="columns" item-title="name" label="Select Columns" multiple
            chips></v-autocomplete>
          <v-divider></v-divider>
        </v-col>
      </v-row>
      <v-row justify="space-between">
        <v-col>
          <h4>Filter</h4>
        </v-col>
        <v-col cols="auto">
          <v-btn prepend-icon="mdi-plus" @click="addFilter" size="small" :disabled="!selectedTable">
            Add Filter
          </v-btn>
        </v-col>
      </v-row>
      <v-row v-for="(filter, index) in filters" :key="index" justify="space-between">
        <v-col md="4" sm="12">
          <v-select v-model="filter.column" :items="columns" item-title="name" label="Select Column" return-object
            single-line></v-select>
        </v-col>
        <template v-if="filter.column">
          <v-col md="4" cols="12">
            <v-select v-model="filter.condition" :items="conditions" label="Select condition" item-title="label"
              return-object single-line></v-select>
          </v-col>
          <v-col md="3" cols="12">
            <v-text-field v-model="filter.value" label="Enter value"></v-text-field>
          </v-col>
          <v-col md="1" cols="12">
            <v-btn icon @click="removeFilter(index)" flat>
              <v-icon>
                mdi-delete
              </v-icon>
              <v-tooltip activator="parent" location="top">Delete</v-tooltip>
            </v-btn>
          </v-col>
        </template>
      </v-row>
      <v-divider class="mt-6 mb-6"></v-divider>
      <h4>Sorting</h4>
      <v-select v-model="selectedSortColumn" :items="columns" item-title="name" label="Select Column"
        single-line></v-select>
      <v-radio-group v-model="sortOrder">
        <v-radio label="Ascending" value="asc"></v-radio>
        <v-radio label="Descending" value="desc"></v-radio>
      </v-radio-group>
      <v-divider class="my-6"></v-divider>
      <v-row>
        <v-col>
          <v-btn @click="resetForm">
            Reset
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
    <v-dialog v-model="dialog" max-width="600">
      <v-card>
        <v-card-title>
          Query Editor Settings
          <v-tabs v-model="tab" class="mb-2">
            <v-tab value="env">Environment Variable</v-tab>
          </v-tabs>
        </v-card-title>
        <v-card-text>
          <v-window v-model="tab">
            <v-window-item value="env">
              <v-form>
                <v-select v-model="selectedEnvironment" :items="environments" label="Select Environment"
                  class="mb-4"></v-select>
                <v-text-field v-model="name" label="Name" class="mb-4"></v-text-field>
                <v-text-field v-model="email" label="Email" class="mb-4"></v-text-field>
                <v-text-field v-model="phone" label="Phone" class="mb-4"></v-text-field>
                <v-text-field v-model="city" label="City" class="mb-4"></v-text-field>
              </v-form>
            </v-window-item>
          </v-window>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="dialog = !dialog" color="error">
            Cancel
          </v-btn>
          <v-btn color="primary" @click="dialog = !dialog">
            Submit
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script setup>
import { ref, computed, watch } from 'vue'

import { useDataSources } from '@/composables/dataSources'
import { useSourcesStore } from '@/store/sources'

const connectionsStore = useSourcesStore()
const { schema, selectedTable } = useDataSources()

const selectAllColumns = ref(false)
const selectedColumns = ref([])
const selectedSortColumn = ref('')
const filters = ref([])
const sortOrder = ref('')
const dialog = ref(false)
const tab = ref(null)
const environments = ref(['Production', 'Development', 'Staging'])
const selectedEnvironment = ref(null)
const name = ref(null)
const email = ref(null)
const phone = ref(null)
const city = ref(null)

const conditions = [
  {
    label: 'equal to',
    symbol: '='
  },
  {
    label: 'not equal to',
    symbol: '!='
  }
  ,
  {
    label: 'greater than',
    symbol: '>'
  },
  {
    label: 'greater than equal to',
    symbol: '>='
  },
  {
    label: 'less than',
    symbol: '<'
  },
  {
    label: 'less than equal to',
    symbol: '<='
  }
]

const columns = computed(() => Object.keys(schema.value))
const generatedSqlQuery = computed(() => {
  let query = 'SELECT ';

  if (selectAllColumns.value) {
    query += '* ';
  } else if (selectedColumns.value.length > 0) {
    query += `${selectedColumns.value.join(', ')} `;
  } else {
    query += '* ';
  }

  query += `FROM ${selectedTable?.value}`;

  if (filters.value.length > 0) {
    query += ' WHERE ';
    filters.value.forEach((filter, index) => {
      if (index > 0) {
        query += ' AND ';
      }
      const column = filter.column;
      const condition = filter.condition.symbol;
      const value = filter.value;
      query += `${column} ${condition} '${value}' `;
    });
  }

  if (selectedSortColumn.value && sortOrder.value) {
    query += `ORDER BY ${selectedSortColumn.value} ${sortOrder.value}`;
  }

  return query;
})

function addFilter() {
  filters.value.push({
    column: '',
    condition: '',
    value: '',
  });
}
function removeFilter(index) {
  filters.value.splice(index, 1);
}
function selectAllColumnsChanged() {
  if (selectAllColumns.value) {
    selectedColumns.value = columns.value;
  } else {
    selectedColumns.value = [];
  }
}
function resetForm() {
  selectAllColumns.value = false
  selectedColumns.value = []
  selectedSortColumn.value = ''
  filters.value = []
  sortOrder.value = ''
}

watch(selectedColumns, (newValue) => {
  if (newValue.length !== columns.value.length) {
    selectAllColumns.value = false
  }
}, { immediate: true })
watch(generatedSqlQuery, (newValue, oldValue) => {
  if (oldValue !== newValue) {
    connectionsStore.$patch({
      selectedQuery: `${generatedSqlQuery.value}`
    })
  }
}, {
  flush: 'post'
})
watch(selectedTable, () => {
  resetForm()
}, { immediate: true })
</script>
<style>
.gui-editor .columns-heading {
  line-height: 60px;
}
</style>

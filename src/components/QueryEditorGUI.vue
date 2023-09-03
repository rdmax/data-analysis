<template>
  <v-form>
    <v-container>
      <v-row justify="space-between">
        <v-col>
          <h3>Build your query</h3>
        </v-col>
      </v-row>
      <v-row justify="space-between">
        <v-col>
          <h4>Columns ({{ selectedColumns.length }})</h4>
        </v-col>
        <v-col cols="auto">
          <v-switch label="Select All Columns" v-model="selectAllColumns" @change="selectAllColumnsChanged"></v-switch>
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
          <v-btn prepend-icon="mdi-plus" @click="addFilter" size="small">
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
      <v-row justify="space-between">
        <v-col>
          <v-btn @click="resetForm">
            Reset
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
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

  console.log(query);

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

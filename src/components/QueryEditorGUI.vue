<template>
  <v-card>
    <v-checkbox v-model="selectAllColumns" label="Select All Columns" @change="selectAllColumnsChanged"></v-checkbox>
    <v-autocomplete v-model="selectedColumns" :items="columns" item-title="name" label="Select Columns" multiple
      chips></v-autocomplete>
    <h3>Filter</h3>
    <v-btn @click="addFilter">Add Filter</v-btn>
    <div v-for="(filter, index) in filters" :key="index">
      <v-select v-model="filter.column" :items="columns" item-title="name" label="Select Column" return-object
        single-line></v-select>
      <template v-if="filter.column">
        <v-checkbox v-model="filter.isNull" label="Is Not Null"></v-checkbox>
        <template v-if="!filter.isNull">
          <template v-if="filter.column.type === 'Boolean'">
            <v-radio-group v-model="filter.operator">
              <v-radio label="True" value="true"></v-radio>
              <v-radio label="False" value="false"></v-radio>
            </v-radio-group>
          </template>
          <template v-if="filter.column.type === 'String'">
            <v-text-field v-model="filter.value" label="Filter Value"></v-text-field>
          </template>
          <template v-if="filter.column.type === 'Number'">
            <v-text-field v-model="filter.value" label="Filter Value" type="number"></v-text-field>
          </template>
        </template>
      </template>
    </div>
    <h3>Sorting</h3>
    <v-select v-model="selectedSortColumn" :items="columns" item-title="name" label="Select Column"
      single-line></v-select>
    <v-radio-group v-model="sortOrder">
      <v-radio label="Ascending" value="asc"></v-radio>
      <v-radio label="Descending" value="desc"></v-radio>
    </v-radio-group>
    <h3>Columns to show</h3>
    <v-text-field v-model.number="maxColumns" label="Max Columns"></v-text-field>
    <v-btn @click="generateQuery">Generate Query</v-btn>
    <div style="width: 100%;word-break:break-word">
      <strong>Generated SQL Query:</strong>
      <pre>{{ generatedQuery }}</pre>
    </div>
  </v-card>
</template>
<script>
export default {
  data() {
    return {
      selectedTable: 'product',
      selectAllColumns: false,
      generatedQuery: '',
      selectedColumns: [],
      maxColumns: 1000,
      selectedSortColumn: null,
      filters: [],
      sortOrder: "",
      columns: [{
        name: "column1",
        type: "Boolean"
      },
      {
        name: "column2",
        type: "String"
      },
      {
        name: "column3",
        type: "Number"
      }
      ],
    };
  },
  methods: {
    generateQuery() {
      let query = '';
      if (this.selectedColumns.length === this.columns.length) {
        query = `SELECT * FROM ${this.selectedTable}`;
      } else {
        query = `SELECT ${this.selectedColumns.map(item => item.name).join()} FROM ${this.selectedTable}`;
      }


      if (this.filters.length > 0) {
        query += " WHERE " + this.filters.map((filter) => {
          return `${filter.name} ${filter.operator} '${filter.value}'`;
        }).join(' AND ');
      }

      if (this.sortOrder === "asc") {
        query += ` ORDER BY ${this.selectedSortColumn} ASC`;
      } else if (this.sortOrder === "desc") {
        query += ` ORDER BY ${this.selectedSortColumn} DESC`;
      }

      this.generatedQuery = query;
    },
    addFilter() {
      this.filters.push({ column: null, isNull: false, operator: '=', value: null });
      console.log(this.filters);
    },
    selectAllColumnsChanged() {
      if (this.selectAllColumns) {
        this.selectedColumns = this.columns;
      } else {
        this.selectedColumns = [];
      }
    },
  },
};
</script>

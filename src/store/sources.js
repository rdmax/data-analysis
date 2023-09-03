import { defineStore } from 'pinia'
import { ref } from 'vue'
 
export const useSourcesStore = defineStore('sources', () => {
  const selectedConnection = ref('MySQLProd'); // hardcoded
  const selectedDb = ref('Northwind'); // hardcoded
  const selectedTable = ref('')
  const templateQueries = ref(new Set())
  const recentQueries = ref(new Set())
  const selectedQuery = ref('')
  const fakeQueryResults = ref(false)

  return {
    selectedConnection,
    selectedDb,
    selectedTable,
    templateQueries,
    selectedQuery,
    recentQueries,
    fakeQueryResults,
  }
})

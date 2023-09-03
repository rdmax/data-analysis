import { computed } from 'vue'
import { storeToRefs } from 'pinia'

import { useSourcesStore } from '@/store/sources'
import connectionsData from '../../static/connections'

const connectionsStore = useSourcesStore()
const { selectedTable, selectedConnection, selectedDb, fakeQueryResults } = storeToRefs(connectionsStore)

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
function getTableData() {
    return connectionsData[selectedConnection.value]
        .databases[selectedDb.value].tables[selectedTable.value]
}

export function useDataSources() {
    const schema = computed(() => {
        const tableData = getTableData()

        if (!tableData) {
            return {}
        }

        return getTableData().schema
    })

    const pk = computed(() => getTableData()?.pk)

    const fullData = computed(() => getTableData()?.data || [])

    const resultData = computed(() => fakeQueryResults.value ? fullData.value.slice(0, getRndInteger(30, fullData.value.length / 10)) : fullData.value)

    const headers = computed(() => {
        const tableData = getTableData()

        if (!tableData) {
            return []
        }

        const schema = getTableData().schema

        return Object.keys(schema).map((title, index) => {
            return {
                title,
                align: index === 0 ? 'start' : 'end',
                sortable: false,
                key: title,
            }
        })
    })

    return { schema, pk, fullData, resultData, headers }
}
<template>
  <v-app>
    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>SQL Editor</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn href="https://github.com/rdmax/data-analysis#readme" target="_blank">
        Readme
      </v-btn>
      <v-btn href="https://github.com/rdmax/data-analysis" target="_blank" icon>
        <v-icon>mdi-github</v-icon>
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-navigation-drawer v-model="drawer">
        <AppSidebar />
      </v-navigation-drawer>
      <QuerySection />
      <TableSection />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref } from 'vue'

import AppSidebar from '@/components/AppSidebar.vue'
import QuerySection from './QuerieSection.vue'
import TableSection from './TableSection.vue'

const drawer = ref(true)
</script>

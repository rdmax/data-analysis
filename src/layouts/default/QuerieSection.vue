<template>
  <v-container>
    <v-row no-gutters>
      <v-col>
        <QueryRunner />
      </v-col>
      <v-col cols="4">
        <QueryHistory />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import QueryRunner from '@/components/QueryRunner.vue'
import QueryHistory from '@/components/QueryHistory.vue'
</script>

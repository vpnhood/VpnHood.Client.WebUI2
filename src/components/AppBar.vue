<script setup lang="ts">
import { VpnHoodApp } from '@/services/VpnHoodApp';
import router from '@/services/router';
import { Util } from '@/helpers/Util';

const vhApp = VpnHoodApp.instance;
const props = defineProps<{
  pageTitle: string,
}>();
</script>

<template>
  <!-- Page header -->
  <v-app-bar
    :color="vhApp.isConnectApp() ? 'background' : 'secondary'"
    :flat="vhApp.isConnectApp()"
    density="compact"
    absolute
  >

    <!-- Back button -->
    <v-app-bar-nav-icon
      :icon="Util.getLocalizedLeftChevron()"
      color="white"
      @click="router.go(-1)"
    />

    <!-- Page title -->
    <v-app-bar-title class="text-body-1 text-white ms-0">{{props.pageTitle}}</v-app-bar-title>

  </v-app-bar>
</template>

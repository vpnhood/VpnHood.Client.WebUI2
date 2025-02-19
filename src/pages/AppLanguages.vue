<script setup lang="ts">
import { VpnHoodApp } from '@/services/VpnHoodApp';
import i18n from '@/locales/i18n';
import router from '@/services/router';
import AppBar from "@/components/AppBar.vue";
import {LanguagesCode} from "@/helpers/UiConstants";
import { type IUiCultureInfo } from '@/services/VpnHood.Client.Api';
import { computed, onMounted, ref } from 'vue';

const vhApp = VpnHoodApp.instance;
const locale = i18n.global.t;

const myLocales = ref<IUiCultureInfo[]>([
  {
    code: LanguagesCode.SystemDefault,
    nativeName: locale("SYSTEM_DEFAULT_LANGUAGE", i18n.global.locale.value),
  }
]);

const defaultLanguage = computed<string>({
  get: () => {
    return !vhApp.data.settings.userSettings.cultureCode
      ? LanguagesCode.SystemDefault
      : vhApp.data.settings.userSettings.cultureCode;
  },
  set: async (value: string) => {
    vhApp.data.settings.userSettings.cultureCode = value === LanguagesCode.SystemDefault ? null : value;
    await vhApp.saveUserSetting();
    router.go(0);
  }
});

onMounted(() => {
  const sortedCultureInfos = vhApp.data.cultureInfos.sort((a, b) => a.nativeName.localeCompare(b.nativeName));
  myLocales.value.push(...sortedCultureInfos);
});

</script>

<template>

  <!-- Page header -->
  <AppBar :page-title="locale('LANGUAGE')"/>

  <v-sheet class="pa-4" :color="vhApp.isConnectApp() ? 'primary-darken-2' : 'gray-lighten-6'">

    <v-card :color="vhApp.isConnectApp() ? 'background' : 'white'">
      <v-list
        v-model="defaultLanguage"
        select-strategy="classic"
        bg-color="transparent"
        class="py-0"
        active-class="text-secondary"
      >
        <v-list-item
          v-for="(item, index) in myLocales"
          :key="index"
          :value="item.code"
          :class="[
                vhApp.isConnectApp()
                ? 'border-primary-darken-2 border-opacity-50'
                : 'border-gray-lighten-5 border-opacity-100',
                'border-b'
                ]"
          :active="item.code === defaultLanguage"
          @click="defaultLanguage = item.code"
        >

          <!-- Language name -->
          <v-list-item-title class="text-capitalize">

            <!-- Radio button icon -->
            <span class="me-2">
              <v-icon v-if="item.code === defaultLanguage" icon="mdi-radiobox-marked"/>
              <v-icon v-else icon="mdi-radiobox-blank" class="text-gray-lighten-1"/>
            </span>

            {{ item.nativeName }}

            <!-- System default language name -->
            <span
              v-if="item.code === LanguagesCode.SystemDefault"
              :class="[vhApp.isConnectApp() ? 'text-disabled' : 'text-gray-lighten-2', 'text-caption ms-1']"
            >
              ({{ vhApp.data.state.systemUiCultureInfo.nativeName }})
            </span>
          </v-list-item-title>

          <!-- Show message if the system language does not supported -->
          <p
            dir="ltr"
            v-if="item.code === LanguagesCode.SystemDefault &&
            !myLocales.find(x => x.code === vhApp.data.state.systemUiCultureInfo.code)"
            :class="[vhApp.isConnectApp() ? 'text-disabled' : 'text-gray-lighten-2', 'text-caption']"
          >
            {{ locale("SYSTEM_DEFAULT_LANGUAGE_NOT_SUPPORTED_DESC") }}
          </p>

        </v-list-item>
      </v-list>
    </v-card>

  </v-sheet>
</template>

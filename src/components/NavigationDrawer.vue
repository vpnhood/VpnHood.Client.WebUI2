<script setup lang="ts">
import { AppName } from '@/helpers/UiConstants';
import { ref, watch } from 'vue';
import router from '@/services/router';
import { VpnHoodApp } from '@/services/VpnHoodApp';
import i18n from '@/locales/i18n';
import vuetify from '@/services/vuetify';

const vhApp = VpnHoodApp.instance;
const locale = i18n.global.t;

const props = defineProps<{
  modelValue: boolean
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const closeByKeyboardEscape = (event: KeyboardEvent) => {
  if (event.code === 'Escape')
    emit('update:modelValue', false);
};

const isCheckForUpdate = ref<boolean>(false);

watch(() => props.modelValue, (newVal) => {
  if (newVal)
    window.addEventListener('keydown', closeByKeyboardEscape);
  else
    window.removeEventListener('keydown', closeByKeyboardEscape);
});

async function diagnose(): Promise<void> {
  emit('update:modelValue', false);
  await vhApp.diagnose();
}

function mergedAppAndUiVersion(): string {
  const appVersion = vhApp.data.features.version.split('.');
  const uiVersion = import.meta.env.PACKAGE_VERSION?.split('.');
  if (uiVersion) {
    appVersion[appVersion.length - 1] = uiVersion[2];
    return appVersion.join('.');
  } else {
    return vhApp.data.features.version;
  }
}

async function checkForUpdate() {
  try {
    isCheckForUpdate.value = true;
    await vhApp.checkForUpdate();
  }
  finally {
    isCheckForUpdate.value = false;
    emit('update:modelValue', false);
  }
}

async function onSignIn() {
  try {
    vhApp.data.uiState.showLoadingDialog = true;
    await vhApp.signIn();
    emit('update:modelValue', false);
  } finally {
    vhApp.data.uiState.showLoadingDialog = false;
  }
}

function itemClass(){
  return vhApp.isConnectApp() ? 'border-secondary border-b' : 'border-b';
}
</script>

<template>
  <v-navigation-drawer
    @update:modelValue="emit('update:modelValue', $event)"
    :modelValue="modelValue"
    :location="vuetify.locale.isRtl.value? 'right' : 'left'"
    :color="vhApp.data.features.uiName === AppName.VpnHoodConnect ? 'background' : 'white'"
    :temporary="true"
    :disable-route-watcher="true"
    :floating="true"
  >
    <!-- Header -->
    <div :class="[vhApp.isConnectApp() ? 'bg-primary-darken-2' : 'bg-primary-darken-1','d-flex align-center pa-4']">

      <v-img
        :src="vhApp.getImageUrl(vhApp.isConnectApp() ? 'logo-connect.png' : 'logo.png')"
        :eager="true"
        alt="logo"
        max-width="50"
        width="50"
        height="50"
      />

      <div class="text-white ms-3">
        <!-- App name -->
        <h4 dir="ltr" :class="vuetify.locale.isRtl.value? 'text-end' : 'text-start'">
          {{ vhApp.isConnectApp() ? locale('VPN_HOOD_CONNECT_APP_NAME') : locale('VPN_HOOD_APP_NAME') }}
        </h4>

        <!-- App full version -->
        <div class="text-secondary-lighten-1 text-caption">
          <span class="me-2">{{ locale('VERSION') }}:</span>
          <span>{{ mergedAppAndUiVersion() }}</span>
        </div>
      </div>

    </div>

    <!-- TODO create component -->
    <!-- Menu items -->
    <v-list dense class="pt-0">

      <!-- Go premium or Change subscription -->
      <v-list-item
        v-if="vhApp.data.features.isAccountSupported && !vhApp.data.state.clientProfile?.isPremiumAccount"
        :class="itemClass()"
        @click="router.replace('/purchase-subscription'); emit('update:modelValue', false)"
      >
        <v-list-item-title>
          <v-icon icon="mdi-crown" />
          <span class="ms-3">{{locale('GO_PREMIUM') }}</span>
        </v-list-item-title>
      </v-list-item>

      <!-- Sign in button -->
      <v-list-item
        v-if="vhApp.data.features.isAccountSupported"
        :class="itemClass()"
        @click="!vhApp.data.userState.userAccount ? onSignIn() : router.replace('/account')"
      >
        <v-list-item-title>
          <v-icon icon="mdi-account" />
          <span class="ms-3">{{ !vhApp.data.userState.userAccount ? locale('SIGN_IN_WITH_GOOGLE') : locale('ACCOUNT') }}</span>
        </v-list-item-title>
      </v-list-item>

      <!-- Settings -->
      <v-list-item
        :class="itemClass()"
        @click="router.replace({path: '/settings'})"
      >
        <v-list-item-title>
          <v-icon icon="mdi-cog" />
          <span class="ms-3">{{ locale('SETTINGS') }}</span>
        </v-list-item-title>
      </v-list-item>

      <!-- Diagnose -->
      <v-list-item
        :class="itemClass()"
        :disabled="!vhApp.data.state.canDiagnose"
        @click="diagnose"
      >
        <v-list-item-title>
          <v-icon icon="mdi-stethoscope" />
          <span class="ms-3">{{ locale('DIAGNOSE') }}</span>
        </v-list-item-title>
      </v-list-item>

      <!-- Check for update -->
      <v-list-item
        :class="itemClass()"
        @click="checkForUpdate"
      >
        <v-list-item-title>
          <v-progress-circular v-if="isCheckForUpdate" :width="2" :size="21.59" :indeterminate="true" color="secondary" />
          <v-icon v-else icon="mdi-update" />
          <span class="ms-3">{{ locale('CHECK_FOR_UPDATE') }}</span>
        </v-list-item-title>
      </v-list-item>

      <!-- Whats new -->
      <v-list-item
        v-if="vuetify.display.mobile.value || vuetify.display.platform.value.win"
        :nav="true"
        density="compact"
        class="opacity-80 mt-4"
        href="https://github.com/vpnhood/VpnHood/blob/main/CHANGELOG.md"
        @click="emit('update:modelValue',false)"
        target="_blank">

        <v-list-item-title>
          <v-icon icon="mdi-bullhorn" />
          <span class="ms-3 text-caption">{{ locale('WHATS_NEW') }}</span>
        </v-list-item-title>
      </v-list-item>

      <!-- Send feedback -->
      <!-- Do not show on TV -->
      <v-list-item
        v-if="vuetify.display.mobile.value || vuetify.display.platform.value.win"
        :nav="true"
        density="compact"
        class="opacity-80"
        href="https://docs.google.com/forms/d/e/1FAIpQLSd5AQesTSbDo23_4CkNiKmSPtPBaZIuFjAFnjqLo6XGKG5gyg/viewform?usp=sf_link"
        @click="emit('update:modelValue',false)"
        target="_blank">

        <v-list-item-title>
          <v-icon icon="mdi-message-alert" />
          <span class="ms-3 text-caption">{{ locale('SEND_FEEDBACK') }}</span>
        </v-list-item-title>
      </v-list-item>

      <!-- Create personal server -->
      <!-- Do not show on TV -->
      <v-list-item
        v-if="!vhApp.isConnectApp() && (vuetify.display.mobile.value
        || !vhApp.isConnectApp() && vuetify.display.platform.value.win)"
        :nav="true"
        density="compact"
        class="opacity-80"
        href="https://github.com/vpnhood/VpnHood/wiki/VpnHood-Manager"
        @click="emit('update:modelValue',false)"
        target="_blank">

        <v-list-item-title>
          <v-icon icon="mdi-server" />
          <span class="ms-3 text-caption">{{ locale('CREATE_PERSONAL_SERVER') }}</span>
        </v-list-item-title>
      </v-list-item>

    </v-list>

    <!-- Bottom section -->
    <div class="text-center position-fixed bottom-0 w-100">

      <!-- Social icons -->
<!--      <div class="d-flex justify-center ga-3 mb-5">

        &lt;!&ndash; Website &ndash;&gt;
        <v-btn
          icon
          size="small"
          variant="tonal"
          density="comfortable"
          href="https://www.vpnhood.com"
          target="_blank"
        >
          <template v-slot:default>
            <Icon icon="proicons:globe" width="20" />
          </template>
        </v-btn>

        &lt;!&ndash; Instagram &ndash;&gt;
        <v-btn
          icon
          size="small"
          variant="tonal"
          density="comfortable"
          href="https://www.instagram.com/vpnhood/"
          target="_blank"
        >
          <template v-slot:default>
            <Icon icon="proicons:instagram" width="20" />
          </template>
        </v-btn>

        &lt;!&ndash; Twitter &ndash;&gt;
        <v-btn
          icon
          size="small"
          variant="tonal"
          density="comfortable"
          href="https://x.com/vpnhood"
          target="_blank"
        >
          <template v-slot:default>
            <Icon icon="proicons:x-twitter" width="17" />
          </template>
        </v-btn>
      </div>-->

      <!-- Powered by button -->
      <a
        class="d-block mb-4 text-caption text-decoration-none"
        :class="[vhApp.isConnectApp() ? 'text-secondary-lighten-1' : 'text-primary-darken-2']"
        href="https://github.com/vpnhood/VpnHood"
        target="_blank"
      >
        <span>{{ locale('POWERED_BY_VPNHOOD_ENGINE') }}</span>
        <v-icon icon="mdi-open-in-new" class="ms-2" />
      </a>
    </div>
  </v-navigation-drawer>


</template>

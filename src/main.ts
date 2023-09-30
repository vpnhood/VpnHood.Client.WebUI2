import {createApp, reactive} from 'vue'
import App from './App.vue'
import ErrorPage from "@/pages/ErrorPage.vue";
import router from './plugins/router'
import vuetify from './plugins/vuetify'
import i18n from './locales/i18n'
import './assets/css/override.css'
import './assets/css/general.css'
import "./services/Firebase";
import {VpnHoodApp} from "@/services/VpnHoodApp";

async function main(): Promise<void> {
    try {
        // init app
        const vpnHoodApp: VpnHoodApp = reactive(await VpnHoodApp.create());
        const app = createApp(App);

        // Global property
        app.config.globalProperties.$vpnHoodApp = vpnHoodApp;

        // Global catch exception
        app.config.errorHandler = (err: any) => vpnHoodApp.showError(err);

        // init Vue
        app.use(i18n)
            .use(router)
            .use(vuetify)
            .mount('#app')
    } catch (ex: any) {
        console.error("Could not create client app.", ex);

        // show error page
        const app = createApp(ErrorPage);
        app.use(i18n)
            .use(vuetify)
            .mount('#app')
    }
}

// noinspection JSIgnoredPromiseFromCall
main();
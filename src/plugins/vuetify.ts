// Styles
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import {VBottomSheet} from "vuetify/labs/VBottomSheet";

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
    components:{
        VBottomSheet,
    },
        /*defaults:{
            VList:{
                bgColor: 'transparent',
            },
        },*/
        theme:{
            defaultTheme: 'VpnHoodTheme',
            themes:{
                VpnHoodTheme:{
                    dark: true,
                    colors:{
                        background: '#122272',
                        surface: '#FFFFFF',
                        'on-surface':'#212121',
                        primary: '#1940b0',
                        'primary-darken-1': '#122272',
                        secondary: '#23c99d',
                        'on-secondary': '#ffffff',
                        'master-green': '#23c99d',
                        'on-master-green': '#ffffff',
                        'sharp-master-green': '#3ff6a9',
                        'on-sharp-master-green': '#ffffff',
                        'sky-blue': '#16a3fe',
                        'on-sky-blue': '#ffffff',
                        'light-purple': '#8d9fe4',
                        'on-light-purple': '#ffffff',
                        error: '#ff5252',
                        info: '#2196F3',
                        success: '#4CAF50',
                        warning: '#FB8C00',
                    },
                    variables:{
                        'medium-emphasis-opacity':'0.8'
                    },
                },

            },
        }
    }
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
)

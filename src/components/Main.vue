<template>
    <v-app>
        <v-navigation-drawer
            fixed
            clipped
            app
            v-model="drawer"
        >

            <app-nav-list></app-nav-list>

        </v-navigation-drawer>
        
        <v-toolbar height="58px"
            color="blue darken-3"
            dark
            app
            clipped-left
            fixed
        >
            <v-toolbar-title 
                :style="$vuetify.breakpoint.smAndUp ? 'width: 450px; min-width: 250px' : 'min-width: 72px'" 
                class="ml-0 pl-3"
            >
                <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                <v-btn icon large>
                    <img height="45px;" src="../../static/logo.png">
                </v-btn>
                <span class="hidden-xs-only"><strong>Tjolle International Hotel</strong> PMS</span>
            </v-toolbar-title>
        </v-toolbar>

        <v-content>
            <v-container fluid>
                <router-view></router-view>
            </v-container>

        </v-content>
        <v-footer color="grey darken-3" app height="50px" :fixed="true">
            <v-flex xs12 text-xs-center>
                <span style="color:#cecece"><strong>USL Center for Information and Communications Technology</strong> &copy; 2018</span><br>
                <span class="caption font-weight 400" style="color:#898989">Developed and Maintained by: W.J.G. Vega (Software Developer)</span>
            </v-flex>
        </v-footer>
    </v-app>
</template>

<script>
    import AppNavList from './layouts/Home/AppNavList.vue'
    import axios from 'axios'
    import auth from './auth'
    import router from '@/router'

    //Initialize global headers for axios
    axios.defaults.baseURL = process.env.API_BASE_URL
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
    axios.defaults.headers.common['Accept'] = 'application/json'
    

    export default {
        data: () => ({
            drawer: null
        }),
        components: {
            AppNavList
        },
        beforeCreate() {
            if(auth.checkAuth()) {
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('access_token')
                router.push('/booking')
            }
        }
    }
</script>

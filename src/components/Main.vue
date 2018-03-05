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
        
        <v-toolbar
            color="blue darken-3"
            dark
            app
            clipped-left
            fixed
        >
            <v-toolbar-title 
                :style="$vuetify.breakpoint.smAndUp ? 'width: 300px; min-width: 250px' : 'min-width: 72px'" 
                class="ml-0 pl-3"
            >
                <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                <v-btn icon large>
                    <img height="45px;" src="../../static/logo.png">
                </v-btn>
                <span class="hidden-xs-only"><strong>Tjolle Hotel</strong> PMS</span>
            </v-toolbar-title>
        </v-toolbar>

        <v-content>
            <v-container fluid>
                <router-view></router-view>
            </v-container>

        </v-content>
        <v-footer color="grey darken-3" app height="55px" :fixed="true">
            <v-flex xs12 text-xs-center>
                <span style="color:#cecece"><strong>USL Center for Information and Communications Technology</strong> &copy; 2018</span><br>
                <span class="caption font-weight 400" style="color:#898989">Developed and Maintained by: W.J.G. Vega (Software Developer)</span>
            </v-flex>
        </v-footer>
    </v-app>
</template>

<script>
    import AppNavList from './layouts/Home/AppNavList.vue';
    import axios from 'axios'
    import auth from './auth'

    //Initialize global headers for axios
    axios.defaults.baseURL = 'http://localhost:8000'
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
    axios.defaults.headers.common['Accept'] = 'application/json'
    axios.defaults.headers.common['Authorization'] = auth.getAuthHeader().Authorization

    export default {
        data() {
            return {
                drawer: null
            }
        },
        components: {
            AppNavList
        },
        mounted() {

            //Check if user is authenticated
            auth.checkAuth()
            if(!auth.user.authenticated) {
                this.$router.replace('/login')
            }
        }
    }
</script>

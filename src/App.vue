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
            <v-toolbar-title :style="$vuetify.breakpoint.smAndUp ? 'width: 300px; min-width: 250px' : 'min-width: 72px'" class="ml-0 pl-3">
                <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
                <v-btn icon large>
                    <img height="45px;" src="../static/logo.png">
                </v-btn>
                <span class="hidden-xs-only"><strong>Tjolle Hotel</strong> PMS</span>
            </v-toolbar-title>
            
            <div class="d-flex align-center" style="margin-left: auto">
                <v-btn icon>
                    <v-icon>apps</v-icon>
                </v-btn>
                <v-btn icon>
                    <v-icon>notifications</v-icon>
                </v-btn>
            </div>
        </v-toolbar>
        <v-content>
            <v-container fluid>
                <booking></booking>
            </v-container>
        </v-content>
        <v-btn
            fab
            bottom
            right
            color="primary"
            dark
            fixed
            @click.stop="dialog = !dialog"
        >
            <v-icon>add</v-icon>
        </v-btn>
        <v-dialog v-model="dialog" width="800px">
            
        </v-dialog>
    </v-app>
</template>

<script>
    import AppNavList from './components/layouts/Home/AppNavList.vue';
    import Booking from './components/Booking.vue';

    export default {
        data() {
            return {
                dialog: false,
                drawer: null
            }
        },
        components: {
            AppNavList,
            Booking
        }
    }
</script>
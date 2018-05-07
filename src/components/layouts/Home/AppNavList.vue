<template>
    <v-list dense>
        <v-list-tile avatar>
            <v-list-tile-avatar color="blue-grey lighten-4">
                <v-icon>person_outline</v-icon>
            </v-list-tile-avatar>
            <v-list-tile-content>
                <v-list-tile-title>{{ user.firstname }} {{ user.lastname }}</v-list-tile-title>
                <v-list-tile-sub-title>{{ user.usertype }}</v-list-tile-sub-title>
            </v-list-tile-content>
        </v-list-tile>
        <v-divider></v-divider>
        <template v-for="item in items">
            <v-layout
                row
                v-if="item.heading"
                align-center
                :key="item.heading"
            >
                <v-flex xs6>
                    <v-subheader v-if="item.heading">
                        {{ item.heading }}
                    </v-subheader>
                </v-flex>
            </v-layout>
            <v-list-group 
                v-else-if="item.children"
                v-model="item.model"
                :key="item.text"
                :prepend-icon="item.model ? item.icon : item['icon-alt']"
                append-icon="">
                <v-list-tile slot="activator">
                    <v-list-tile-content>
                        <v-list-tile-title>
                            {{ item.text }}
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                <v-list-tile
                    v-for="(child, i) in item.children"
                    :key="i"
                    :to="child.route"
                >
                    <v-list-tile-action v-if="child.icon">
                        <v-icon>{{ child.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            {{ child.text }}
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
            </v-list-group>
            <v-list-tile 
                v-else 
                :to="item.route" 
                :key="item.text" 
                :value="item.active"
            >
                <v-list-tile-action>
                    <v-icon>{{ item.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                    <v-list-tile-title>
                        {{ item.text }}
                    </v-list-tile-title>
                </v-list-tile-content>
            </v-list-tile>
        </template>
        <v-layout>
            <v-flex py-2 style="padding-left:4px;">
                <v-date-picker 
                    color="primary" 
                    header-color="blue darken-3"
                    v-model="today"
                >
                </v-date-picker>
            </v-flex>
        </v-layout>
    </v-list>  
</template>

<script>
import axios from 'axios'

export default {
    name: 'app-nav-list',
    data() {
        return {
            today: null,
            items: [
                { icon: 'book', text: 'Booking', route: '/booking', active: false },
                { icon: 'date_range', text: 'Reservation', route: '/reservation', active: false },
                {
                    icon: 'keyboard_arrow_up',
                    'icon-alt': 'keyboard_arrow_down',
                    text: 'Information Manager',
                    model: true,
                    children: [
                        { icon: 'list', text: 'Transactions', route: '/transactions', active: false },
                        { icon: 'people', text: 'Guests', route: '/guests', active: false },
                        { icon: 'style', text: 'Rooms', route: '/rooms', active: false },
                        { icon: 'lock', text: 'Accounts', route: '/accounts', active: false }
                    ]
                },
                { icon: 'fa-sign-out', text: 'Sign Out', route: '/login', active: false }
            ],
            user: {
                firstname: '',
                lastname: '',
                usertype: ''
            }
        }
    },
    props: {
        source: String
    },
    created() {
        this.getUserInformation()
        this.today = new Date()
        var dd = this.today.getDate()
        var mm = this.today.getMonth()+1 //January is 0!
        var yyyy = this.today.getFullYear()

        if(dd<10) {
            dd = '0'+dd
        } 

        if(mm<10) {
            mm = '0'+mm
        } 

        this.today = yyyy + '-' + mm + '-' + dd
    },
    methods: {
        getUserInformation() {
            axios.get('/api/user')
            .then(response => {
                this.user.firstname = response.data.firstname
                this.user.lastname = response.data.lastname
                if(response.data.user_type === 1) {
                    this.user.usertype = 'Administrator'
                }
                else {
                    this.user.usertype = 'User'
                }
            })
            .catch(error => {
                console.log(error)
            })
        }
    }
}
</script>
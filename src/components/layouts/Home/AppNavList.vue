<template>
    
        <v-list dense>
            <template v-for="(item, i) in items">
                <div>
                <v-layout
                    row
                    v-if="item.heading"
                    align-center
                    :key="i"
                >
                    <v-flex xs6>
                        <v-subheader v-if="item.heading">
                            {{ item.heading }}
                        </v-subheader>
                    </v-flex>
                </v-layout>
                <v-list-group v-else-if="item.children" v-model="item.model" no-action>
                    <v-list-tile slot="item" @click="">
                        <v-list-tile-action>
                            <v-icon>{{ item.model ? item.icon : item['icon-alt'] }}</v-icon>
                        </v-list-tile-action>
                        <v-list-tile-content>
                            <v-list-tile-title>
                            {{ item.text }}
                            </v-list-tile-title>
                        </v-list-tile-content>
                    </v-list-tile>
                    <v-list-tile
                        v-for="(child, i) in item.children"
                        :key="i"
                        @click=""
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
                <v-list-tile v-else @click="" :value="item.active">
                    <v-list-tile-action>
                        <v-icon>{{ item.icon }}</v-icon>
                    </v-list-tile-action>
                    <v-list-tile-content>
                        <v-list-tile-title>
                            {{ item.text }}
                        </v-list-tile-title>
                    </v-list-tile-content>
                </v-list-tile>
                </div>
            </template>
        </v-list>  
</template>

<script>
export default {
    name: 'app-nav-list',
    data() {
        return {
            items: [
                { icon: 'book', text: 'Booking', active: true },
                { icon: 'date_range', text: 'Reservation', active: false },
                {
                icon: 'keyboard_arrow_up',
                'icon-alt': 'keyboard_arrow_down',
                text: 'Information Manager',
                model: false,
                children: [
                    { icon: 'people', text: 'Customers', active: false },
                    { icon: 'style', text: 'Rooms', active: false },
                    { icon: 'lock', text: 'Accounts', active: false }
                ]
                }
            ]
        }
    },
    props: {
        source: String
    }
}
</script>
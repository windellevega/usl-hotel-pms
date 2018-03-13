<template>
    <div>
        <v-layout>
            <v-flex xs12 sm12>
                <h2 class="display-1">ROOMS</h2>
                <br>
            </v-flex>
        </v-layout>
        <v-dialog v-model="dialog" max-width="500px">
            <v-card>
                <v-card-title>
                    <span class="headline">Edit Room</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                        <v-flex xs12 sm12 md12>
                            <v-text-field label="Room Name" v-model="editedItem.room_name"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12>
                            <v-text-field label="Description" v-model="editedItem.room_description"></v-text-field>
                        </v-flex>
                        <v-flex xs12 sm12 md12>
                            <v-text-field label="Capacity" v-model="editedItem.capacity"></v-text-field>
                        </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
                    <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-alert :type="alerttype" dismissible v-model="alert" transition="slide-y-transition">
            {{ alertmessage }}
        </v-alert>
        <v-data-table
        :headers="headers"
        :items="rooms"
        hide-actions
        class="elevation-1"
        >
            <template slot="items" slot-scope="props">
                 <tr @click="props.expanded = !props.expanded">
                    <td>{{ props.item.room_name }}</td>
                    <td>{{ props.item.room_description }}</td>
                    <td>{{ props.item.capacity }}</td>
                    <td>{{ props.item.status_history[0].status.statustype }}</td>
                    <td class="justify-center layout px-0">
                        <v-btn icon class="mx-0" @click="editItem(props.item)">
                            <v-icon color="teal">edit</v-icon>
                        </v-btn>
                    </td>
                 </tr>
            </template>
            <template slot="expand" slot-scope="props">
                <v-container grid-list-xs>
                    <v-layout wrap>
                        <v-flex xs12 sm12 md12 py-2>
                            <strong>ROOM RATES:</strong><br>
                        </v-flex>
                        <v-flex v-for="(rate, i) in props.item.room_rate" flat :key="i" xs6 sm4 md3>
                            <span>
                                <strong>{{ rate.rate.ratedescription }}:</strong> <br> 
                                <span class="pr-3"><strong>Solo:</strong> ₱{{ rate.rate.solorate }}</span>
                                <span v-if="rate.rate.grouprate"><strong>Group:</strong> ₱{{ rate.rate.grouprate }}</span>
                            </span>
                            <br>
                            <br>
                        </v-flex>
                    </v-layout>
                </v-container>
            </template>
            <template slot="no-data">
                <td colspan="5" class="text-xs-center">There are no rooms to show.</td>
            </template>
        </v-data-table>
    </div>
</template>

<script>
import axios from 'axios'
import auth from './../../auth'

export default {
    data: () => ({
        alert: false,
        alerttype: 'success',
        alertmessage: 'Success',
        dialog: false,
        headers: [
            { text: 'Room Name', value: 'room_name' },
            { text: 'Room Description', value: 'room_description' },
            { text: 'Max Capacity', value: 'capacity' },
            { text: 'Status', value: 'status_history[0].status.statustype' },
            { text: 'Actions', value: 'name', sortable: false }
        ],
        rooms: [],
        editedIndex: -1,
        editedItem: {
        }
    }),
    beforeCreate() {
        auth.checkAuth()
    },

    watch: {
        dialog (val) {
            val || this.close()
        }
    },

    created () {
        this.getRooms()
    },

    methods: {
        getRooms () {
            axios.get('/api/rooms')
            .then(response => {
                this.rooms = response.data
            })
            .catch(error => {
                console.log(error)
            })
        },

        editItem (item) {
            this.editedIndex = this.rooms.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        close () {
            this.dialog = false
            setTimeout(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.editedIndex = -1
            }, 300)
        },

        save () {
            if (this.editedIndex > -1) {
                axios.patch('/api/room/' + this.editedItem.id, this.editedItem)
                .then(response => {
                    this.getRooms()
                    this.alertmessage = response.data.message
                    this.alerttype = 'success'
                    this.alert = true
                })
                .catch(error => {
                    console.log(error)
                })
            } 
            this.close()
        }
    }
}
</script>
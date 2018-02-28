<template>
    <div>
        <v-dialog persistent v-model="dialog" max-width="700px">
            <v-btn color="primary" dark slot="activator" class="mb-2">New Reservation</v-btn>
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12 sm12 md12>
                                <v-select
                                    :items="guests"
                                    label="Select Guest"
                                    single-line
                                    bottom
                                ></v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md6>
                                <v-menu
                                    ref="menu"
                                    lazy
                                    :close-on-content-click="true"
                                    transition="scale-transition"
                                    offset-y
                                    full-width
                                    :nudge-right="40"
                                    min-width="290px"
                                    :return-value.sync="editedItem.checkindate"
                                >
                                    <v-text-field
                                        slot="activator"
                                        label="Arrival Date"
                                        v-model="editedItem.checkindate"
                                        prepend-icon="event"
                                        readonly
                                    ></v-text-field>
                                    <v-date-picker 
                                        v-model="editedItem.checkindate" 
                                        scrollable></v-date-picker>
                                </v-menu>
                            </v-flex>
                            <v-flex xs11 sm5>
                                <v-menu
                                    ref="menu"
                                    lazy
                                    :close-on-content-click="false"
                                    transition="scale-transition"
                                    offset-y
                                    full-width
                                    :nudge-right="40"
                                    max-width="290px"
                                    min-width="290px"
                                    :return-value.sync="editedItem.checkintime"
                                >
                                    <v-text-field
                                        slot="activator"
                                        label="Picker in menu"
                                        v-model="editedItem.checkintime"
                                        prepend-icon="access_time"
                                        readonly
                                    ></v-text-field>
                                    <v-time-picker v-model="editedItem.checkintime" @change="$refs.menu.save(editedItem.checkintime)"></v-time-picker>
                                </v-menu>
                            </v-flex>
                            
                            <v-flex xs12 sm12 md6>
                                <v-text-field label="Carbs (g)" v-model="editedItem.carbs"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm12 md6>
                                <v-text-field label="Protein (g)" v-model="editedItem.protein"></v-text-field>
                            </v-flex>
                        </v-layout>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
                    <v-btn color="blue darken-1" flat @click.native="saveReservation">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-data-table
        :headers="headers"
        :items="reservations"
        hide-actions
        class="elevation-1"
        >
        <template slot="items" slot-scope="props">
            <td class="text-xs-center">{{ props.item.room.room_name }}</td>
            <td class="text-xs-right">{{ props.item.guest.firstname }} {{ props.item.guest.lastname }}</td>
            <td class="text-xs-right">{{ props.item.booking_type.bookingtype }}</td>
            <td class="text-xs-right">{{ props.item.checkin }}</td>
            <td class="text-xs-right">{{ props.item.checkout }}</td>
            <td class="text-xs-right">₱ {{ props.item.bookingcharge }}</td>
            <td class="justify-center layout px-0">
            <v-btn icon class="mx-0" @click="editItem(props.item)">
                <v-icon color="teal">edit</v-icon>
            </v-btn>
            <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                <v-icon color="red accent-3">delete</v-icon>
            </v-btn>
            </td>
        </template>
        <template slot="no-data">
            <td colspan="7" class="text-xs-center">There are no reservations to show.</td>
        </template>
        </v-data-table>
    </div>
</template>

<script>
    import axios from 'axios'

    axios.defaults.baseURL = 'http://localhost:8000';
    axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
    axios.defaults.headers.common['Accept'] = 'application/json';
  export default {
    data: () => ({
      dialog: false,
      headers: [
        {
          text: 'Room Name', value: 'roomname'
        },
        { text: 'Guest Name', value: 'guestname' },
        { text: 'Booking Type', value: 'booktype' },
        { text: 'Check-In', value: 'checkin' },
        { text: 'Check-Out', value: 'checkout' },
        { text: 'Booking Charge', value: 'bookcharge' },
        { text: 'Actions', value: 'name', sortable: false }
      ],
      reservations: [],
      editedIndex: -1,
      editedItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0
      },
      defaultItem: {
        name: '',
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0
      },
      guests: []
    }),

    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Reservation' : 'Edit Reservation'
      }
    },

    watch: {
      dialog (val) {
        val || this.close()
      }
    },

    created () {
      this.initialize()
    },

    methods: {
      initialize () {
        axios.get('/api/reservations')
            .then(response => {
                this.reservations = response.data
            })
            .catch(error => {
                console.log(error.message)
            })
        
        axios.get('/api/guests')
            .then(response => {
                var item = []
                response.data.forEach(function(element, i) {
                    item.push({text: element.fullname + ' (' + element.guest_type.guesttype + ') - ' + element.company.companyname, value: element.id})
                })
                this.guests = item
            })
            .catch(error => {
                console.log(error.message)
            })
      },

      editItem (item) {
        this.editedIndex = this.reservations.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
        console.log(this.editedItem)
      },

      deleteItem (item) {
        const index = this.reservations.indexOf(item)
        confirm('Are you sure you want to delete this item?') && this.reservations.splice(index, 1)
      },

      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },

      saveReservation () {
        alert(this.editedItem.checkindate)
        alert(this.editedItem.checkintime)
        this.close()
      }
    }
  }
</script>
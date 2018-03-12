<template>
    <div>
        <v-layout>
            <v-flex xs12 sm12>
                <h2 class="display-1">HOTEL RESERVATIONS</h2>
                <br>
            </v-flex>
        </v-layout>
        <v-dialog persistent v-model="dialog" max-width="700px">
            <v-btn color="primary" dark slot="activator" class="mb-2">New Reservation</v-btn>
            <v-card>
                <v-form ref="reservationform">
                    <v-card-title>
                        <span class="headline" py-0>{{ formTitle }}</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container grid-list-md>
                            <v-layout v-if="formvalidation" wrap>
                                <v-flex py-0 fill-height xs12 sm6 md6 v-for="(error,i) in validationerrors" :key="i">
                                    <p py-0
                                        style="color:#FF1744"
                                        class="caption font-weight 400" 
                                        >
                                        *{{ error }}
                                    </p>
                                </v-flex>
                            </v-layout>
                            <v-layout wrap>
                                <v-flex xs12 sm12 md12>
                                    <v-select
                                        prepend-icon="person"
                                        :items="guests"
                                        label="Guest Name"
                                        required
                                        bottom
                                        v-model="editedItem.guest_id"
                                        :rules="guestIDRules"
                                    ></v-select>
                                </v-flex>
                                <v-flex xs12 sm12 md6>
                                    <v-menu
                                        ref="adate"
                                        lazy
                                        :close-on-content-click="true"
                                        transition="scale-transition"
                                        offset-y
                                        full-width
                                        :nudge-right="35"
                                        min-width="290px"
                                        :return-value.sync="editedItem.checkindate"
                                    >
                                        <v-text-field
                                            slot="activator"
                                            label="Arrival Date"
                                            v-model="editedItem.checkindate"
                                            prepend-icon="event"
                                            readonly
                                            required
                                            :rules="arrivalDateRules"
                                        ></v-text-field>
                                        <v-date-picker 
                                            v-model="editedItem.checkindate" 
                                            scrollable
                                            :min="mindate"
                                            @change="$refs.adate.save(editedItem.checkindate);"></v-date-picker>
                                    </v-menu>
                                </v-flex>
                                <v-flex xs11 sm6>
                                    <v-menu
                                        ref="atime"
                                        lazy
                                        :close-on-content-click="false"
                                        transition="scale-transition"
                                        offset-y
                                        full-width
                                        :nudge-right="35"
                                        max-width="290px"
                                        min-width="290px"
                                        :return-value.sync="editedItem.checkintime"
                                    >
                                        <v-text-field
                                            slot="activator"
                                            label="Arrival Time"
                                            v-model="editedItem.checkintime"
                                            prepend-icon="access_time"
                                            readonly
                                            required
                                            :rules="arrivalTimeRules"
                                        ></v-text-field>
                                        <v-time-picker 
                                            v-model="editedItem.checkintime" 
                                            @change="$refs.atime.save(editedItem.checkintime)"></v-time-picker>
                                    </v-menu>
                                </v-flex>
                                <v-flex xs12 sm12 md6>
                                    <v-menu
                                        ref="ddate"
                                        lazy
                                        :close-on-content-click="true"
                                        transition="scale-transition"
                                        offset-y
                                        full-width
                                        :nudge-right="35"
                                        min-width="290px"
                                        :return-value.sync="editedItem.checkoutdate"
                                    >
                                        <v-text-field
                                            slot="activator"
                                            label="Departure Date"
                                            v-model="editedItem.checkoutdate"
                                            prepend-icon="event"
                                            readonly
                                            required
                                            :rules="departureDateRules"
                                        ></v-text-field>
                                        <v-date-picker 
                                            v-model="editedItem.checkoutdate" 
                                            scrollable
                                            :min="mindate"
                                            @change="$refs.ddate.save(editedItem.checkoutdate)"></v-date-picker>
                                    </v-menu>
                                </v-flex>
                                <v-flex xs11 sm6>
                                    <v-menu
                                        ref="dtime"
                                        lazy
                                        :close-on-content-click="false"
                                        transition="scale-transition"
                                        offset-y
                                        full-width
                                        :nudge-right="35"
                                        max-width="290px"
                                        min-width="290px"
                                        :return-value.sync="editedItem.checkouttime"
                                    >
                                        <v-text-field
                                            slot="activator"
                                            label="Departure Time"
                                            v-model="editedItem.checkouttime"
                                            prepend-icon="access_time"
                                            readonly
                                            required
                                            :rules="departureTimeRules"
                                        ></v-text-field>
                                        <v-time-picker 
                                            v-model="editedItem.checkouttime" 
                                            @change="$refs.dtime.save(editedItem.checkouttime)"></v-time-picker>
                                    </v-menu>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-select
                                        prepend-icon="style"
                                        :items="rooms"
                                        label="Room"
                                        bottom
                                        item-text="room_name"
                                        item-value="id"
                                        v-model="editedItem.room_id"
                                        required
                                        :rules="roomIDRules"
                                    ></v-select>
                                </v-flex>
                                <v-flex xs12 sm12 md6>
                                    <v-select
                                        prepend-icon="book"
                                        :items="bookingtypes"
                                        label="Booking Type"
                                        bottom
                                        v-model="editedItem.bookingtype_id"
                                        required
                                        :rules="bookingTypeRules"
                                    ></v-select>
                                </v-flex>
                                <v-flex xs12 sm12 md6>
                                    <v-text-field 
                                        prepend-icon="group"
                                        label="Number of Pax" 
                                        v-model="editedItem.numberofpax"
                                        type="number"
                                        required
                                        :rules="numberOfPaxRules"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md6>
                                    <v-text-field 
                                        prefix="₱"
                                        label="Booking Charge" 
                                        v-model="editedItem.bookingcharge"
                                        type="number"
                                        required
                                        :rules="bookingChargeRules"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md6>
                                    <v-text-field 
                                        prefix="₱"
                                        label="Downpayment" 
                                        v-model="editedItem.billing.downpayment"
                                        type="number"
                                        required
                                        :rules="downpaymentRules"
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field 
                                        label="Remarks" 
                                        v-model="editedItem.remarks"
                                        multi-line
                                        no-resize
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
                        <v-btn color="blue darken-1" flat @click.native="saveReservation">Save</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
        <v-alert :type="alerttype" dismissible v-model="alert" transition="slide-y-transition">
            {{ alertmessage }}
        </v-alert>
        <br>
        <v-data-table
        :headers="headers"
        :items="reservations"
        hide-actions
        class="elevation-1"
        >
            <template slot="items" slot-scope="props">
                <tr v-if="compareDate(props.item.checkindate) == 1" style="background:#FFD180">
                    <td class="text-xs-center">{{ props.item.room.room_name }}</td>
                    <td class="text-xs-left">{{ props.item.guest.fullname }} ({{ props.item.guest.guest_type.guesttype }}) - {{ props.item.guest.company.companyname }}</td>
                    <td class="text-xs-left">{{ props.item.booking_type.bookingtype }}</td>
                    <td class="text-xs-left">{{ props.item.numberofpax }}</td>
                    <td class="text-xs-left">{{ props.item.checkin }}</td>
                    <td class="text-xs-left">{{ props.item.checkout }}</td>
                    <td class="text-xs-left">₱ {{ props.item.bookingcharge }}</td>
                    <td class="text-xs-left">₱ {{ props.item.billing.downpayment }}</td>
                    <td class="text-xs-left">{{ props.item.stayduration_days }}</td>
                    <td class="justify-center layout px-0">
                    <v-btn icon class="mx-0" @click="editItem(props.item)">
                        <v-icon color="teal">edit</v-icon>
                    </v-btn>
                    <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                        <v-icon color="red accent-3">delete</v-icon>
                    </v-btn>
                    </td>
                </tr>
                <tr v-else-if="compareDate(props.item.checkindate) == -1" style="background:#FF8A80">
                    <td class="text-xs-center">{{ props.item.room.room_name }}</td>
                    <td class="text-xs-left">{{ props.item.guest.fullname }} ({{ props.item.guest.guest_type.guesttype }}) - {{ props.item.guest.company.companyname }}</td>
                    <td class="text-xs-left">{{ props.item.booking_type.bookingtype }}</td>
                    <td class="text-xs-left">{{ props.item.numberofpax }}</td>
                    <td class="text-xs-left">{{ props.item.checkin }}</td>
                    <td class="text-xs-left">{{ props.item.checkout }}</td>
                    <td class="text-xs-left">₱ {{ props.item.bookingcharge }}</td>
                    <td class="text-xs-left">₱ {{ props.item.billing.downpayment }}</td>
                    <td class="text-xs-left">{{ props.item.stayduration_days }}</td>
                    <td class="justify-center layout px-0">
                    <v-btn icon class="mx-0" @click="editItem(props.item)">
                        <v-icon color="teal">edit</v-icon>
                    </v-btn>
                    <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                        <v-icon color="red accent-3">delete</v-icon>
                    </v-btn>
                    </td>
                </tr>
                <tr v-else>
                    <td class="text-xs-center">{{ props.item.room.room_name }}</td>
                    <td class="text-xs-left">{{ props.item.guest.fullname }} ({{ props.item.guest.guest_type.guesttype }}) - {{ props.item.guest.company.companyname }}</td>
                    <td class="text-xs-left">{{ props.item.booking_type.bookingtype }}</td>
                    <td class="text-xs-left">{{ props.item.numberofpax }}</td>
                    <td class="text-xs-left">{{ props.item.checkin }}</td>
                    <td class="text-xs-left">{{ props.item.checkout }}</td>
                    <td class="text-xs-left">₱ {{ props.item.bookingcharge }}</td>
                    <td class="text-xs-left">₱ {{ props.item.billing.downpayment }}</td>
                    <td class="text-xs-left">{{ props.item.stayduration_days }}</td>
                    <td class="justify-center layout px-0">
                    <v-btn icon class="mx-0" @click="editItem(props.item)">
                        <v-icon color="teal">edit</v-icon>
                    </v-btn>
                    <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                        <v-icon color="red accent-3">delete</v-icon>
                    </v-btn>
                    </td>
                </tr>
            </template>
            <template slot="no-data">
                <td colspan="10" class="text-xs-center">There are no reservations to show.</td>
            </template>
        </v-data-table>
    </div>
</template>

<script>
import axios from 'axios'
import auth from './../../auth'

export default {
    data: () => ({
        formvalidation: false,
        validationerrors: '',
        dialog: false,
        alert: false,
        alerttype: 'success',
        alertmessage: '',
        guestIDRules: [
            v => !!v || 'Guest name is required.'
        ],
        arrivalDateRules: [
             v => !!v || 'Arrival date is required'
        ],
        arrivalTimeRules: [
             v => !!v || 'Arrival time is required'
        ],
        departureDateRules: [
             v => !!v || 'Departure date is required'
        ],
        departureTimeRules: [
             v => !!v || 'Departure time is required'
        ],
        roomIDRules: [
             v => !!v || 'Room name is required'
        ],
        bookingTypeRules: [
             v => !!v || 'Booking type is required'
        ],
        numberOfPaxRules: [
             v => !!v || 'Number of pax is required'
        ],
        bookingChargeRules: [
             v => !!v || 'Booking charge is required'
        ],
        downpaymentRules: [
             v => !!v || 'Downpayment is required'
        ],
        headers: [
            {
                text: 'Room Name', value: 'room.room_name'
            },
            { text: 'Guest Name', value: 'guest.fullname' },
            { text: 'Booking Type', value: 'booking_type' },
            { text: 'No. of Pax', value: 'numberofpax' },
            { text: 'Check-In', value: 'checkin' },
            { text: 'Check-Out', value: 'checkout' },
            { text: 'Booking Charge', value: 'bookingcharge' },
            { text: 'Downpayment', value: 'billing.downpayment' },
            { text: 'Duration', value: 'stayduration_days' },
            { text: 'Actions', value: 'name', sortable: false }
        ],
        reservations: [],
        editedIndex: -1,

        editedItem: {
            billing: { downpayment: 0.00} 
        },
        defaultItem: {
            billing: { downpayment: 0.00} 
        },
        guests: [],
        rooms: [],
        bookingtypes: [],
        mindate: ''
    }),
    beforeCreate() {
        auth.checkAuth()
    },
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
        this.getReservations()
        this.getGuestInfo()
        this.getRoomInfo()
        this.getBookingTypes()
        this.setDatePickerMinDate()
    },

    methods: {
        compareDate(date) {

            let currTime = new Date()
            let refTime = new Date(date)

            if(currTime.getMonth() + '-' + currTime.getDay() + '-' + currTime.getFullYear() === refTime.getMonth() + '-' + refTime.getDay() + '-' + refTime.getFullYear()) {
                return 1
            }

            currTime = new Date().getTime()
            refTime = new Date(date).getTime()

            if(currTime > refTime) {
                return -1
            }
            else {
                return 0
            }
        },
        getReservations() {
            //get all reservation information
            axios.get('/api/reservations')
            .then(response => {
                if(response.data.message == undefined) {
                    this.reservations = response.data
                }
            })
            .catch(error => {
                console.log(error.message)
            })
        },
        getGuestInfo() {
            //get all guest information
            //for select menu
            axios.get('/api/guests')
            .then(response => {
                var item = []
                response.data.forEach(function(e) {
                    item.push({text: e.fullname + ' (' + e.guest_type.guesttype + ') - ' + e.company.companyname, value: e.id})
                })
                this.guests = item
            })
            .catch(error => {
                console.log(error.message)
            })
        },
        getRoomInfo() {
            //get all room information
            //for select menu
            axios.get('api/rooms')
            .then(response => {
                var item = []
                this.rooms = response.data
            })
            .catch(error => {
                console.log(error.message)
            })
        },
        getBookingTypes() {
            //get all booking type information
            //for select menu
            axios.get('api/bookingtypes')
            .then(response => {
                this.bookingtypes = response.data
            })
            .catch(error => {
                console.log(error.message)
            })
        },
        editItem(item) { //promp form dialog to edit item
            this.editedIndex = this.reservations.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },
        deleteItem (item) {
            const index = this.reservations.indexOf(item)
            if(confirm('Are you sure you want to delete this item?')) {
                this.reservations.splice(index, 1)
                axios.delete('api/booking/' + item.id)
                .then(response => {
                    this.setAlert('info', response.data.message)
                })
                .catch(error => {
                    console.log(error)
                })
            }
            
        },
        close () {
            this.$refs.reservationform.reset()
            this.dialog = false
            this.formvalidation = false
            setTimeout(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.editedIndex = -1
            }, 300)
        },
        saveReservation () {
            if(this.$refs.reservationform.validate()) {
                if(this.editedItem.id == undefined) { //If new reservation
                    axios.post('api/reservation', this.editedItem)
                    .then(response => {
                        //Check for validation errors
                        if(response.data.message) {
                            this.close()
                            this.getReservations()
                            this.alert = true
                            this.setAlert('success', response.data.message)
                        }
                        else {
                            this.formvalidation = true
                            this.validationerrors = response.data
                        }
                    })
                    .catch(error => {
                        alert(error.message)
                    })      
                }
                else { //If rervation detail will be updated
                    axios.patch('api/reservation/' + this.editedItem.id, this.editedItem)
                    .then(response => {
                        if(response.data.message) {
                            this.close()
                            this.getReservations()
                            this.setAlert('success', response.data.message)
                        }
                        else {
                            this.formvalidation = true
                            this.validationerrors = response.data
                        }
                    })
                    .catch(error => {
                        alert(error.message)
                    })
                }
            }  
        },
        setDatePickerMinDate() {
            //Set minimum date for reservation
            //cannot reserve current date
            var today = new Date()
            var mindate = new Date(today.getTime() + (24 * 60 * 60 * 1000));
            this.mindate = mindate.toISOString().substr(0,10)
        },
        setAlert(type, message) {
            this.alert = true
            this.alerttype = type
            this.alertmessage = message
        }
    }
}
</script>
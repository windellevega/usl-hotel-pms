<template>
    <v-layout row justify-center>
        <v-dialog persistent v-model="show" max-width="700px">
            <v-card>
                <v-form>
                    <v-card-title>
                        <span class="headline" py-0>New Booking</span>
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
                                        v-model="bookingInfo.guest_id"
                                    ></v-select>
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
                                        :return-value.sync="bookingInfo.checkoutdate"
                                    >
                                        <v-text-field
                                            slot="activator"
                                            label="Departure Date"
                                            v-model="bookingInfo.checkoutdate"
                                            prepend-icon="event"
                                            readonly
                                            required
                                        ></v-text-field>
                                        <v-date-picker 
                                            v-model="bookingInfo.checkoutdate" 
                                            scrollable
                                            @change="$refs.ddate.save(bookingInfo.checkoutdate)"></v-date-picker>
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
                                        :return-value.sync="bookingInfo.checkouttime"
                                    >
                                        <v-text-field
                                            slot="activator"
                                            label="Departure Time"
                                            v-model="bookingInfo.checkouttime"
                                            prepend-icon="access_time"
                                            readonly
                                            required
                                        ></v-text-field>
                                        <v-time-picker 
                                            v-model="bookingInfo.checkouttime" 
                                            @change="$refs.dtime.save(bookingInfo.checkouttime)"></v-time-picker>
                                    </v-menu>
                                </v-flex>
                                <v-flex xs12 sm12 md6>
                                    <v-select
                                        prepend-icon="book"
                                        :items="bookingtypes"
                                        label="Booking Type"
                                        bottom
                                        v-model="bookingInfo.bookingtype_id"
                                        required
                                    ></v-select>
                                </v-flex>
                                <v-flex xs12 sm12 md6>
                                    <v-text-field 
                                        prepend-icon="group"
                                        label="Number of Pax" 
                                        v-model="bookingInfo.numberofpax"
                                        mask="#"
                                        required
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md6>
                                    <v-text-field 
                                        prefix="₱"
                                        label="Booking Charge" 
                                        v-model="bookingInfo.bookingcharge"
                                        required
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md6>
                                    <v-text-field 
                                        prefix="₱"
                                        label="Downpayment" 
                                        v-model="bookingInfo.billing.downpayment"
                                        required
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field 
                                        label="Remarks" 
                                        v-model="bookingInfo.remarks"
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
                        <v-btn color="blue darken-1" flat @click.native="saveBooking">Save</v-btn>
                    </v-card-actions>
                </v-form>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
import axios from 'axios'
import auth from './../../auth'

export default {
    name: 'booking-form',
    props: ['show', 'roomid'],
    data() {
        return {
            formvalidation: false,
            validationerrors: '',
            guests: [],
            bookingtypes: [],
            bookingInfo: {
                billing: { downpayment: 0.00 } 
            },
        }
    },
    created() {
        this.getGuestInfo()
        this.getBookingTypes()
    },
    watch: {
        roomid: function() {
            this.bookingInfo.room_id = this.roomid
        }
    },
    methods: {
        getGuestInfo() {
            //get all guest information
            //for select menu
            axios.get('/api/guests').then(response => {
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
        getBookingTypes() {
            //get all booking type information
            //for select menu
            axios.get('api/bookingtypes').then(response => {
                this.bookingtypes = response.data
            })
            .catch(error => {
                console.log(error.message)
            })
        },
        close() {
            this.$emit('closedialog', false)
        },
        saveBooking() {
            console.log(this.bookingInfo)
            axios.post('/api/booking', this.bookingInfo)
            .then(response => {
                if(response.data.message) {
                    alert(response.data.message)
                    this.$parent.loadRooms()
                    this.$emit('closedialog', false)
                }
                else {
                    this.formvalidation = true
                    this.validationerrors = response.data
                }
                
            })
            .catch(error => {
                console.log(error)
            })
        }
    }
}
</script>

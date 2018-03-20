<template>
    <div>
        <v-layout>
            <v-flex xs12 sm12>
                <h2 class="display-1">HOTEL BOOKINGS</h2>
                <br>
            </v-flex>
        </v-layout>
        <v-container grid-list-md>
            
            <v-layout row wrap transition="slide-y-transition">
                <v-flex xs12 sm6 md4 v-for="(room, i) in rooms" :key="i">
                    <v-card fluid hover>
                        <v-card-title 
                            v-if="room.status_history[0].status_id === 4 
                                    || room.status_history[0].status_id === 5 
                                    || room.status_history[0].status_id === 8"
                            primary-title 
                            :class="getStatusColor(room.status_history[0].status_id)"
                            @click="showRoomDetailsDialog(room.id)"
                        >
                            <div style="min-height:110px">
                                <h3 class="headline mb-0">{{ room.room_name }}</h3>
                                <strong>Features: </strong><span>{{ room.room_description }}</span><br>
                                <strong>Capacity: </strong><span>{{ room.capacity }}</span><br>
                            </div>
                        </v-card-title>
                        <v-card-title 
                            v-else
                            primary-title 
                            :class="getStatusColor(room.status_history[0].status_id)"
                        >
                            <div style="min-height:110px">
                                <h3 class="headline mb-0">{{ room.room_name }}</h3>
                                <strong>Features: </strong><span>{{ room.room_description }}</span><br>
                                <strong>Capacity: </strong><span>{{ room.capacity }}</span><br>
                            </div>
                        </v-card-title>
                        <v-card-actions>
                            <v-btn 
                                v-if="room.status_history[0].status_id === 4 
                                        || room.status_history[0].status_id === 5 
                                        || room.status_history[0].status_id === 8" 
                                flat color="orange darken-4"
                                @click="showRoomDetailsDialog(room.id)"
                            >Checkout</v-btn>
                            <v-btn 
                                v-else 
                                flat 
                                color="blue darken-3"  
                                @click="showBookingFormDialog(room.id)"
                            >New Booking</v-btn>
                            <v-spacer></v-spacer>
                            <v-menu offset-y full-width>
                                <v-chip slot="activator">
                                    <v-avatar :class="getStatusColor(room.status_history[0].status_id)">
                                        <v-icon>{{ getStatusIcon(room.status_history[0].status_id) }}</v-icon>
                                    </v-avatar>
                                    {{ getStatusName(room.status_history[0].status_id) }}
                                </v-chip>
                
                                <room-status-list 
                                    @changestatus="room.status_history[0].status_id = $event" 
                                    :currstat="room.status_history[0].status_id" 
                                    :roomid="room.id"
                                >
                                </room-status-list>

                            </v-menu>
                            <v-btn icon @click.native="room.show = !room.show">
                                <v-icon>
                                    {{ room.show ? 'keyboard_arrow_down' : 'keyboard_arrow_up' }}
                                </v-icon>
                            </v-btn>
                        </v-card-actions>

                        <room-reservations-list 
                            :show="room.show" 
                            :roomid="room.id"
                        >
                        </room-reservations-list>   
                    </v-card>
                </v-flex>
                <!--<v-btn
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
                    
                </v-dialog>-->
                <booking-details 
                    @closedialog="showdetails = $event"
                    :roomid="roomiddetails"
                    :show="showdetails"
                ></booking-details>
                <booking-form 
                    @closedialog="showbookingform = $event"
                    :roomid="roomidbooking"
                    :show="showbookingform"
                ></booking-form>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
import RoomReservationsList from './../Booking/RoomReservationsList.vue'
import RoomStatusList from './../Booking/RoomStatusList.vue'
import BookingDetails from './../Booking/BookingDetails.vue'
import BookingForm from './../Booking/BookingForm.vue'
import axios from 'axios'
import auth from './../../auth'

export default {
    name: 'booking',
    components: { 
        RoomReservationsList, 
        RoomStatusList, 
        BookingDetails,
        BookingForm
    },
    data() {
        return {
            dialog: false,
            rooms: null,
            status: '',
            showdetails: false,
            showbookingform: false,
            roomiddetails: null,
            roomidbooking: null
        }
    },
    beforeCreate() {
        auth.checkAuth()
    },
    mounted() {
        this.loadRooms()
    },
    methods: {
        showRoomDetailsDialog(roomid) {
            this.roomiddetails = roomid
            this.showdetails = true
        },
        showBookingFormDialog(roomid) {
            this.roomidbooking = roomid
            this.showbookingform = true
        },
        getStatusColor(status) {
            let status_color = ''
            if(status === 1) {
                status_color = 'green accent-1'
            }
            else if(status === 2) {
                status_color = 'blue accent-1'
            }
            else if(status === 3) {
                status_color = 'orange accent-1'
            }
            else if(status === 4) {
                status_color = 'red accent-1'
            }
            else if(status === 5) {
                status_color = 'red accent-1'
            }
            else if(status === 6) {
                status_color = 'blue-grey lighten-3'
            }
            else if(status === 7) {
                status_color = 'green accent-1'
            }
            else if(status === 8) {
                status_color = 'yellow accent-1'
            }

            return status_color;
        },
        getStatusIcon(status) {
            let status_icon = ''
            if(status === 1) {
                status_icon = 'beenhere'
            }
            else if(status === 2) {
                status_icon = 'local_offer'
            }
            else if(status === 3) {
                status_icon = 'bug_report'
            }
            else if(status === 4) {
                status_icon = 'hotel'
            }
            else if(status === 5) {
                status_icon = 'do_not_disturb'
            }
            else if(status === 6) {
                status_icon = 'build'
            }
            else if(status === 7) {
                status_icon = 'visibility_off'
            }
            else if(status === 8) {
                status_icon = 'access_time'
            }

            return status_icon;
        },
        getStatusName(status) {
            let status_name = ''
            if(status === 1) {
                status_name = 'Vacant Ready'
            }
            else if(status === 2) {
                status_name = 'Vacant Clean'
            }
            else if(status === 3) {
                status_name = 'Vacant Dirty'
            }
            else if(status === 4) {
                status_name = 'Occupied'
            }
            else if(status === 5) {
                status_name = 'Do not Disturb'
            }
            else if(status === 6) {
                status_name = 'Out of Order'
            }
            else if(status === 7) {
                status_name = 'No Show'
            }
            else if(status === 8) {
                status_name = 'Due Out'
            }

            return status_name;
        },
        loadRooms() {
            axios.get('/api/rooms')
            .then(response => {
                response.data.forEach(function(element, i) {
                    element.show = false
                })
                this.rooms = response.data
            })
            .catch(error => {
                console.log(error.message)
            })
        },
        try() {
            alert('it works!')
        }
    }
}
</script>

<template>
    <v-slide-y-transition>
        <v-card-text v-show="show">
            <v-layout>
                <v-flex xs12>
                    <strong>RESERVATIONS</strong><br>
                    <span v-if="reservations.message != null">{{ reservations.message }}</span>
                    <span v-else v-for="(reservation, i) in reservations" :key="i">
                        <span> {{reservation.checkin}} to {{ reservation.checkout }}<br></span>
                    </span>
                </v-flex>
            </v-layout>
        </v-card-text>
    </v-slide-y-transition>
</template>

<script>
import axios from 'axios'
import auth from './../../auth'

export default {
    name: 'room-reservations-list',
    props: ['show', 'roomid'],
    data() {
        return {
            reservations: {
                0: {
                    checkin: null,
                    checkout: null
                }
            }
        }
    },
    beforeCreate() {
        auth.checkAuth()
    },
    created() {
        axios.get('/api/room/reservationdates/' + this.roomid)
            .then(response => {
                this.reservations = response.data
            })
            .catch(error => {
                console.log(error.message)
            })
    }
}
</script>

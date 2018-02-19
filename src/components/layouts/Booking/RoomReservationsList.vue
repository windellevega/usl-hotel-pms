<template>
    <v-slide-y-transition>
        <v-card-text v-show="show">
            <v-layout>
                <v-flex xs12>
                    <strong>RESERVATIONS</strong><br>
                    <span v-for="reservation in reservations">{{reservation.checkin}} to {{ reservation.checkout }}<br></span>
                </v-flex>
            </v-layout>
        </v-card-text>
    </v-slide-y-transition>
</template>

<script>
export default {
    name: 'room-reservations-list',
    props: ['show', 'reservations']
}
</script>

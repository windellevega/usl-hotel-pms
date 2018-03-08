<template>
    <v-list>
        <v-chip @click="changeStatus(1)">
            <v-avatar class="green accent-1">
                <v-icon>beenhere</v-icon>
            </v-avatar>
            Vacant Ready
        </v-chip><br>
        <v-chip @click="changeStatus(2)">
            <v-avatar class="blue accent-1">
                <v-icon>local_offer</v-icon>
            </v-avatar>
            Vacant Clean
        </v-chip><br>
        <v-chip @click="changeStatus(3)">
            <v-avatar class="orange accent-1">
                <v-icon>bug_report</v-icon>
            </v-avatar>
            Vacant Dirty
        </v-chip><br>
        <v-chip @click="changeStatus(4)">
            <v-avatar class="red accent-1">
                <v-icon>hotel</v-icon>
            </v-avatar>
            Occupied
        </v-chip><br>
        <v-chip @click="changeStatus(5)">
            <v-avatar class="red accent-1">
                <v-icon>do_not_disturb</v-icon>
            </v-avatar>
            Do Not Disturb
        </v-chip><br>
        <v-chip @click="changeStatus(6)">
            <v-avatar class="blue-grey lighten-3">
                <v-icon>build</v-icon>
            </v-avatar>
            Out of Order
        </v-chip><br>
        <v-chip @click="changeStatus(7)">
            <v-avatar class="green accent-1">
                <v-icon>visibility_off</v-icon>
            </v-avatar>
            No Show
        </v-chip><br>
        <v-chip @click="changeStatus(8)">
            <v-avatar class="yellow accent-1">
                <v-icon>access_time</v-icon>
            </v-avatar>
            Due Out
        </v-chip>
    </v-list>
</template>

<script>
import axios from 'axios'
import auth from './../../auth'

export default {
    name: 'room-status-list',
    props: ['currstat', 'roomid'],
    beforeCreate() {
        auth.checkAuth()
    },
    methods: {
        changeStatus(statid) {
            if(this.currstat != statid){
                axios.post('api/room/changestatus/' + this.roomid, {
                    statusid: statid,
                    remarks: null
                })
                .then(response => {
                    if(response.data == 0) {
                        alert('Cannot change status. There is no reservation or booking for this day.')
                    }
                    else if(response.data == 1) {
                        alert('Cannot change status. The room is currently occupied.')
                    }
                    else {
                        this.$emit('changestatus', statid)
                    }
                })
                .catch(error => {
                    console.log(error.message)
                })
            }
        }
    }
}
</script>


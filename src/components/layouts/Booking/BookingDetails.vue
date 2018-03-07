<template>
    <v-layout row justify-center>
        <v-dialog v-model="show" persistent max-width="600">
            <v-card>
                <v-card-title class="headline">Booking Details</v-card-title>
                <v-card-text>
                    <v-layout row wrap>
                        <v-flex xs12 sm12 py-1>  
                            <strong>ROOM: </strong>{{ roomdetails.room.room_name }}
                        </v-flex>
                        <v-flex xs12 sm12 py-1>  
                            <strong>GUEST: </strong>{{ roomdetails.guest.fullname }} ({{ roomdetails.guest.guest_type.guesttype }}) - {{ roomdetails.guest.company.companyname }}
                        </v-flex>
                        <v-flex xs12 sm6 md6 py-1>  
                            <strong>CHECK-IN: </strong>{{ roomdetails.checkin }}
                        </v-flex>
                        <v-flex xs12 sm6 md6 py-1>  
                            <strong>CHECK-OUT: </strong>{{ roomdetails.checkout }}
                        </v-flex>
                        <v-flex xs12 sm6 md6 py-1>  
                            <strong>NO. OF PAX: </strong>{{ roomdetails.numberofpax }}
                        </v-flex>
                        <v-flex xs12 sm6 md6 py-1>  
                            <strong>BOOKING TYPE: </strong>{{ roomdetails.booking_type.bookingtype }}
                        </v-flex>
                        <v-flex xs12 sm12 md12 pt-1>  
                            <strong>REMARKS: </strong>
                        </v-flex>
                        <v-flex xs12 sm12 md12 pb-1>  
                            {{ roomdetails.remarks }}
                        </v-flex>
                        <v-flex xs12 sm12 md12 py-1>  
                            <strong>OTHER CHARGES: </strong>
                        </v-flex>
                        <v-flex xs12 sm12 md12 py-1>
                            <v-data-table
                                :headers="headers"
                                :items="roomdetails.billing.other_charge"
                                hide-actions
                                class="elevation-1"
                            >
                                <template slot="items" slot-scope="props">
                                    <td class="text-xs-left"> {{ props.item.othercharge_info }} </td>
                                    <td class="text-xs-right">₱{{ props.item.cost }}</td>
                                    <td class="text-xs-center">{{ props.item.quantity }}</td>
                                    <td class="text-xs-right pa-0">₱{{ props.item.totalcost }}</td>
                                    <td class="text-xs-center pa-0">
                                        <v-btn icon class="mx-0" small @click="removeOtherCharge(props.item.id)">
                                            <v-icon color="red accent-3">fa-times</v-icon>
                                        </v-btn>
                                    </td>
                                </template>
                                <template slot="footer">
                                    <td class="text-xs-right pa-0" colspan="3">
                                        <span class="caption">
                                            Total:<br>
                                            Booking Charge:<br>
                                            -----------------<br>
                                            Total Charge:<br>
                                            <span style="color:#E5143D">Downpayment:</span><br>
                                            -----------------<br>
                                        </span>
                                        <strong>
                                            Amount Due:<br>
                                        </strong>
                                    </td>
                                    <td class="text-xs-right pa-0">
                                        <span class="caption">
                                            ₱{{ totalOtherCharge }}<br>
                                            ₱{{ roomdetails.bookingcharge }}<br>
                                            ---------------<br>
                                            ₱{{ totalCharges }}<br>
                                            <span style="color:#E5143D">₱{{ roomdetails.billing.downpayment }}</span><br>
                                            -----------------<br>
                                        </span>
                                        <strong>
                                            ₱{{ amountDue }}
                                        </strong>
                                    </td>
                                    <td></td>
                                </template>
                                <template slot="no-data">
                                    <td colspan="5" class="text-xs-center">There are no other charges.</td>
                                </template>
                            </v-data-table>
                        </v-flex>
                        <v-flex xs12 sm12 md12 py-1>
                            <v-expansion-panel popout>
                                <v-expansion-panel-content hide-actions>
                                    <div slot="header" class=".body-1"><v-icon color="green darken-1">add_box</v-icon> <strong>Add Other Charge</strong></div>
                                    <v-card>
                                        <v-card-text>
                                            <v-form ref="addchargeform">
                                                <v-layout row>
                                                    <v-flex xs12 sm4 md4 px-2>
                                                        <v-text-field 
                                                            label="Description" 
                                                            v-model="addcharge.othercharge_info"
                                                            required
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm3 md3 px-2>
                                                        <v-text-field 
                                                            label="Cost" 
                                                            prefix="₱"
                                                            v-model="addcharge.cost"
                                                            required
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm2 md2 px-2>
                                                        <v-text-field 
                                                            label="Qty" 
                                                            v-model="addcharge.quantity"
                                                            required
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm3 md3 px-2 small>
                                                        <v-btn @click="addOtherCharge" color="primary">Add</v-btn>
                                                    </v-flex>
                                                </v-layout>
                                            </v-form>
                                        </v-card-text>
                                    </v-card>
                                </v-expansion-panel-content>
                            </v-expansion-panel>
                        </v-flex>
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat="flat" @click.native="close()">Close</v-btn>
                    <v-btn color="blue darken-1" flat="flat" @click.native="close()">Check-out</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
import axios from 'axios'

export default {
    name: 'booking-details',
    props: ['show', 'roomid'],
    data() {
        return {
            headers: [
                { text: 'Name', value: 'name' },
                { text: 'Cost/Qty', value: 'costperqty'},
                { text: 'Quantity', value: 'quantity'},
                { text: 'Total Cost', value: 'total', align: 'right', class: 'pa-0' },
                { text: '', value: ''}
            ],
            addcharge: {
                othercharge_info: '',
                quantity: null,
                cost: null,
                billingid: null
            },
            roomdetails: {
                checkin: '',
                checkout: '',
                numberofpax: '',
                remarks: '',
                bookingcharge: 0.00,
                room: {
                    room_name: ''
                },
                guest: {
                    fullname : '',
                    company: {
                        companyname: ''
                    },
                    guest_type: {
                        guesttype: ''
                    }
                },
                booking_type: {
                    bookingtype: ''
                },
                billing: {
                    other_charge: [
                        {
                            id: 0,
                            othercharge_info: '',
                            quantity: '',
                            cost: 0.00,
                            totalcost: 0.00
                        }
                    ],
                    downpayment: 0.00
                }
            }
        }
    },
    methods: {
        close() {
            this.$emit('closedialog', false)
        },
        addOtherCharge() {
            axios.post('/api/othercharge', this.addcharge)
            .then(response => {
                axios.get('/api/othercharges/' + this.roomdetails.billing.id).
                then(response => {
                    this.roomdetails.billing.other_charge = response.data
                    this.$refs.addchargeform.reset()
                })
                .catch(error => {
                    console.log(error)
                })
            })
            .catch(error => {
                console.log(error)
            })
        },
        removeOtherCharge(id) {
            if(confirm('Do you want to remove this item?')) {
                axios.delete('/api/othercharge/' + id)
                .then(response => {
                    axios.get('/api/othercharges/' + this.roomdetails.billing.id).
                    then(response => {
                        this.roomdetails.billing.other_charge = response.data
                    })
                    .catch(error => {
                        console.log(error)
                    })
                    console.log(response.data.message)
                })
                .catch(error => {
                    console.log(error)
                })
            }
        }
    },
    computed: {
        totalOtherCharge: function() {
            var totOCharge = 0.00
            this.roomdetails.billing.other_charge.forEach(function(e){
                totOCharge = parseFloat(totOCharge) + parseFloat(e.totalcost)
            })
            return parseFloat(totOCharge).toFixed(2)
        },
        totalCharges: function() {
            var totCharge = 0.00
            totCharge = parseFloat(this.totalOtherCharge) + parseFloat(this.roomdetails.bookingcharge)
            return parseFloat(totCharge).toFixed(2)
        },
        amountDue: function() {
            var amtDue = 0.00
            amtDue = parseFloat(this.totalCharges) - parseFloat(this.roomdetails.billing.downpayment)
            return parseFloat(amtDue).toFixed(2)
        }
    },
    watch: {
        roomid: function() {
            axios.get('/api/booking-by-room/' + this.roomid)
            .then(response => {
                console.log(response.data)
                this.roomdetails = response.data
                this.addcharge.billingid = this.roomdetails.billing.id
            })
            .catch(error => {
                console.log(error)
            })
        }
    }
}
</script>

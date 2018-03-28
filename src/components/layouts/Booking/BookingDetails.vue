<template>
    <v-layout row justify-center>
        <v-dialog v-model="show" persistent max-width="600">
            <v-card>
                <v-card-title class="headline">Booking Details</v-card-title>
                <v-card-text>
                    <v-layout row wrap>
                        <v-flex xs12 sm12 py-1>  
                            <strong>ROOM: </strong>{{ bookingdetails.room.room_name }}
                        </v-flex>
                        <v-flex xs12 sm12 py-1>  
                            <strong>GUEST: </strong>{{ bookingdetails.guest.fullname }} ({{ bookingdetails.guest.guest_type.guesttype }}) - {{ bookingdetails.guest.company.companyname }}
                        </v-flex>
                        <v-flex xs12 sm12 md12 py-1>  
                            <strong>EXPECTED CHECK-IN: </strong>{{ bookingdetails.checkin }}
                        </v-flex>
                        <v-flex xs12 sm12 md12 py-1>  
                            <strong>ACTUAL CHECK-IN: </strong>{{ bookingdetails.actual_checkin }}
                        </v-flex>
                        <v-flex xs12 sm12 md12 py-1>  
                            <strong>EXPECTED CHECK-OUT: </strong> <span :style="'color:' + checkoutstatcolor">{{ bookingdetails.checkout }}</span>
                        </v-flex>
                        <v-flex xs12 sm6 md6 py-1>  
                            <strong>NO. OF PAX: </strong>{{ bookingdetails.numberofpax }}
                        </v-flex>
                        <v-flex xs12 sm6 md6 py-1>  
                            <strong>BOOKING TYPE: </strong>{{ bookingdetails.booking_type.bookingtype }}
                        </v-flex>
                        <v-flex xs12 sm12 md12 pt-1>  
                            <strong>REMARKS: </strong>
                        </v-flex>
                        <v-flex xs12 sm12 md12 pb-1>  
                            {{ bookingdetails.remarks }}
                        </v-flex>
                        <v-flex xs12 sm12 md12 py-1>  
                            <strong>OTHER CHARGES: </strong>
                        </v-flex>
                        <v-flex xs12 sm12 md12 py-1>
                            <v-data-table
                                :headers="headers"
                                :items="bookingdetails.billing.other_charge"
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
                                            ₱{{ bookingdetails.bookingcharge }}<br>
                                            ---------------<br>
                                            ₱{{ totalCharges }}<br>
                                            <span style="color:#E5143D">₱{{ bookingdetails.billing.downpayment }}</span><br>
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
                                                            :rules="otherChargeInfoRules"
                                                            required
                                                            :disabled="disabled"
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm3 md3 px-2>
                                                        <v-text-field 
                                                            label="Cost" 
                                                            prefix="₱"
                                                            type="number"
                                                            v-model="addcharge.cost"
                                                            :rules="costRules"
                                                            required
                                                            :disabled="disabled"
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm2 md2 px-2>
                                                        <v-text-field 
                                                            label="Qty" 
                                                            type="number"
                                                            v-model="addcharge.quantity"
                                                            :rules="quantityRules"
                                                            required
                                                            :disabled="disabled"
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
                        <v-flex xs12 sm12 md12 py-1>
                            <v-expansion-panel popout>
                                <v-expansion-panel-content hide-actions>
                                    <div slot="header" class=".body-1"><v-icon color="green darken-1">autorenew</v-icon> <strong>Modify Booking Charge</strong></div>
                                    <v-card>
                                        <v-card-text>
                                            <v-form ref="bookingchargeform">
                                                <v-layout row>
                                                    <v-flex xs12 offset-sm1 offset-md1 sm7 md7 px-2>
                                                        <v-text-field 
                                                            label="Cost" 
                                                            prefix="₱"
                                                            type="number"
                                                            v-model="bookingdetails.bookingcharge"
                                                            :rules="bookingChargeRules"
                                                            required
                                                            :disabled="disabled"
                                                        ></v-text-field>
                                                    </v-flex>
                                                    <v-flex xs12 sm3 md3 px-2 small>
                                                        <v-btn @click="modifyBookingCharge" color="primary">Update</v-btn>
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
                    <v-btn color="blue darken-1" flat="flat" @click.stop="beforeCheckout()" >Check-out</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog v-model="statusdialog" max-width="500px">
            <v-card>
            <v-card-title>
                <strong>Room Status After Check-Out</strong>
            </v-card-title>
            <v-card-text>
                <v-select
                    :items="roomstatuses"
                    label="Select room status"
                    v-model="roomstatus"
                ></v-select>
            </v-card-text>
            <v-card-actions>
                <v-btn color="primary" flat @click.stop="checkout()">Check-out</v-btn>
            </v-card-actions>
            </v-card>
        </v-dialog>
    </v-layout>
</template>

<script>
import axios from 'axios'
import auth from './../../auth'

export default {
    name: 'booking-details',
    props: ['show', 'roomid'],
    data: () => ({
        checkoutstatcolor: '#4CAF50',
        checkoutstatus: 1,
        disabled: true,
        statusdialog: false,
        roomstatus: 2,
        otherChargeInfoRules: [
            v => !!v || 'Description is required.'
        ],
        costRules: [
            v => !!v || 'Cost is required.'
        ],
        quantityRules: [
            v => !!v || 'Quantity is required.'
        ],
        bookingChargeRules: [
            v => !!v || 'Booking charge is required.'
        ],
        roomstatuses: [
            { value: 3, text: 'VD - Vacant Dirty'},
            { value: 6, text: 'OOO - Out of Order'}
        ],
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
        bookingdetails: {
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
    }),
    methods: {
        getCheckOutStatus() {
            //get the timestamp (number of milliseconds since 01-01-1970)
            let currTime = new Date().getTime()
            let refTime = new Date(this.bookingdetails.checkoutdate + ' ' + this.bookingdetails.checkouttime).getTime()

            let timeDiff = currTime - refTime

            if(timeDiff > -3600000 && timeDiff < 3600000) {
                this.checkoutstatus = 1
            }
            else if(timeDiff < -3600000) {
                this.checkoutstatcolor = '#E65100'
                this.checkoutstatus = -1
            }
            else {
                this.checkoutstatcolor = '#E5143D'
                this.checkoutstatus = 0
            }
        },
        close() {
            this.$emit('closedialog', false)
        },
        generateInvoice() {
            axios.get('/api/invoice')
            .then(response => {
                return response
            })
            .then(error => {
                console.log(error)
            })
        },
        addOtherCharge() {
            if(this.$refs.addchargeform.validate()) {
                axios.post('/api/othercharge', this.addcharge)
                .then(response => {
                    axios.get('/api/othercharges/' + this.bookingdetails.billing.id).
                    then(response => {
                        this.bookingdetails.billing.other_charge = response.data
                        this.$refs.addchargeform.reset()
                    })
                    .catch(error => {
                        console.log(error)
                    })
                })
                .catch(error => {
                    console.log(error)
                })
            }
        },
        removeOtherCharge(id) {
            if(confirm('Do you want to remove this item?')) {
                axios.delete('/api/othercharge/' + id)
                .then(response => {
                    axios.get('/api/othercharges/' + this.bookingdetails.billing.id).
                    then(response => {
                        this.bookingdetails.billing.other_charge = response.data
                    })
                    .catch(error => {
                        console.log(error)
                    })
                })
                .catch(error => {
                    console.log(error)
                })
            }
        },
        beforeCheckout() {
            if(this.checkoutstatus === -1) {
                if(confirm('You are about to check-out customer before the expected date/time. By proceeding, it is considered that all booking charges are correct.')) {
                    this.statusdialog = true
                }
            }
            else if(this.checkoutstatus == 0) {
                if(confirm('You are about to check-out customer after the expected date/time. By proceeding, it is considered that all booking charges are correct.')) {
                    this.statusdialog = true
                }
            }
            else {
                this.statusdialog = true
            }
        },
        checkout() {
            axios.patch('/api/booking/check-out/' + this.bookingdetails.id, {
                room_id: this.roomid,
                roomstatus: this.roomstatus
            })
            .then(response => {
                alert(response.data.message)
                this.$parent.loadRooms()
                this.statusdialog = false
                this.close()
            })
            .catch(error => {
                console.log(error)
            })
            window.open('http://localhost:8000/api/invoice', '_blank');
        },
        modifyBookingCharge() {
            if(this.$refs.bookingchargeform.validate()) {
                axios.patch('/api/booking/bookingcharge/' + this.bookingdetails.id, {
                    bookingcharge: this.bookingdetails.bookingcharge
                })
                .then(response => {
                    alert(response.data.message)
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
            this.bookingdetails.billing.other_charge.forEach(function(e){
                totOCharge = parseFloat(totOCharge) + parseFloat(e.totalcost)
            })
            return parseFloat(totOCharge).toFixed(2)
        },
        totalCharges: function() {
            var totCharge = 0.00
            totCharge = parseFloat(this.totalOtherCharge) + parseFloat(this.bookingdetails.bookingcharge)
            return parseFloat(totCharge).toFixed(2)
        },
        amountDue: function() {
            var amtDue = 0.00
            amtDue = parseFloat(this.totalCharges) - parseFloat(this.bookingdetails.billing.downpayment)
            return parseFloat(amtDue).toFixed(2)
        }
    },
    watch: {
        roomid: function() {
            axios.get('/api/booking-by-room/' + this.roomid)
            .then(response => {
                this.bookingdetails = response.data
                this.addcharge.billingid = this.bookingdetails.billing.id
                this.disabled = false
                this.getCheckOutStatus()
            })
            .catch(error => {
                console.log(error)
            })
        }
    }
}
</script>

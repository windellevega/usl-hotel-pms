<template>
    <div>
        <v-dialog v-model="dialog" max-width="600px">
            <v-btn color="primary" dark slot="activator" class="mb-2">New Customer</v-btn>
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12 sm6 md6>
                                <v-text-field 
                                    prepend-icon="person"
                                    label="First Name" 
                                    v-model="editedItem.firstname"
                                    required
                                ></v-text-field>
                            </v-flex>
                             <v-flex xs12 sm6 md6>
                                <v-text-field 
                                    label="Last Name" 
                                    v-model="editedItem.lastname"
                                    required
                                ></v-text-field>
                            </v-flex>
                             <v-flex xs12 sm6 md6>
                                <v-text-field 
                                    prepend-icon="phone"
                                    label="Contact Number" 
                                    v-model="editedItem.contactno"
                                    required
                                ></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md6>
                                <v-select
                                    prepend-icon="group"
                                    :items="guesttypes"
                                    label="Guest Type"
                                    required
                                    bottom
                                    v-model="editedItem.guesttype_id"
                                ></v-select>
                            </v-flex>
                            <v-flex xs12 sm12 md12>
                                <v-select
                                    prepend-icon="group"
                                    :items="companies"
                                    label="Company Name"
                                    required
                                    bottom
                                    v-model="editedItem.company_id"
                                ></v-select>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <v-text-field label="Fat (g)" v-model="editedItem.fat"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <v-text-field label="Carbs (g)" v-model="editedItem.carbs"></v-text-field>
                            </v-flex>
                            <v-flex xs12 sm6 md4>
                                <v-text-field label="Protein (g)" v-model="editedItem.protein"></v-text-field>
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
        <v-data-table
        :headers="headers"
        :items="guests"
        hide-actions
        class="elevation-1"
        >
            <template slot="items" slot-scope="props">
                <td>{{ props.item.fullname }}</td>
                <td class="text-xs-left">{{ props.item.guest_type.guesttype }}</td>
                <td class="text-xs-left">{{ props.item.contactno }}</td>
                <td class="text-xs-left">
                    {{ props.item.company.companyname }} <span v-if="props.item.company.companyaddress">({{ props.item.company.companyaddress }})</span>
                </td>
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
                <td colspan="5" class="text-xs-center">There are no guests to show.</td>
            </template>
        </v-data-table>
    </div>
</template>

<script>
import axios from 'axios'
import auth from './../../auth'

export default {
    data: () => ({
        dialog: false,
        headers: [
            { text: 'Guest Name', value: 'fullname' },
            { text: 'Guest Type', value: 'guest_type.guesttype' },
            { text: 'Contact No.', value: 'contactno' },
            { text: 'Company', value: 'company.companyname' },
            { text: 'Actions', value: 'name', sortable: false }
        ],
        guests: [],
        guesttypes: [],
        companies: [],
        editedIndex: -1,
        editedItem: {
        },
        defaultItem: {
        }
    }),
    beforeCreate() {
        auth.checkAuth()
    },
    computed: {
        formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
        }
    },

    watch: {
        dialog (val) {
        val || this.close()
        }
    },

    created () {
        this.getCustomers()
        this.getGuestTypes()
        this.getCompanies()
    },

    methods: {
        getCustomers() {
            axios.get('/api/guests')
            .then(response => {
                if(response.data.message == undefined) {
                    this.guests = response.data
                }
            })
            .catch(error => {
                console.log(error)
            })
        },
        getGuestTypes() {
            axios.get('/api/guesttypes')
            .then(response => {
                this.guesttypes = response.data
            })
            .catch(error => {
                console.log(error)
            })
        },
        getCompanies() {
            axios.get('/api/companies')
            .then(response => {
                let companies = []
                response.data.forEach(function(e) {
                    companies.push({text: e.companyname + ' (' + e.companyaddress + ')', value: e.id})
                })
                this.companies = companies
            })
            .catch(error => {
                console.log(error)
            })
        },
        editItem (item) {
            this.editedIndex = this.guests.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem (item) {
            const index = this.guests.indexOf(item)
            confirm('Are you sure you want to delete this item?') && this.guests.splice(index, 1)
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
                Object.assign(this.guests[this.editedIndex], this.editedItem)
            } else {
                this.guests.push(this.editedItem)
            }
            this.close()
        }
    }
}
</script>
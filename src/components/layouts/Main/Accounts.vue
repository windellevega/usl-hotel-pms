<template>
    <div>
        <v-layout>
            <v-flex xs12 sm12>
                <h2 class="display-1">ACCOUNTS</h2>
                <br>
            </v-flex>
        </v-layout>
        <v-dialog v-model="dialog" max-width="500px">
            <v-btn color="primary" dark slot="activator" class="mb-2">New Account</v-btn>
            <v-card>
                <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                    <v-form ref="userform">
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
                                <v-flex v-if="this.editedIndex === -1" xs12 sm6 md6>
                                    <v-text-field 
                                        prepend-icon="person"
                                        label="First Name" 
                                        v-model="editedItem.firstname"
                                        :rules="firstnameRules"
                                        required
                                    ></v-text-field>
                                </v-flex>
                                <v-flex v-if="this.editedIndex === -1" xs12 sm6 md6>
                                    <v-text-field 
                                        label="Last Name" 
                                        v-model="editedItem.lastname"
                                        :rules="lastnameRules"
                                        required
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field v-if="this.editedIndex === -1"
                                        prepend-icon="person"
                                        label="Username" 
                                        v-model="editedItem.username"
                                        :rules="usernameRules"
                                        required
                                    ></v-text-field>
                                    <v-text-field v-else
                                        prepend-icon="person"
                                        label="Username" 
                                        v-model="editedItem.username"
                                        readonly
                                        required
                                    ></v-text-field>
                                </v-flex>
                                <v-flex v-if="this.editedIndex !== -1" xs12 sm12 md12>
                                    <v-text-field 
                                        prepend-icon="vpn_key"
                                        label="Old Password"
                                        v-model="editedItem.oldpassword"
                                        :rules="oldPasswordRules"
                                        type="password"
                                        required
                                    ></v-text-field>
                                </v-flex>
                                <v-flex v-if="this.editedIndex !== -1" xs12 sm12 md12>
                                    <v-text-field 
                                        prepend-icon="vpn_key"
                                        label="New Password"
                                        id="password"
                                        v-model="editedItem.password"
                                        :rules="passwordRules"
                                        type="password"
                                        required
                                    ></v-text-field>
                                </v-flex>
                                <v-flex v-else xs12 sm12 md12>
                                    <v-text-field 
                                        prepend-icon="vpn_key"
                                        label="Password" 
                                        id="password"
                                        v-model="editedItem.password"
                                        :rules="passwordRules"
                                        type="password"
                                        required
                                    ></v-text-field>
                                </v-flex>
                                <v-flex xs12 sm12 md12>
                                    <v-text-field 
                                        prepend-icon="vpn_key"
                                        label="Verify Password" 
                                        v-model="editedItem.verifypassword"
                                        :rules="verifyPasswordRules"
                                        type="password"
                                        required
                                    ></v-text-field>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
                    <v-btn color="blue darken-1" flat @click.native="save">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-alert :type="alerttype" dismissible v-model="alert" transition="slide-y-transition">
            {{ alertmessage }}
        </v-alert>
        <v-data-table
        :headers="headers"
        :items="users"
        hide-actions
        class="elevation-1"
        >
            <template slot="items" slot-scope="props">
                <td>{{ props.item.firstname }}</td>
                <td>{{ props.item.lastname }}</td>
                <td>{{ props.item.username }}</td>
                <td>{{ props.item.created_at }}</td>
                <td>{{ props.item.updated_at }}</td>
                <td class="justify-center layout px-0">
                <v-btn icon class="mx-0" @click="editItem(props.item)">
                    <v-icon color="teal">lock</v-icon>
                </v-btn>
                <v-btn icon class="mx-0" @click="deleteItem(props.item)">
                    <v-icon color="red accent-3">delete</v-icon>
                </v-btn>
                </td>
            </template>
            <template slot="no-data">
                <td colspan="5" class="text-xs-center">There are no users to show.</td>
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
        alertmessage: 'Success',
        editedItem: { },
        firstnameRules: [
            v => !!v || 'First Name is required',
        ],
        lastnameRules: [
            v => !!v || 'Last Name is required',
        ],
        usernameRules: [
            v => !!v || 'Username is required',
        ],
        passwordRules: [
            v => !!v || 'Password is required',
        ],
        oldPasswordRules: [
            v => !!v || 'Password is required',
        ],
        verifyPasswordRules: [
            v => !!v || 'Please confirm password',
            v => (v) == password.value || 'Password mismatch'
        ],
        headers: [
            { text: 'First Name', value: 'firstname' },
            { text: 'Last Name', value: 'lastname' },
            { text: 'Username', value: 'username' },
            { text: 'Date Created', value: 'created_at' },
            { text: 'Date Updated', value: 'updated_at' },
            { text: 'Actions', value: 'name', sortable: false }
        ],
        users: [],
        editedIndex: -1
    }),
    beforeCreate() {
        auth.checkAuth()
    },
    computed: {
        formTitle () {
            return this.editedIndex === -1 ? 'Register User' : 'Change Password'
        }
    },

    watch: {
        dialog (val) {
            val || this.close()
        }
    },

    created () {
        this.getUsers()
    },

    methods: {
        getUsers() {
            axios.get('/api/users')
            .then(response => {
                if(response.data.message == undefined) {
                    this.users = response.data
                }
            })
            .catch(error => {
                console.log(error)
            })
        },

        editItem(item) {
            this.editedIndex = this.users.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem (item) {
            const index = this.users.indexOf(item)
            if(confirm('Are you sure you want to delete this user?')) {
                axios.delete('/api/user/' + item.id)
                .then(response => {
                    this.users.splice(index, 1)
                    this.alertmessage = response.data.message
                    this.alerttype = 'info'
                    this.alert = true
                })
                .catch(error => {
                    console.log(error)
                })
            }
        },

        close() {
            this.$refs.userform.reset()
            this.formvalidation = true
            this.validationerrors = ''
            this.dialog = false
            setTimeout(() => {
            this.editedItem = Object.assign({}, this.defaultItem)
            this.editedIndex = -1
            }, 300)
        },

        save() {
            if(this.$refs.userform.validate()) {
                if(this.editedItem.id == undefined) {
                    axios.post('/api/user', this.editedItem)
                    .then(response => {
                        //Check for backend validation errors
                        if(response.data.message) {
                            this.close()
                            this.getUsers()
                            this.alertmessage = response.data.message
                            this.alerttype = 'success'
                            this.alert = true
                        }
                        else {
                            this.formvalidation = true
                            this.validationerrors = response.data
                        }
                    })
                }
                else {
                    axios.patch('/api/user/' + this.editedItem.id, this.editedItem)
                    .then(response => {
                        //Check for validation errors
                        if(response.data.message) {
                            console.log(response.data)
                            this.close()
                            this.getUsers()
                            this.alertmessage = 'Password has been successfully changed.'
                            this.alerttype = 'success'
                            this.alert = true
                        }
                        else {
                            this.formvalidation = true
                            this.validationerrors = response.data
                        }
                    })
                }
            }
            /*if (this.editedIndex > -1) {
                Object.assign(this.items[this.editedIndex], this.editedItem)
            } else {
                
            }
            this.close()*/
        }
    }
}
</script>
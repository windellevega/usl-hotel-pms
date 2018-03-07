<template>
    <v-app id="inspire">
        <v-content>
            <v-container fluid fill-height>
                <v-layout align-center justify-center>
                    <v-flex xs12 sm6 md4>
                            <v-card class="elevation-12">
                                <v-toolbar dark color="blue darken-3">
                                    <v-toolbar-title>Login</v-toolbar-title>
                                </v-toolbar>
                                <v-card-text>
                                    <div>
                                        <v-alert type="error" dismissible v-model="alert">
                                            {{ error }}
                                        </v-alert>
                                    </div>
                                    <v-form 
                                        v-model="valid" 
                                        ref="form" 
                                        lazy-validation 
                                    >
                                        <v-text-field 
                                            prepend-icon="person" 
                                            name="login" 
                                            label="Login" 
                                            type="text"
                                            v-model="credentials.username"
                                            :rules="usernameRules"
                                            @keyup.enter="Login"
                                        ></v-text-field>
                                        <v-text-field 
                                            prepend-icon="lock" 
                                            name="password" 
                                            label="Password" 
                                            id="password" 
                                            type="password"
                                            v-model="credentials.password"
                                            :rules="passwordRules"
                                            @keyup.enter="Login"
                                        ></v-text-field>
                                    </v-form>
                                    <div v-show="active">
                                        <v-progress-linear :indeterminate="true" height="4"></v-progress-linear>
                                    </div>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="primary"  @click="Login">Login</v-btn>
                                </v-card-actions>
                            </v-card>
                        
                    </v-flex>
                </v-layout>
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
    import auth from './auth'

    export default {
        name: 'login',
        data: () => ({
            active: false,
            valid: false,
            alert: false,
            drawer: null,
            error: '',
            credentials: {
                grant_type: 'password',
                client_id: 2,
                client_secret: 'GUsJwLTHKUykc6M4J5eK2X2VjhrGckCCaBbko2d9',
                username: '',
                password: '',
                scope: '*'
            },
            usernameRules: [
                v => !!v || 'Username is required',
            ],
            passwordRules: [
                v => !!v || 'Password is required',
            ]
        }),
        props: {
            source: String
        },
        created() {
            auth.logout()
        },
        methods: {
            Login() {
                if(this.$refs.form.validate()) {
                    this.active = true
                    auth.login(this, this.credentials)
                    auth.checkAuth()
                }
                
            }
        }
    }
</script>
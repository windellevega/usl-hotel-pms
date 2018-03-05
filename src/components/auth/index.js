import axios from 'axios'
import router from '@/router'

const API_URL = 'http://localhost:8000/'
const LOGIN_URL = API_URL + 'oauth/token'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.common['Accept'] = 'application/json';

export default {
    user: {
        authenticated: false
    },
    error: '',
    login(context, credentials) {
        axios.post(LOGIN_URL, credentials)
        .then(response => {
            localStorage.setItem('access_token', response.data.access_token)
            localStorage.setItem('refresh_token', response.data.refresh_token)
            this.user.authenticated = true
            router.push('/booking')
        })
        .catch(error => {
            context.alert = true
            context.error = "The user credentials were incorrect."
            context.active = false
        })
    },
    logout() {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        this.user.authenticated = false
    },
    checkAuth() {
        var token = localStorage.getItem('access_token')
        if(token) {
          this.user.authenticated = true
        }
        else {
          this.user.authenticated = false      
        }
    },
    getAuthHeader() {
        return {
          'Authorization': 'Bearer ' + localStorage.getItem('access_token')
        }
    }
}
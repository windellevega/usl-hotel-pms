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
            this.setSession(response.data)
            this.user.authenticated = true
        })
        .catch(error => {
            context.alert = true
            context.error = "The user credentials were incorrect."
            context.active = false
        })
    },
    setSession(authResult) {
        localStorage.setItem('access_token', authResult.access_token)
        localStorage.setItem('refresh_token', authResult.refresh_token)
        
        //calculate time where access token will expire
        let currTime = new Date()
        currTime = currTime.getTime()
        let expiresAt = JSON.stringify(
            authResult.expires_in * 1000 + currTime
        )
        localStorage.setItem('expires_at', expiresAt)

        router.push('/booking')
    },
    logout() {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        this.user.authenticated = false
    },
    checkAuth() {
        let currTime = new Date()
        currTime = currTime.getTime()

        if(currTime < localStorage.getItem('expires_at')) {
            this.user.authenticated = true
        }
        else {
            this.user.authenticated = false 
            alert('You are not logged in! Please login to continue.')
            router.push('/login')     
        }
    }
}
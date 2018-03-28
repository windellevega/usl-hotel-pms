import axios from 'axios'
import router from '@/router'

const API_URL = process.env.API_BASE_URL
const LOGIN_URL = API_URL + '/oauth/token'

axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
axios.defaults.headers.common['Accept'] = 'application/json';

export default {
    error: '',
    login(context, credentials) {
        axios.post(LOGIN_URL, credentials)
        .then(response => {
            if(this.setSession(response.data)) {
                router.push('/booking')
            }
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
        let expiresAt = JSON.stringify(authResult.expires_in * 1000 + currTime)
        localStorage.setItem('expires_at', expiresAt)
        return true
    },
    logout() {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('expires_at')
    },
    checkAuth() {
        let currTime = new Date()
        currTime = currTime.getTime()

        if(currTime < localStorage.getItem('expires_at')) {
            return 1
        }
        else {
            alert('You are not logged in! Please login to continue.')
            router.push('/login')     
        }
    }
}
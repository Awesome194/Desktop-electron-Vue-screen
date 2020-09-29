import LoginRequest from '../../requests/LoginRequest'
export default {
	data() {
		return {
			valid: true,
			username: null,
			password: null,
			busy: false,
			rules: {
				username: [
					v => !!v || 'The username is required.'
				],

				password: [
					v => !!v || 'The password is required.'
				]
			}
		}
	},

	computed: {
		noCan() {
			if(!this.valid || this.busy)
				return true
			return false
		}
	},

	methods: {
		login() {
			this.busy = true
			let data = {
				username: this.username,
				password: this.password,
			}
			LoginRequest.login(this, data)
		},
	},
}

class LoginRequest
{
	login(vm, data) {
		axios.post('login', data).then(r => {
			let token = r.data.access
			let user = r.data.user
			localStorage.setItem('token', token)
			window.axios.defaults.headers.common['Authorization'] = token
			vm.$router.push({
				name: 'dashboard'
			})
		}).catch(e => {
			vm.password = null
			vm.$refs.login_form.resetValidation()
			vm.busy = false
			ErrorHandler.render(e)
		})
	}

	async logout() {
		try {
			let r = await axios.get('logout')
			if(r.data.message)
				NotificationHandler.simpleSuccess(r.data.message)
			return r
		} catch(e) {
			return true
		}
	}
}

export default new LoginRequest()
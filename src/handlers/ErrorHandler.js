class ErrorHandler 
{
	render(e) {
		if(e.response) {
			this.checkResponse(e.response)
		} else {
			this.errorDefault() 
		}
	}

	errorDefault()  {
		let title = 'Error desconocido.';
		let msj = 'si el problema persiste comuniquese con nosotros.'
		NotificationHandler.errorAlert(title, msj)
	}
	
	checkResponse(r) {
		console.log(r)
		let data = r.data
		let status = r.status;
		let msg = data.message;
		let title = 'Error '+status;
		if(status == 401 && msg == 'Unauthenticate.') {
			let msg = 'Si sesion ha expirdado, por favor acceda nuevamente.'
			this.sesionExpire(msg)
		} else {
			if(data.errors) {
				this.errorMultiple(title, data.errors)
			}

			if(msg && !data.errors) {
				this.showError(msg)
			}
		}
	}
	
	showError(msj) {
		NotificationHandler.errorAlert('Error', msj)
	}

	errorMultiple(title, errors) {
		let msj = ''
		$.each(errors, function(ie, error) {
			$.each(error, function(im, message) {
				msj += '-' + message + '\n'
			});
		});
		NotificationHandler.errorAlert(title, msj)
	}

	sesionExpire(msj) {
		NotificationHandler.sesionExpire(msj)
		localStorage.removeItem('token')
		localStorage.removeItem('logged')
		localStorage.removeItem('isAdmin')
		axios.defaults.headers.common['Authorization'] = null;
		setTimeout(() => {
			window.location.reload()
		}, 2000)
	}
}

export default new ErrorHandler();
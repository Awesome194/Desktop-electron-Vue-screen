const { desktopCapturer } = window.require('electron')

class CaptureHandler
{
	async render(data) {
		let sources = await desktopCapturer.getSources({ types: ['window', 'screen'] })
		let result = await this.getStream(sources)
		if(!result.error) {
			this.from = data.from
			this.to = data.to
			this.task_id = data.task_id
			this.project_id = data.project_id
			this.date = new Date().toISOString().substr(0, 10);
			this.createImage(result.stream)	
		} else {
			console.log(result.error)
		}


	}

	async getStream(sources) {
		let data, stream;
		for(let source of sources) {
			if(source.name == 'Entire Screen') {
				try {
					stream = await navigator.mediaDevices.getUserMedia({
                        audio: false,
                        video: {
                            mandatory: {
                                chromeMediaSource: 'desktop',
                                chromeMediaSourceId: source.id,
                                minWidth: 1280,
                                maxWidth: 4000,
                                minHeight: 720,
                                maxHeight: 4000
                            }
                        }
                    });
                   data = {
                   		error: false,
                   		stream: stream
                   }

                   return data;
				} catch(e) {
					data = {
						error: e,
						stream: null
					}
					return data;
				}
			}
		}
	}

	createImage(stream) {
		let format = 'image/png'

		let _this = this

		// Create Vide element
		var video = document.createElement('video');
        video.style.cssText = 'position:absolute;top:-10000px;left:-10000px;';

        // Event connected to stream
        video.onloadedmetadata = function () {
            // Set video ORIGINAL height (screenshot)
            video.style.height = this.videoHeight + 'px'; // videoHeight
            video.style.width = this.videoWidth + 'px'; // videoWidth

            video.play();

            // Create canvas
            var canvas = document.createElement('canvas');
            canvas.width = this.videoWidth;
            canvas.height = this.videoHeight;
            var ctx = canvas.getContext('2d');
            // Draw video on canvas
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            let image = canvas.toDataURL(format)
            _this.send(image)

            video.remove();
        }

        video.srcObject = stream;
        document.body.appendChild(video);
	}

	send(image) {
		let id = this.project_id
		let data = {
			from: this.from,
			to: this.to,
			date: this.date,
			task_id: this.task_id,
			image: image
		}
	 	axios.post('new-screenshot/'+id, data).then(r => {
	 		let msj = r.data.messag
	 		console.log(msj)
	 	}).catch(e => {
	 		ErrorHandler.render(e)
	 	})
	}
}

export default new CaptureHandler();
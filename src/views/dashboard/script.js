import LoginRequest from '../../requests/LoginRequest'
import JobRequest from '../../requests/JobRequest'
import times from './times'
import props from './properties'


export default {
	data() {
		return {
			closing: false,
			working: false,
			stoping: false,
			edit_timer: false,
			times: times,
			timeScreen: props.timeScreen,
			totalWorkedToday: props.totalWorkedToday,
			timer: {
				h: 0,
				m: 0,
				s: 0,
				passed: 0
			},
			busyJob: false,
			jobSelected: null,
			jobsList: [],
			searchJob: null,
			jobsWorkedToday: props.jobsWorkedToday,
			job: null,

			busyTask: false,
			tasksItemsToShow: 20,
			tasksList: [],
			totalTasks: [],
			tasksTableHeaders: props.tasksTableHeaders,
			tasksItemsPerPageList: props.tasksItemsPerPageList,
			tasksCompleted: false,
			tasksPage: 1,
			searchTask: null,

		}
	},
	created() {
		this.getJobs()
	},

	watch: {
		tasksCompleted(val) {
			let totalTasks = this.totalTasks
			if(val) {
				this.tasksList = totalTasks
			} else {
				let tasks = []
				$.each(totalTasks, (i, t) => {
					if(!t.completed)
						tasks.push(t)
				});
				this.tasksList = tasks
			}
		},
		timeScreen(val) {
			localStorage.setItem('timeScreen', val)
		},
		async working(val) {
			if(!this.working) {
				this.stoping = true
				let msj = 'Do you want to stop really?'
				let r = await NotificationHandler.confirm(msj)
				if(r) {
					this.stop()
				} else {
					this.stoping = false
					this.working = true
				}
			} else {
				this.start()
			}
		} 
	},

	computed: {
		busy() {
			if(this.busyJob || this.working || this.busyTask)
				return true
			return false
		},
		timeWorked() {
			let h = this.totalWorkedToday.hours
			let mt = this.totalWorkedToday.mins
			let m = mt < 10 ? '0'+mt : mt
			return h + ':' + m
		},
		jobTitle() {
			if(!this.job)
				return 'No Selected Job'
			return this.job.title
		},

		taskItemsPerPage() {
			let t = this.tasksItemsToShow
			if(t == 'all')
				return this.tasksList.length
			return t
		},
		totalTasksPages() {
			let total = this.tasksList.length
			let perPage = this.taskItemsPerPage
			let pages = total / perPage
			if(pages < 0) {
				return 0
			} else {
				let pages_total = Math.round(pages)
				if(pages > pages_total)
					return pages_total + 1
				return pages_total
			}
		},
		timerCounter() {
			let th = this.timer.h
			let tm = this.timer.m
			let ts = this.timer.s

			let h = th < 10 ? '0'+th : th
			let m = tm < 10 ? '0'+tm : tm
			let s = ts < 10 ? '0'+ts : ts

			return h+':'+m+':'+s
		},

		timerColor() {
			if(this.working && !this.stoping) {
				return 'warning'
			} else if(this.working && this.working) {
				return 'success'
			} else {
				return 'primary'
			}
			
		},

		pauseIcon() {
			if(this.working && !this.stoping) {
				return 'fa-pause'
			} else if (this.working && this.stoping) {
				return 'fa-play'
			} else {
				return ''
			}

		},

	},

	methods: {
		getJobs() {
			this.jobsList = []
			this.busyJob = true
			JobRequest.index(this)
		},

		selectJob(job) {
			this.jobSelected = 'job-sel-'+job.id
			this.job = job
			let id = job.id
			this.getTasks(id)
		},

		getTasks(id) {
			this.busyTask = true
			JobRequest.tasks(this, id)
		},

		start() {
			setTimeout(() => {
				this.runing()
			}, 1000)
		},

		stop() {
			this.stoping = false
			this.timer.h = 0
			this.timer.m = 0
			this.timer.s = 0
			this.timer.passed = 0
		},

		runing() {
			if(this.working) {
				if(!this.stoping) {
					this.changeTimer()
					this.$nextTick(() => {
						let passed = this.timer.passed
						let timeScreen = this.timeScreen
						if(passed == timeScreen) {
							NotificationHandler.simpleSuccess('Captured')
							this.timer.passed = 0
						}
					})
				}

				setTimeout(() => {
					this.runing()
				}, 1000)
			}
		},

		changeTimeToJob() {
			let job = this.job
			let items  = job.time.split(':')
			let h = parseInt(items[0])
			let tMins = parseInt(items[1])
			let mins, time, min
			tMins++

			if(tMins > 59) {
				mins = 0
				h++
			} else {
				mins = tMins
			}

			min = mins < 10 ? '0'+mins : mins

			time = h+':'+min
			job.time = time
			let wJobs = this.jobsWorkedToday.items

			let newJob, found = false
			if(wJobs.length > 0) {
				for(let j of wJobs) { 
					if(j.id == job.id) {
						found = true
						j.time = time
						break
					} else {
						found = false
					}
				}

				if(!found) {
					newJob = {
						id: job.id,
						time: time
					}
					wJobs.push(newJob)
				}
			} else {
				newJob = {
					id: job.id,
					time: time
				}
				wJobs.push(newJob)
			}

			localStorage.setItem('JobsWorkedToday', JSON.stringify(this.jobsWorkedToday))
		},
		getJobsTimeToday() {
			for(let aJob of this.jobsList) {
				let wJobs = this.jobsWorkedToday.items
				let time
				if(wJobs.length > 0) {
					for(let j of wJobs) {
						if(j.id == aJob.id) {
							time = j.time
							aJob.time = time
							break;
						} else {
							time = 0+':00'
							aJob.time = time
						}
					}
				} else {
					time = 0+':00'
					aJob.time = time
				}
			}
		},

		changeTimer() {
			this.timer.s += 1

			let th = this.timer.h
			let tm = this.timer.m
			let ts = this.timer.s

			if(ts > 59 && tm < 59) {
				this.timer.s = 0
				this.timer.m += 1
				//
				this.changeTimeToJob()
				let twm = this.totalWorkedToday.mins += 1
				if(twm > 59) {
					this.totalWorkedToday.mins = 0
					this.totalWorkedToday.hours += 1
				}
				localStorage.setItem('totalWorkedToday', JSON.stringify(this.totalWorkedToday))
				//
			} 

			if(tm > 59) {
				this.timer.m = 0
				this.timer.h += 1
			} 

			this.timer.passed += 1
		},

		async logout() {
			let msj = 'Do you want sign out?'
			let r = await NotificationHandler.confirm(msj)
			if(r) {
				this.closing = true
				let c = await LoginRequest.logout(this)
				localStorage.removeItem('token')
				window.axios.defaults.headers.common['Authorization'] = null
				this.$router.push({
					name: 'login'
				})
			}
		}
	}
}
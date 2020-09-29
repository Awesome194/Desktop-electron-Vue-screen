import LoginRequest from '../../requests/LoginRequest'
import ProjectRequest from '../../requests/ProjectRequest'
import props from './properties'


export default {
	async beforeRouteEnter(to, from, next) { 
		try {
			let r = await axios.get('user')
			let user = r.data.user
			let company = r.data.company
			next(vm => vm.getUserDetails(user, company))
		} catch(e) {
			ErrorHandler.render(e)
			localStorage.removeItem('token')
			window.axios.defaults.headers.common['Authorization'] = null
			next({ name: 'login' })
		}
	},
	data() {
		return {
			closing: false,
			working: false,
			stoping: false,
			totalWorkedToday: props.totalWorkedToday,
			timePassed: props.timePassed,
			lastScreenshot: 0,
			timer: {
				h: 0,
				m: 0,
				s: 0,
				passed: 0
			},
			busyProject: false,
			projectSelected: null,
			projectsList: [],
			searchProject: null,
			projectsWorkedToday: props.projectsWorkedToday,
			project: null,

			busyTask: false,
			tasksItemsToShow: 20,
			tasksList: [],
			totalTasks: [],
			tasksTableHeaders: props.tasksTableHeaders,
			tasksItemsPerPageList: props.tasksItemsPerPageList,
			tasksCompleted: false,
			tasksPage: 1,
			searchTask: null,
			taskSelected: null,
			task: null,
			completingTask: false,

			company: {},
			user: {}

		}
	},
	created() {
		this.getProjects()
	},

	watch: {
		timePassed(val) {
			localStorage.setItem('projectsWorkedToday', JSON.stringify(val))
		},
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
				this.stoping = false
				this.start()
				let win = this.$electron.remote.getCurrentWindow()
				win.minimize()
			}
		} 
	},

	computed: {
		busy() {
			if(this.busyProject || this.working || this.busyTask)
				return true
			return false
		},
		timeWorked() {
			let h = this.totalWorkedToday.hours
			let mt = this.totalWorkedToday.mins
			let m = mt < 10 ? '0'+mt : mt
			return h + ':' + m
		},
		projectTitle() {
			if(!this.project)
				return 'No Selected project'
			return this.project.title
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
		getUserDetails(user, company) {
			this.user = user
			this.company = company
		},
		getProjects() {
			this.busyProject = true
			this.tasksList = []
			this.totalTasks = []
			this.project = null
			this.projectSelected = null
			this.projectsList = []
			ProjectRequest.index(this)
		},

		selectProject(project, start) {
			let projectSelected = this.projectSelected
			if(projectSelected !== 'project-sel-'+project.id) {
				this.projectSelected = 'project-sel-'+project.id
				this.project = project
				let id = project.id
				this.getTasks(id)
			}
			
			if(start) {
				this.working = true
				this.stoping = false
			} else {
				this.stoping = true
			}
			
		},
		selectTask(task, start) {
			let taskSelected = this.taskSelected
			if(taskSelected !== 'task-sel-'+task.id) {
				this.taskSelected = 'task-sel-'+task.id
				this.task = task
			}
			
			if(start) {
				this.working = true
				this.stoping = false
			} else {
				this.stoping = true
			}
		},

		async completeTask(task) {
			let cm = 'Are you sure the task is complete?'
			let c = await NotificationHandler.confirm(cm)
			if(c) {
				let id = task.id
				let r = await ProjectRequest.completeTask(id)
				if(r) {
					let msj = r.data.message
					this.taskSelected = null
					this.task = null
					NotificationHandler.simpleSuccess(msj)
					$.each(this.totalTasks, (i, t) => {
						if(t.id == id) {
							t.completed = true
						}
					});
					this.$nextTick(() => {
						this.tasksList = []
						let totalTasks = this.totalTasks
						if(this.tasksCompleted) {
							this.tasksList = totalTasks
						} else {
							let tasks = []
							$.each(totalTasks, (i, t) => {
								if(!t.completed)
									tasks.push(t)
							});
							this.tasksList = tasks
						}
					})
				}
			}
		},

		getTasks(id) {
			this.busyTask = true
			ProjectRequest.tasks(this, id)
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
						let timeScreen = this.company.time
						if(passed == timeScreen) {
							NotificationHandler.simpleSuccess('Captured')
							this.timer.passed = 0
							let task_id
							if(this.task) {
								task_id = this.task.id
							} else {
								task_id = null
							}
							let data = {
								from: this.lastScreenshot,
								to: this.timePassed.time,
								task_id: task_id,
								project_id: this.project.id
							}
							CaptureHandler.render(data)
							this.lastScreenshot = this.timePassed.time
						}
					})

				}

				setTimeout(() => {
					this.runing()
				}, 1000)
			}
		},

		changeTimeToProject() {
			let project = this.project
			let items  = project.time.split(':')
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
			project.time = time
			let wProjects = this.projectsWorkedToday.items

			let newProject, found = false
			if(wProjects.length > 0) {
				for(let p of wProjects) { 
					if(p.id == project.id) {
						found = true
						p.time = time
						break
					} else {
						found = false
					}
				}

				if(!found) {
					newProject = {
						id: project.id,
						time: time
					}
					wProjects.push(newProject)
				}
			} else {
				newProject = {
					id: project.id,
					time: time
				}
				wProjects.push(newProject)
			}

			localStorage.setItem('projectsWorkedToday', JSON.stringify(this.projectsWorkedToday))
		},
		getProjectsTimeToday() {
			for(let aProject of this.projectsList) {
				let wProjects = this.projectsWorkedToday.items
				let time
				if(wProjects.length > 0) {
					for(let j of wProjects) {
						if(j.id == aProject.id) {
							time = j.time
							aProject.time = time
							break;
						} else {
							time = 0+':00'
							aProject.time = time
						}
					}
				} else {
					time = 0+':00'
					aProject.time = time
				}
			}
		},

		changeTimer() {
			this.timer.s += 1

			let th = this.timer.h
			let tm = this.timer.m
			let ts = this.timer.s

			if(ts > 59) {
				this.timer.s = 0
				this.timer.m += 1

				this.changeTimeToProject()
				let twm = this.totalWorkedToday.mins += 1
				if(twm > 59) {
					this.totalWorkedToday.mins = 0
					this.totalWorkedToday.hours += 1
				}
				localStorage.setItem('totalWorkedToday', JSON.stringify(this.totalWorkedToday))
			}

			if(tm > 59) {
				this.timer.s = 0
				this.timer.m = 0
				this.timer.h += 1
			}

		
			this.timer.passed += 1
			this.timePassed.time += 1
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
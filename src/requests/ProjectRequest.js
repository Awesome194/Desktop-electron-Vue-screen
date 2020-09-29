class ProjectRequest
{
	index(vm) {
		axios.get('projects-list').then(r => {
			vm.projectsList = r.data.list
			vm.$nextTick(() => {
				vm.getProjectsTimeToday()
				vm.busyProject = false
			})
		}).catch(e =>{
			ErrorHandler.render(e)
			vm.busyProject = false
		})
	}

	tasks(vm, id) {
		axios.get('project-tasks-list/'+id).then(r => {
			vm.$nextTick(() => {
				let totalTasks = r.data.list
				if(vm.tasksCompleted) {
					vm.tasksList = totalTasks
				} else {
					let tasks = []
					$.each(totalTasks, (i, t) => {
						if(!t.completed)
							tasks.push(t)
					});
					vm.tasksList = tasks
				}
				vm.totalTasks = totalTasks
				vm.busyTask = false
			})
			
		}).catch(e =>{
			ErrorHandler.render(e)
			vm.busyTask = false
		})
	}

	async completeTask(id) {
		try {
			let r = await axios.get('complete-task/'+id)
			return r
		} catch(e) {
			ErrorHandler.render(e)
			return null
		}
	}
}

export default new ProjectRequest()
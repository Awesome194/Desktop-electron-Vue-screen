class JobRequest
{
	index(vm) {
		axios.get('jobs-list').then(r => {
			vm.jobsList = r.data.list
			vm.$nextTick(() => {
				vm.getJobsTimeToday()
				vm.busyJob = false
			})
		}).catch(e =>{
			ErrorHandler.render(e)
			vm.busyJob = false
		})
	}

	tasks(vm, id) {
		axios.get('job-tasks-list/'+id).then(r => {
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
}

export default new JobRequest()
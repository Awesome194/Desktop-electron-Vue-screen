function getTotalWorkedToday() {
	let item = JSON.parse(localStorage.getItem('totalWorkedToday'))
	let today = new Date().toISOString().substr(0, 10);
	let total
	if(!item || item.date != today) {
		total = {
			date: today,
			hours: 0,
			mins: 0,
		}
		localStorage.setItem('totalWorkedToday', JSON.stringify(total))
		return total
	} else {
		return item
	}


}

function getJobsWorkedToday() {
	let jobs = JSON.parse(localStorage.getItem('JobsWorkedToday')) 
	let today = new Date().toISOString().substr(0, 10);
	if(!jobs || today != jobs.date) {
		jobs = {
			date: today,
			items: []
		}
		localStorage.setItem('JobsWorkedToday', JSON.stringify(jobs))
	}
	return jobs
}

const props = {
	timeScreen: localStorage.getItem('timeScreen') ? parseInt(localStorage.getItem('timeScreen')) : 3600,
	totalWorkedToday: getTotalWorkedToday(),
	jobsWorkedToday: getJobsWorkedToday(),
	tasksItemsPerPageList: [
		{
			text: 'All tasks',
			value: 'all'
		},
		{
			text: '5',
			value: 5
		},
		{
			text: '10',
			value: 10
		},
		{
			text: '20',
			value: 20
		},
		{
			text: '50',
			value: 50
		},
		{
			text: '100',
			value: 100
		}
	],
	tasksTableHeaders:[
		{
			text: 'Title',
			value: 'title',
			sortable: false
		},
		{
			text: 'Description',
			value: 'description',
			sortable: false
		},
		{
			text: 'Completed',
			value: 'completed',
			sortable: false,
			align: 'center'
		},
		{
			text: '',
			value: 'actions'
		}
	]
}

export default props
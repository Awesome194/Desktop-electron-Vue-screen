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

function getProjectsWorkedToday() {
	let projects = JSON.parse(localStorage.getItem('projectsWorkedToday')) 
	let today = new Date().toISOString().substr(0, 10);
	if(!projects || today != projects.date) {
		projects = {
			date: today,
			items: []
		}
		localStorage.setItem('projectsWorkedToday', JSON.stringify(projects))
	}
	return projects
}


function getTimePassed() {
	let timePassed = JSON.parse(localStorage.getItem('timePassed')) 
	let today = new Date().toISOString().substr(0, 10);
	if(!timePassed || today != timePassed.date) {
		timePassed = {
			date: today,
			time: 0
		}
		localStorage.setItem('projectsWorkedToday', JSON.stringify(timePassed))
	}
	return timePassed
}

const props = {
	totalWorkedToday: getTotalWorkedToday(),
	projectsWorkedToday: getProjectsWorkedToday(),
	timePassed: getTimePassed(),
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
		},
		{
			text: 'Details',
			value: 'details',
			sortable: false
		},
		{
			text: 'Status',
			value: 'completed',
			sortable: false,
			align: 'center'
		},
		{
			text: '',
			value: 'actions',
			sortable: false
		}
	]
}

export default props
// Middlewares
import Auth from '../middlewares/Auth'
import NoAuth from '../middlewares/NoAuth'

const routes = [
	{
		path: '',
		redirect: { name: 'login' }
	},
	{
		path: '/login',
		name: 'login',
		beforeEnter: NoAuth,
		component: require('../views/login/template.vue').default
	},
	{
		path: '/dashboard',
		name: 'dashboard',
		beforeEnter: Auth,
		component: require('../views/dashboard/template.vue').default
	}
]

export default routes
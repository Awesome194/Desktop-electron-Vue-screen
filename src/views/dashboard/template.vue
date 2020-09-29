<template>
	<div>
		<v-dialog 
				v-model="closing"
		      	persistent
		      	width="300"
			>	
			<v-card color="primary" dark>
				<v-card-text>
					Closing...
					<v-progress-linear
			        	indeterminate
			        	color="white"
			        	class="mb-0"
			        ></v-progress-linear>
				</v-card-text>
			</v-card>
		</v-dialog>
		<v-navigation-drawer 
			width="520"
			permanent 
			app
		>
			<v-toolbar :color="timerColor" dark flat dense>
				<v-spacer></v-spacer>
					<v-toolbar-title>
						Time Work Counter
					</v-toolbar-title>
				<v-spacer></v-spacer>
				</v-spacer>
			</v-toolbar>
			<v-toolbar flat>
				<v-toolbar-items>
					<v-tooltip bottom v-if="working">
						<template v-slot:activator="{ on }">
							<v-btn 
								v-on="on"
								icon
								@click="working = false"
							>
								<v-icon :color="timerColor">
									far fa-stop-circle
								</v-icon>
							</v-btn>
						</template>
						<span>
							Stop
						</span>
					</v-tooltip>
					<v-tooltip bottom v-else>
						<template v-slot:activator="{ on }">
							<v-btn 
								v-on="on"
								icon
								@click="working = true"
								:disabled="!project || busy"
							>
								<v-icon color="primary">
									far fa-play-circle
								</v-icon>
							</v-btn>
						</template>
						<span>
							Start
						</span>
					</v-tooltip>
				</v-toolbar-items>
				<v-spacer></v-spacer>
				<v-text-field
					prepend-inner-icon="far fa-clock"
					:append-icon="pauseIcon"
					@click:append="stoping = !stoping"
					class="counter-timer"
					v-model="timerCounter"
					:background-color="timerColor"
					dark
					outlined
					hide-details
					dense
					readonly
				>	
				</v-text-field>
				<v-spacer></v-spacer>
			</v-toolbar>
			<v-divider></v-divider>
			<v-toolbar flat dense>
				<v-spacer></v-spacer>
				<v-toolbar-title>
					<h3>
						{{ company.name }}
					</h3>
				</v-toolbar-title>
				<v-spacer></v-spacer>
			</v-toolbar>
			<v-toolbar flat dense>
				<v-spacer></v-spacer>
				<v-toolbar-title>
					<v-subheader>
						Total worked today {{ timeWorked }}
					</v-subheader>
				</v-toolbar-title>
				<v-spacer></v-spacer>
			</v-toolbar>
			<v-toolbar flat dense>
				<v-text-field
					prepend-inner-icon="fa-search"
					label="Search project"
					v-model="searchProject"
					outlined
					dense
					hide-details
					color="info"
				></v-text-field>
			</v-toolbar>
			<v-toolbar class="mt-2" flat dense dark>
				<v-toolbar-title>
					Projects list:
				</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-tooltip right>
					<template v-slot:activator="{ on }">
						<v-btn v-on="on" :disabled="busy" @click="getProjects" icon>
							<v-icon>
								fa-redo-alt
							</v-icon>
						</v-btn>
					</template>
					<span>
						Update List
					</span>
				</v-tooltip>
			</v-toolbar>
			<v-divider class="mb-2"></v-divider>
			<v-data-table
				:loading="busyProject"
				:headers="[{text: '', value: 'title'}]"
				:search="searchProject"
				height="330"
				:items="projectsList"
				:items-per-page="projectsList.length"
				hide-default-footer
				hide-default-header
				loading-text="Loading..."
			>
				<template v-slot:item.title="{ item }">
						<v-toolbar flat dense :dark="projectSelected == 'project-sel-'+item.id">
							<v-toolbar-items>
								<v-tooltip 
									v-if="working && projectSelected == 'project-sel-'+item.id && !stoping" 
									bottom
								>
									<template v-slot:activator="{ on }">
										<v-btn v-on="on" @click="stoping = true" icon>
											<v-icon>
												fa-pause
											</v-icon>
										</v-btn>
									</template>
									<span>
										Stop
									</span>
								</v-tooltip>
								<v-tooltip bottom v-else>
									<template v-slot:activator="{ on }">
										<v-btn v-on="on" @click="selectProject(item, true)" icon>
											<v-icon>
												fa-play
											</v-icon>
										</v-btn>
									</template>
									<span>
										Start
									</span>
								</v-tooltip>
							</v-toolbar-items>
							<v-list-item @click="selectProject(item, false)" link>
							<v-toolbar-title>
								<h6>
									{{ item.title }}
								</h6>
							</v-toolbar-title>
							<v-spacer></v-spacer>
							<v-chip class="mr-2">
								{{ item.time }}
							</v-chip>
							</v-list-item>
						</v-toolbar>
					
				</template>
			</v-data-table>
		</v-navigation-drawer>
		<v-content>
			<v-toolbar dark flat dense>
				<v-toolbar-title>
					Tasks
				</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-toolbar-items>
					<v-menu offset-y>
						<template v-slot:activator="{ on }">
							<v-btn
								text
								v-on="on"
							>
								<v-icon>
									fa-ellipsis-v
								</v-icon>
							</v-btn>
						</template>
						<v-list>
							<v-list-item link @click="logout">
								<v-list-item-icon>
									<v-icon>
										fa-sign-out-alt
									</v-icon>
								</v-list-item-icon>
								<v-list-item-content>
									<v-list-item-title>
										Sign Out
									</v-list-item-title>
								</v-list-item-content>
							</v-list-item>
						</v-list>
					</v-menu>
				</v-toolbar-items>
			</v-toolbar>
			<v-container fluid>
				<v-sheet>
					<v-subheader>
						<b class="mr-2">Project:</b>{{ projectTitle }}
					</v-subheader>
						<v-row justify="space-around">
							<v-col cols="4">
								<v-select
									label="See Tasks:"
									hide-details
									dense
									outlined
									v-model="tasksItemsToShow"
									:items="tasksItemsPerPageList"
								></v-select>
							</v-col>
							<v-col cols="3" class="pt-1">
								<v-checkbox
									label="Show completed"
									v-model="tasksCompleted"
									class="pt-0"
									hide-details
								></v-checkbox>
							</v-col>
							<v-col cols="4">
								<v-text-field
									prepend-inner-icon="fa-search"
									label="Search task:"
									hide-details
									dense
									outlined
									v-model="searchTask"
								></v-text-field>
							</v-col>
						</v-row>
				</v-sheet>
			</v-container>
			<v-divider></v-divider>
			<v-container>
				<v-row align="center" v-if="!busyTask && tasksList.length == 0">
					<v-col cols="12">
						<v-row justify="center">
							<v-icon x-large>
								fa-tasks
							</v-icon>
						</v-row>
						<v-row justify="center">
							<v-subheader>
								There're not tasks avaliable. 
							</v-subheader>
						</v-row>
					</v-col>
				</v-row>
				<v-row justify="center" v-if="busyTask">
					<v-col cols="8">
						<v-progress-linear
							indeterminate
						></v-progress-linear>
						<v-row justify="center">
							<v-subheader>
								Loading...
							</v-subheader>
						</v-row>
					</v-col>
				</v-row>
				<v-row v-if="!busyTask && tasksList.length > 0">
					<v-col cols="12">
						<v-toolbar flat dense>
							<v-spacer></v-spacer>
							<v-pagination 
								v-model="tasksPage" 
								:length="totalTasksPages"
								v-if="tasksItemsToShow != 'all'"

							></v-pagination>
							<v-spacer></v-spacer>
						</v-toolbar>
						<v-sheet>
							<v-row>
								<v-col cols="12">
									<v-data-table
										:page.sync="tasksPage"
										:headers="tasksTableHeaders"
										:search="searchTask"
										height="370"
										:items="tasksList"
										:items-per-page="taskItemsPerPage"
										hide-default-footer
									>
										<template v-slot:item.title="{ item }">
											<v-list-item dense link @click="selectTask(item, false)" 
												:disabled="!stoping && working || item.completed == 1">
												<v-icon class="mr-2" color="success" v-if="taskSelected == 'task-sel-'+item.id" small>
													fa-check-circle
												</v-icon>
												<v-list-item-title>
													{{ item.title }}
												</v-list-item-title>
											</v-list-item>
										</template>
										<template v-slot:item.details="{ item }">
											<v-menu max-width="200" offset-y nudge-left="10">
												<template v-slot:activator="{ on }">
													<v-btn v-on="on" icon>
														<v-icon color="info">
															fa-info-circle
														</v-icon>
													</v-btn>
												</template>
												<v-card>
													<v-card-title>
														Description:
													</v-card-title>
													<v-card-text>
														{{ item.description }}
													</v-card-text>
												</v-card>
											</v-menu>
										</template>
										<template v-slot:item.completed="{ item }">
											<v-tooltip top>
												<template v-slot:activator="{ on }">
													<v-icon v-on="on" v-if="item.completed == 1" color="success">
														fa-check-double
													</v-icon>
												</template>
												<span>
													Completed
												</span>
											</v-tooltip>
											<v-tooltip top>
												<template v-slot:activator="{ on }">
													<v-icon v-on="on" v-if="item.completed == 0" color="warning">
														fa-exclamation-triangle
													</v-icon>
												</template>
												<span>
													Pending
												</span>
											</v-tooltip>
										</template>
										<template v-slot:item.actions="{ item }">
											<div v-if="!item.completed">
												<v-tooltip 
													v-if="!stoping && taskSelected == 'task-sel-'+item.id && working" 
													top
												>
													<template v-slot:activator="{ on }">
														<v-btn class="mr-2" v-on="on" @click="stoping = true" icon>
															<v-icon color="warning">
																fa-pause
															</v-icon>
														</v-btn>
													</template>
													<span>
														Pause
													</span>
												</v-tooltip>
												<v-tooltip top v-else>
													<template v-slot:activator="{ on }">
														<v-btn 
															:disabled="!stoping && taskSelected && taskSelected !== 'task-sel-'+item.id && working && taskSelected" 
															class="mr-2" v-on="on" 
															@click="selectTask(item, true)" 
															icon
														>
															<v-icon color="primary">
																fa-play
															</v-icon>
														</v-btn>
													</template>
													<span>
														Start
													</span>
												</v-tooltip>
												<v-tooltip top>
													<template v-slot:activator="{ on }">
														<v-btn
															@click="completeTask(item)" 
															:disabled="working && taskSelected !== 'task-sel-'+item.id && !stoping
															|| !stoping && working && taskSelected == 'task-sel-'+item.id" 
															v-on="on" 
															icon
														>
															<v-icon color="info">
																fa-check
															</v-icon>
														</v-btn>
													</template>
													<span>
														Mark as completed
													</span>
												</v-tooltip>
											</div>
										</template>
									</v-data-table>
								</v-col>
							</v-row>
						</v-sheet>
					</v-col>
				</v-row>
			</v-container>
		</v-content>
		<v-footer app>
			<v-spacer></v-spacer>
			<v-subheader>
				&copy; Copyright 2020
			</v-subheader>
			<v-spacer></v-spacer>
		</v-footer>
	</div>
</template>

<script src="./script.js"></script>
<style>
	@import 'style.css';
</style>
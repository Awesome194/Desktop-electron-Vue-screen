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
		<v-dialog width="300" hight="100" v-model="edit_timer">
			<v-card>
				<v-card-title>
					Screenshot each:
				</v-card-title>
				<v-card-text>
					<v-select
						v-model="timeScreen"
						:items="times"
						dense
						hide-details
					>
					</v-select>
				</v-card-text>
				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn
						color="primary"
						depressed
						@click="edit_timer = false"
					>
						OK
					</v-btn>
				</v-card-actions>
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
					<v-tooltip bottom>
						<template v-slot:activator="{ on }">
							<v-btn
								@click="edit_timer = true"
								v-on="on"
								icon
							>
								<v-icon :color="timerColor">
									fa-edit
								</v-icon>
							</v-btn>
						</template>
						<span>
							Edit
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
				<v-toolbar-items>
					<v-tooltip bottom v-if="working">
						<template v-slot:activator="{ on }">
							<v-btn 
								v-on="on"
								icon
								@click="working = !working"
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
								@click="working = !working"
								:disabled="!job || busy"
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
			</v-toolbar>
			<v-divider></v-divider>
			<v-toolbar flat dense>
				<v-spacer></v-spacer>
				<v-toolbar-title>
					<h3>
						{{ jobTitle }}
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
					label="Search job"
					v-model="searchJob"
					outlined
					dense
					hide-details
					color="info"
				></v-text-field>
			</v-toolbar>
			<v-toolbar class="mt-2" flat dense dark>
				<v-toolbar-title>
					Jobs list:
				</v-toolbar-title>
				<v-spacer></v-spacer>
				<v-tooltip right>
					<template v-slot:activator="{ on }">
						<v-btn v-on="on" :disabled="busy" @click="getJobs" icon>
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
				:loading="busyJob"
				:headers="[{text: '', value: 'title'}]"
				:search="searchJob"
				height="360"
				:items="jobsList"
				:items-per-page="jobsList.length"
				hide-default-footer
				hide-default-header
				loading-text="Loading..."
			>
				<template v-slot:item.title="{ item }">
					<v-toolbar flat dense :dark="jobSelected == 'job-sel-'+item.id">
						<v-toolbar-title>
							<h6>
								{{ item.title }}
							</h6>
						</v-toolbar-title>
						<v-spacer></v-spacer>
						<v-chip class="mr-2">
							{{ item.time }}
						</v-chip>
						<v-tooltip right>
							<template v-slot:activator="{ on }">
								<v-btn
									:disabled="busyJob"
									:loading="busy && jobSelected == 'job-sel-'+item.id"
									v-on="on" 
									@click="selectJob(item)" 
									small 
									icon
								>
									<v-icon>
										fa-chevron-circle-right
									</v-icon>
								</v-btn>
							</template>
							<span>
								Select
							</span>
						</v-tooltip>
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
						{{ jobTitle }}
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
										<template v-slot:item.completed="{ item }">
											<v-icon color="success" v-if="item.completed">
												fa-check
											</v-icon>
											<v-icon color="primary" v-else>
												fa-info
											</v-icon>
										</template>
										<template v-slot:item.actions="{ item }">
											<v-menu offset-y>
												<template v-slot:activator="{ on }">
													<v-btn v-on="on" text>
														<v-icon>
															fa-caret-down
														</v-icon>
													</v-btn>
												</template>
												<v-list dense>
													<v-list-item v-if="item.completed" link>
														<v-list-item-icon>
															<v-icon small>
																fa-info
															</v-icon>
														</v-list-item-icon>
														<v-list-item-content>
															<v-list-item-title>		
																Mark as not completed
															</v-list-item-title>
														</v-list-item-content>
													</v-list-item>
													<v-list-item v-else link>
														<v-list-item-icon>
															<v-icon small>
																fa-check
															</v-icon>
														</v-list-item-icon>
														<v-list-item-content>
															<v-list-item-title>		
																Mark as completed
															</v-list-item-title>
														</v-list-item-content>
													</v-list-item>
												</v-list>
											</v-menu>
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
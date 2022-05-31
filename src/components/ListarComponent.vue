<template>
	<v-container>
		<v-app-bar app>
			<v-toolbar-title>CRUD Empleados</v-toolbar-title>
			<v-spacer></v-spacer>
			<v-menu left bottom>
				<template v-slot:activator="{ on, attrs }">
					<v-btn icon v-bind="attrs" v-on="on">
						<v-icon>mdi-dots-vertical</v-icon>
					</v-btn>
				</template>

				<v-list>
					<v-list-item @click="() => {}">
						<v-list-item-title @click="logout()">Salir</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
		</v-app-bar>
		<vue-headful title=".::Empleados::." />
		<div v-if="loading" align="center" class="text-center">
			<v-progress-circular indeterminate color="primary"></v-progress-circular><span>Cargando...</span>
		</div>
		<v-card>
			<v-toolbar dark color="primary">
				<v-toolbar-title>Empleados</v-toolbar-title>
			</v-toolbar>
			<div v-if="errored" align="center" class="text-center">
				<v-alert type="error">
					Error de conexión
				</v-alert>
			</div>
			<v-simple-table fixed-header height="300px">
				<template v-slot:default>
					<thead>
						<tr>
							<th class="">
								Nombre
							</th>
							<th class="">
								Apellidos
							</th>
							<th class="">
								Email
							</th>
							<th class="">
								Cumpleaños
							</th>
							<th align="" class="">
								Ver
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="employee in employees" :key="employee.id">
							<td align="left">
								<v-avatar size="24">
									<img :src="employee.photo" alt="John">
								</v-avatar>
								{{ employee.name }}
							</td>
							<td align="left">{{ employee.last_name }}</td>
							<td align="left">{{ employee.user.email }}</td>
							<td align="left">{{ employee.birthday }}</td>
							<td align="">
								<v-icon small color="success" @click="formEditar(employee.id)">
									mdi-pencil
								</v-icon>
								<v-icon small color="red lighten-2" @click="deleteUser(employee.id)">
									mdi-delete
								</v-icon>
							</td>
						</tr>
					</tbody>
				</template>
			</v-simple-table>
			<v-row cols="12" align="center" class="mb-4 ml-4">
				<v-btn @click="formNuevo()" class="mx-auto mb-4" color="success" dark>
					<v-icon left>
						mdi-account-plus
					</v-icon>
					Nuevo empleado
				</v-btn>
			</v-row>

			<!-- Componente de Diálogo para CREAR y EDITAR -->
			<v-dialog v-model="dialog" max-width="500">
				<v-card>
					<v-toolbar dark color="primary">
						<v-toolbar-title>{{operacion=='crear' ? 'Agregar Empleado' : 'Editar empleado'}}
						</v-toolbar-title>
					</v-toolbar>
					<v-card-text>
						<v-form v-on:submit.prevent="saveEmployee()">
							<v-container>
								<v-row>
									<v-col cols="12" hidden>
										<v-text-field v-model="employee.id" label="ID"></v-text-field>
									</v-col>
									<v-col cols="12">
										<v-text-field @input="$v.name.$touch()" @blur="$v.name.$touch()"
											:error-messages="nameErrors" v-model="employee.name" label="Nombre">
										</v-text-field>
									</v-col>
									<v-col cols="12">
										<v-text-field @input="$v.last_name.$touch()" @blur="$v.last_name.$touch()"
											:error-messages="last_nameErrors" v-model="employee.last_name"
											label="Apellidos">
										</v-text-field>
									</v-col>
									<v-col cols="12">
										<v-text-field @input="$v.dni.$touch()" @blur="$v.dni.$touch()"
											:error-messages="dniErrors" v-model="employee.dni" label="Dni">
										</v-text-field>
									</v-col>
									<v-col cols="12">
										<v-menu v-model="menu2" :close-on-content-click="false" :nudge-right="40"
											transition="scale-transition" offset-y min-width="auto">
											<template v-slot:activator="{ on, attrs }">
												<v-text-field v-model="employee.birthday" label="Cumpleaños"
													prepend-icon="mdi-calendar" readonly v-bind="attrs" v-on="on">
												</v-text-field>
											</template>
											<v-date-picker v-model="employee.birthday" @input="menu2 = false">
											</v-date-picker>
										</v-menu>
									</v-col>
									<v-col cols="12">
										<v-file-input v-model="employee.photo" :rules="rules"
											accept="image/png, image/jpeg, image/bmp" placeholder="Foto"
											prepend-icon="mdi-camera" label="Avatar">
										</v-file-input>
									</v-col>
									<v-col>
										<v-card-title>
											<span class="text-h5">Empleos</span>
										</v-card-title>
										<v-row v-for="job in jobs" :key="job.id">
											<v-checkbox v-model="employee.jobs" :label="job.name" :value="job.id">
											</v-checkbox>
										</v-row>
									</v-col>
								</v-row>
							</v-container>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn @click="dialog=false">Cancelar</v-btn>
								<v-btn type="submit" color="indigo" dark>Guardar</v-btn>
							</v-card-actions>
						</v-form>
					</v-card-text>
				</v-card>
			</v-dialog>
		</v-card>
	</v-container>
</template>

<script>
	import {
		Global
	} from '../Global';
	import axios from 'axios';
	import {
		required,
	} from 'vuelidate/lib/validators'
	export default {
		validations: {
			name: {
				required
			},
			last_name: {
				required
			},
			dni: {
				required
			},
			birthday:{
				required
			}
		},
		computed: {
			nameErrors() {
				const errors = []
				if (!this.$v.name.$dirty) return errors 
				!this.$v.name.required && errors.push('Introduzca el nombre')
				return errors
			},
			last_nameErrors() {
				const errors = []
				if (!this.$v.last_name.$dirty) return errors
				!this.$v.last_name.required && errors.push(
					'Introduzca los apellidos')
				return errors
			},
			dniErrors() {
				const errors = []
				if (!this.$v.dni.$dirty) return errors
				!this.$v.dni.required && errors.push('Introduzca el dni')
				return errors
			},
			birthdayErrors() {
				const errors = []
				if (!this.$v.birthday.$dirty) return errors
				!this.$v.birthday.required && errors.push('Introduzca el cumpleaños')
				return errors
			},
		},
		data() {
			return {
				employees: [],
				token: '',
				menu2: false,
				employee: {
					id: null,
					name: '',
					last_name: '',
					dni: '',
					birthday: '',
					photo: null,
					jobs: [],
				},
				jobs: [],
				rules: [
					value => !value || value.size < 2000000 || 'No mayor de 2 MB!',
				],
				search: '',
				loading: true,
				dialog: false,
				operacion: '',
				errored: false
			}
		},
		mounted() {
			if (localStorage.getItem('crud_token')) {
				this.token = localStorage.getItem('crud_token');
				this.getEmployees();
				this.getJobs();
			} else {
				this.$router.push('/login');
			}

		},
		methods: {
			clear() {
				this.employee.id = null,
					this.employee.name = '',
					this.employee.last_name = '',
					this.employee.dni = '',
					this.employee.birthday = '',
					this.employee.photo = null,
					this.employee.jobs = []
			},
			logout() {
				localStorage.removeItem('crud_token');
				this.$router.push('/login');
			},
			formNuevo: function() {
				this.dialog = true;
				this.operacion = 'crear';
				this.clear();
			},
			formEditar: function(id) {
				//capturamos los datos del registro seleccionado y los mostramos en el formulario
				let employee = this.findEmployee(id);
				this.employee.id = id;
				this.employee.name = employee.name;
				this.employee.last_name = employee.last_name;
				this.employee.dni = employee.dni;
				this.employee.birthday = employee.birthday;
				this.employee.jobs = this.selectIdJobs(employee.job);
				this.dialog = true;
				this.operacion = 'editar';
			},
			findEmployee(id) {
				return this.employees.find(x => x.id === id);
			},
			selectIdJobs(jobs) {
				let idJobs = [];
				for (var i = 0; i < jobs.length; i++) {
					idJobs.push(jobs[i].id);
				}
				return idJobs;
			},
			deleteUser(id) {
				this.$swal({

					title: 'Atención!',

					text: "¿Desea eliminar este usuario?",

					type: 'warning',

					showCancelButton: true,

					confirmButtonColor: '#3085d6',

					cancelButtonColor: '#d33',

					confirmButtonText: 'Sí, borrarlo!',

					cancelButtonText: 'Cancelar'

				}).then((result) => {

					if (result.value) {
						axios.delete(Global.url + 'workers/' + id, {
								headers: {
									"Authorization": `Bearer ${this.token}`
								},
							}).then((response) => {
								if (response.status == 200) {
									this.$swal.fire({
										icon: 'success',
										title: 'Correcto',
										text: 'Operación realizada!',
									})
									this.getEmployees();
								}
							})
							.catch(error => {
								console.log(error)
								this.$swal.fire({
									icon: 'error',
									title: 'Error',
									text: 'Operación fallida!',
								})
							})
					}
				});
			},
			getEmployees() {
				axios.get(Global.url + 'workers', {
						headers: {
							"Authorization": `Bearer ${this.token}`
						}
					}).then(
						response => (this.employees = response.data.data)
					).catch(error => {
						console.log(error)
						this.errored = true
					})
					.finally(() => this.loading = false)
			},
			getJobs() {
				axios.get(Global.url + 'jobs').then(
					response => (this.jobs = response.data)
				).catch(error => {
					console.log(error)
				})
			},
			saveEmployee() {
				this.$v.$touch()
				if (!this.$v.$invalid) {
					let orderFormData = new FormData();
					orderFormData.append('name', this.employee.name);
					orderFormData.append('last_name', this.employee.last_name);
					orderFormData.append('birthday', this.employee.birthday);
					orderFormData.append('dni', this.employee.dni);
					if (this.employee.photo) {
						orderFormData.append('photo', this.employee.photo);
					}
					if (this.operacion == 'editar') {
						orderFormData.append("_method", "PUT")
					}
					//Just stringify jobs array
					orderFormData.append('jobs', JSON.stringify(this.employee.jobs));
					if (this.operacion == 'crear') {
						axios.post(Global.url + 'workers', orderFormData, {
								headers: {
									'Content-Type': 'multipart/form-data',
									"Authorization": `Bearer ${this.token}`
								},
							})
							.then((response) => {
								if (response.status == 200) {
									this.getEmployees();
									this.$swal.fire({
										icon: 'success',
										title: 'Correcto',
										text: 'Operación realizada!',
									})
								}
							})
							.catch(error => {
								console.log(error)
								this.$swal.fire({
									icon: 'error',
									title: 'Oops...',
									text: 'Algo anda mal!',
								})
							})
					} else {
						axios.post(Global.url + 'workers/' + this.employee.id, orderFormData, {
								headers: {
									'Content-Type': 'multipart/form-data',
									"Authorization": `Bearer ${this.token}`
								},
							})
							.then((response) => {
								if (response.status == 200) {
									this.getEmployees();
									this.$swal.fire({
										icon: 'success',
										title: 'Correcto',
										text: 'Operación realizada!',
									})
								} else {
									this.$swal.fire({
										icon: 'error',
										title: 'Oops...',
										text: 'Algo anda mal!',
									})
								}
							})
					}
					this.dialog = false;
					this.clear();
				}
			}
		},
	}
</script>

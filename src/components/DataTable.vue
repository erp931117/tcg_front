<template>
	<v-container>
		<v-data-table v-if="loading" item-key="name" class="elevation-1" loading
			loading-text="Cargando... Por favor espere"></v-data-table>
		<v-data-table v-else :headers="headers" :items="employees" :footer-props="{'items-per-page-text':'Empleados por página'
      }" class="elevation-1">
			<template v-slot:top>
				<v-toolbar flat>
					<v-toolbar-title>Empleados</v-toolbar-title>
					<v-divider class=" mx-4" inset vertical>
					</v-divider>
					<v-spacer></v-spacer>
					<v-dialog v-model="dialog" max-width="500px">
						<template v-slot:activator="{ on, attrs }">
							<v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
								<v-icon>
									mdi-account-plus
								</v-icon>
								Agregar nuevo
							</v-btn>
						</template>
						<v-card>
							<v-card-title>
								<span class="text-h5">{{ formTitle }}</span>
							</v-card-title>

							<v-card-text>
								<v-container>
									<v-row>
										<v-col cols="12" sm="6" md="4">
											<v-text-field v-model="editedItem.name" label="Nombre"></v-text-field>
										</v-col>
										<v-col cols="12" sm="6" md="4">
											<v-text-field v-model="editedItem.last_name" label="Apellidos"></v-text-field>
										</v-col>
										<v-col cols="12" sm="6" md="4">
											<v-text-field v-model="editedItem.email" label="Correo"></v-text-field>
										</v-col>
										<v-col cols="12" sm="6" md="4">
											<v-text-field v-model="editedItem.dni" label="Dni"></v-text-field>
										</v-col>
									</v-row>
								</v-container>
							</v-card-text>

							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="blue darken-1" text @click="close">
									Cancelar
								</v-btn>
								<v-btn color="blue darken-1" text @click="save">
									Guardar
								</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
					<v-dialog v-model="dialogDelete" max-width="500px">
						<v-card>
							<v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
								<v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
								<v-spacer></v-spacer>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</v-toolbar>
			</template>
			<template v-slot:[`footer.page-text`]="items"> {{ items.pageStart }} - {{ items.pageStop }} de
				{{ items.itemsLength }} </template>
			<template v-slot:[`item.actions`]="{ item }">
				<v-icon small class="mr-2" @click="editItem(item)">
					mdi-pencil
				</v-icon>
				<v-icon small @click="deleteItem(item)">
					mdi-delete
				</v-icon>
			</template>
			<template v-slot:no-data>
				<v-btn color="primary" @click="initialize">
					Reset
				</v-btn>
			</template>
		</v-data-table>

	</v-container>
</template>

<script>
	import {
		Global
	} from '../Global';
	import axios from 'axios';
	export default {
		data: () => ({
			dialog: false,
			dialogDelete: false,
			loading: true,
			employees: [],
			headers: [{
					text: 'Nombre',
					align: 'start',
					value: 'name',
				},
				{
					text: 'Apellidos',
					value: 'last_name'
				},
				{
					text: 'Correo',
					value: 'user.email'
				},
				{
					text: 'Dni',
					value: 'dni'
				},
				{
					text: 'Actions',
					value: 'actions',
					sortable: false
				},
			],
			editedIndex: -1,
			editedItem: {
				name: '',
				last_name: '',
				email: '',
				dni: '',
			},
			defaultItem: {
				name: '',
				last_name: '',
				email: '',
				dni: '',
			},
		}),

		computed: {
			formTitle() {
				return this.editedIndex === -1 ? 'Agregar empleado' : 'Editar empleado'
			},
		},

		watch: {
			dialog(val) {
				val || this.close()
			},
			dialogDelete(val) {
				val || this.closeDelete()
			},
		},

		created() {
			this.initialize()
		},
		mounted() {
			axios.get(Global.url + 'workers').then(
					response => (this.employees = response.data.data)
				).catch(error => {
					console.log(error)
					this.errored = true
				})
				.finally(() => this.loading = false)
		},
		methods: {
			initialize() {
				this.desserts = [{
						name: 'Frozen Yogurt',
						calories: 159,
						fat: 6.0,
						carbs: 24,
						protein: 4.0,
					},
					{
						name: 'Ice cream sandwich',
						calories: 237,
						fat: 9.0,
						carbs: 37,
						protein: 4.3,
					},
					{
						name: 'Eclair',
						calories: 262,
						fat: 16.0,
						carbs: 23,
						protein: 6.0,
					},
					{
						name: 'Cupcake',
						calories: 305,
						fat: 3.7,
						carbs: 67,
						protein: 4.3,
					},
					{
						name: 'Gingerbread',
						calories: 356,
						fat: 16.0,
						carbs: 49,
						protein: 3.9,
					},
					{
						name: 'Jelly bean',
						calories: 375,
						fat: 0.0,
						carbs: 94,
						protein: 0.0,
					},
					{
						name: 'Lollipop',
						calories: 392,
						fat: 0.2,
						carbs: 98,
						protein: 0,
					},
					{
						name: 'Honeycomb',
						calories: 408,
						fat: 3.2,
						carbs: 87,
						protein: 6.5,
					},
					{
						name: 'Donut',
						calories: 452,
						fat: 25.0,
						carbs: 51,
						protein: 4.9,
					},
					{
						name: 'KitKat',
						calories: 518,
						fat: 26.0,
						carbs: 65,
						protein: 7,
					},
				]
			},

			editItem(item) {
				this.editedIndex = this.employees.indexOf(item)
				this.editedItem = Object.assign({}, item)
				this.dialog = true
			},

			deleteItem(item) {
				this.editedIndex = this.desserts.indexOf(item)
				this.editedItem = Object.assign({}, item)
				this.dialogDelete = true
			},

			deleteItemConfirm() {
				this.desserts.splice(this.editedIndex, 1)
				this.closeDelete()
			},

			close() {
				this.dialog = false
				this.$nextTick(() => {
					this.editedItem = Object.assign({}, this.defaultItem)
					this.editedIndex = -1
				})
			},

			closeDelete() {
				this.dialogDelete = false
				this.$nextTick(() => {
					this.editedItem = Object.assign({}, this.defaultItem)
					this.editedIndex = -1
				})
			},

			save() {
				if (this.editedIndex > -1) {
					Object.assign(this.desserts[this.editedIndex], this.editedItem)
				} else {
					this.desserts.push(this.editedItem)
				}
				this.close()
			},
		},
	}
</script>

<style>
</style>

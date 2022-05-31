<template>
	<v-app>
		<vue-headful title="Acceder" />
		<v-main>
			<v-container fluid fill-height>
				<v-layout align-center justify-center>
					<v-flex xs12 sm8 md4>
						<v-card class="elevation-12">
							<v-toolbar dark color="primary">
								<v-toolbar-title>Acceso al sistema</v-toolbar-title>
							</v-toolbar>
							<v-card-text class="mx-auto">
								<form v-on:submit.prevent="login()">
									<v-text-field prepend-icon="mdi-at" v-model="email" :error-messages="emailErrors" label="E-mail" required
										@input="$v.email.$touch()" @blur="$v.email.$touch()"></v-text-field>
									<v-text-field prepend-icon="mdi-key"  v-model="password" :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
										:type="show1 ? 'text' : 'password'" @click:append="show1 = !show1"
										:error-messages="passwordErrors" label="Contraseña" required
										@input="$v.password.$touch()" @blur="$v.password.$touch()"></v-text-field>
										<v-row align="center" cols="12">
											<v-btn class="mx-auto my-2" type="submit" color="primary">
										Acceder
									</v-btn>
										</v-row>
								</form>
							</v-card-text>
						</v-card>
					</v-flex>
				</v-layout>
			</v-container>
		</v-main>
	</v-app>
</template>

<script>
	import {
		Global
	} from '../Global';
	import axios from 'axios';
	import {
		validationMixin
	} from 'vuelidate'
	import {
		required,
		email
	} from 'vuelidate/lib/validators'
	export default {
		name: "LoginComponent",
		mixins: [validationMixin],

		validations: {
			email: {
				required,
				email,
			},
			password: {
				required,
			},
		},
		data() {
			return {
				email: "",
				password: "",
				show1: false,
			};
		},
		methods: {
			async login() {
				this.$v.$touch()
				const auth = {
					email: this.email,
					password: this.password
				};
				axios.post(Global.url + 'auth/login', auth, {
						headers: {
							'Content-Type': 'application/json'
						},
					})
					.then((response) => {
						if (response.status == 200) {
							localStorage.setItem('crud_token',response.data.access_token);
							this.$router.push('/');
						}
					})
					.catch(error => {
						console.log(error)
						this.$swal.fire({
							icon: 'error',
							title: 'Oops...',
							text: 'Credenciales inválidas!',
						})
					})
			},
		},
		computed: {
			emailErrors() {
				const errors = []
				if (!this.$v.email.$dirty) return errors
				!this.$v.email.email && errors.push('Correo inválido') 
				!this.$v.email.required && errors.push('Introduzca un correo')
				return errors
			},
			passwordErrors() {
				const errors = []
				if (!this.$v.password.$dirty) return errors
				!this.$v.password.required && errors.push('Introduzca la contraseña')
				return errors
			},
		},
	};
</script>

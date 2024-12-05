<template>
  <v-container class="d-flex justify-center align-center fill-height pa-4">
    <v-card class="elevation-12 pa-6" max-width="600" min-width="400">
      <v-card-title class="justify-center text-h4">Register</v-card-title>
      <v-card-text>
        <v-alert v-if="errorMessage" type="error" class="mb-4">
          {{ errorMessage }}
        </v-alert>
        <v-form>
          <v-text-field
            label="Name"
            v-model="name"
            required
            outlined
            class="mb-4"
          ></v-text-field>
          <v-text-field
            label="Email"
            v-model="email"
            type="email"
            required
            outlined
            class="mb-4"
          ></v-text-field>
          <v-text-field
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            required
            outlined
            class="mb-4"
            :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="togglePasswordVisibility"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <v-card-actions class="d-flex flex-column">
        <v-btn color="primary" block large class="mb-3" @click="handleRegister">
          Register
        </v-btn>
        <v-btn color="secondary" block outlined large @click="navigateToLogin">
          Already have an account? Login
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { register } from '../services/auth';

export default defineComponent({
  data() {
    return {
      name: '',
      email: '',
      password: '',
      errorMessage: '', 
      showPassword: false,
    };
  },
  methods: {
    async handleRegister() {
      if (!this.name || !this.email || !this.password) {
        this.errorMessage = 'All fields are required.';
        return;
      }
      if (this.password.length < 7) {
        this.errorMessage = 'Password must be at least 7 characters.';
        return;
      }
      try {
        const response = await register(this.name, this.email, this.password);

        localStorage.setItem('token', response.data.token);
        this.$router.push('/');
      } catch (error) {
        this.errorMessage =
          (error as any).response?.data?.error || 'Registration failed. Try again.';
      }
    },
    navigateToLogin() {
      this.$router.push('/login');
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  },
});
</script>

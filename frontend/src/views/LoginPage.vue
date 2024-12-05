<template>
  <v-container class="d-flex justify-center align-center fill-height pa-4">
    <v-card class="elevation-12 pa-6" max-width="600" min-width="400">
      <v-card-title class="justify-center text-h4">
        Login
      </v-card-title>
      <v-card-text>
        <v-alert
          v-if="errorMessage"
          type="error"
          class="mb-4"
        >
          {{ errorMessage }}
        </v-alert>
        <v-form>
          <v-text-field
            v-model="email"
            label="Email"
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
        <v-btn color="primary" block large class="mb-3" @click="handleLogin">
          Login
        </v-btn>
        <v-btn color="secondary" block outlined large @click="navigateToSignUp">
          Sign Up
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '', // Para exibir mensagens de erro
      showPassword: false, // Controla a visibilidade da senha
    };
  },
  methods: {
    async handleLogin() {
      if (!this.email || !this.password) {
        this.errorMessage = 'Please fill in both email and password.';
        return;
      }
      try {
        const response = await axios.post('http://localhost:2005/users/login', {
          email: this.email,
          password: this.password,
        });
        localStorage.setItem('token', response.data.token);
        this.$router.push('/');
      } catch (error: any) {
        this.errorMessage = error.response?.data?.error || 'Login failed';
      }
    },
    navigateToSignUp() {
      this.$router.push('/register');
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  },
});
</script>

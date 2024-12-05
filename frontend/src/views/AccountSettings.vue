<template>
  <v-container class="d-flex justify-center align-center fill-height pa-4">
    <v-card class="elevation-12 pa-6" max-width="700" min-width="500">
      <v-card-title class="justify-center text-h4">Account Settings</v-card-title>

      <v-tabs v-model="activeTab" background-color="primary" class="mt-4">
        <v-tab>
          Change Password
        </v-tab>
        <v-tab>
          Delete Account
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="activeTab" class="mt-4">
        <v-tab-item>
          <v-card-text v-if="activeTab === 0">
            <v-alert v-if="errorMessage" type="error" class="mb-4">
              {{ errorMessage }}
            </v-alert>
            <v-alert v-if="successMessage" type="success" class="mb-4">
              {{ successMessage }}
            </v-alert>

            <v-form>
              <v-text-field
                v-model="currentPassword"
                label="Current Password"
                type="password"
                outlined
                class="mb-4"
              ></v-text-field>
              <v-text-field
                v-model="newPassword"
                label="New Password"
                type="password"
                outlined
                class="mb-4"
              ></v-text-field>
              <v-btn
                v-if="activeTab === 0"
                color="primary"
                block
                large
                class="mt-4"
                @click="changePassword"
              >
                Save Changes
              </v-btn>
            </v-form>
          </v-card-text>
        </v-tab-item>

        <v-tab-item>
          <v-card-text v-if="activeTab === 1">
            <v-alert type="warning" class="mb-4">
              Deleting your account is permanent and cannot be undone.
            </v-alert>
            <v-btn
              v-if="activeTab === 1"
              color="error"
              block
              large
              @click="confirmDeleteAccount"
            >
              Delete Account
            </v-btn>
          </v-card-text>
        </v-tab-item>
      </v-tabs-items>

      <v-dialog v-model="deleteDialog" max-width="400">
        <v-card>
          <v-card-title class="text-h6">
            Confirm Account Deletion
          </v-card-title>
          <v-card-text>
            Are you sure you want to delete your account? This action cannot be undone.
          </v-card-text>
          <v-card-actions>
            <v-btn color="error" @click="deleteAccount">Yes, Delete</v-btn>
            <v-btn @click="deleteDialog = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  data() {
    return {
      activeTab: 0,
      currentPassword: '',
      newPassword: '',
      errorMessage: '',
      successMessage: '',
      deleteDialog: false,
    };
  },
  methods: {
    async changePassword() {
      if (!this.currentPassword || !this.newPassword) {
        this.errorMessage = 'Both fields are required.';
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.put(
          'http://localhost:2005/users/edit',
          {
            currentPassword: this.currentPassword,
            newPassword: this.newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.successMessage = response.data.message || 'Password updated successfully.';
        this.errorMessage = '';
      } catch (error: any) {
        this.errorMessage = error.response?.data?.error || 'Password update failed.';
        this.successMessage = '';
      }
    },

    confirmDeleteAccount() {
      this.deleteDialog = true;
    },

    async deleteAccount() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        await axios.delete('http://localhost:2005/users/delete', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        localStorage.removeItem('token');
        this.$router.push('/register');
      } catch (error: any) {
        this.errorMessage = error.response?.data?.error || 'Account deletion failed.';
        this.successMessage = '';
      } finally {
        this.deleteDialog = false;
      }
    },
  },
});
</script>

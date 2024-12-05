<template>
  <v-container>
    <v-app-bar app color="primary" dark>
      <v-toolbar-title>Product Dashboard</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="navigateToAccountSettings">
        <v-icon>mdi-account-cog</v-icon>
      </v-btn>
    </v-app-bar>

    <v-btn color="primary" @click="openAddDialog" class="mb-4 mt-10">Add Product</v-btn>

    <v-row>
      <v-col
        v-for="product in products"
        :key="product.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card class="mx-auto" max-width="400">
          <v-img
            :src="getImageUrl(product.imageUrl)"
            alt="Product Image"
            aspect-ratio="16/9"
            class="rounded"
          ></v-img>

          <v-card-title>{{ product.name }}</v-card-title>

          <v-card-actions>
            <v-btn color="primary" @click="editProduct(product)">Edit</v-btn>
            <v-btn color="error" @click="deleteProduct(product.id)">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog de Adicionar/Editar Produto -->
    <v-dialog v-model="addDialog" persistent>
      <v-card>
        <v-card-title>
          {{ isEditing ? "Edit Product" : "Add Product" }}
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
              v-model="newProduct.name"
              label="Product Name"
              class="mb-4"
              outlined
              required
            ></v-text-field>

            <v-file-input
              v-model="newProduct.image"
              :rules="[file => !!file || 'File is required']"
              label="Upload Image"
              accept="image/*"
              class="mb-4"
            ></v-file-input>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="saveProduct">
            {{ isEditing ? "Save Changes" : "Save" }}
          </v-btn>
          <v-btn color="secondary" @click="closeAddDialog">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import axios from 'axios';

export default defineComponent({
  data() {
    return {
      products: [] as any[],
      addDialog: false,
      newProduct: {
        id: null as number | null,
        name: '',
        image: null as File | null,
      },
      isEditing: false,
      errorMessage: '',
    };
  },
  methods: {
    navigateToAccountSettings() {
      this.$router.push('/account');
    },
    getImageUrl(imageUrl: string) {
      return `http://localhost:2005/${imageUrl}`;
    },

    async fetchProducts() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('http://localhost:2005/products', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.products = response.data;
      } catch (error) {
        console.error(error);
      }
    },

    async saveProduct() {
      if (!this.newProduct.name) {
        this.errorMessage = 'Product name is required.';
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const formData = new FormData();
        formData.append('name', this.newProduct.name);
        if (this.newProduct.image && this.newProduct.image instanceof File) {
          formData.append('image', this.newProduct.image);
        }

        if (this.isEditing && this.newProduct.id) {
          console.info(this.newProduct.name);
          await axios.put(
            `http://localhost:2005/products/${this.newProduct.id}`,formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'multipart/form-data',
              },
            }
          );
        } else {
          await axios.post('http://localhost:2005/products', formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data',
            },
          });
        }

        this.closeAddDialog();
        this.fetchProducts();
      } catch (error) {
        console.error(error);
      }
    },

    async deleteProduct(id: number) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        await axios.delete(`http://localhost:2005/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        this.fetchProducts();
      } catch (error) {
        console.error(error);
      }
    },

    editProduct(product: any) {
      this.isEditing = true;
      this.newProduct = { ...product, image: null };
      this.addDialog = true;
    },

    openAddDialog() {
      this.isEditing = false;
      this.addDialog = true;
      this.newProduct = { id: null, name: '', image: null };
    },

    closeAddDialog() {
      this.addDialog = false;
      this.newProduct = { id: null, name: '', image: null };
      this.errorMessage = '';
    },
  },
  mounted() {
    this.fetchProducts();
  },
});
</script>

# **Product Dashboard**

A complete product management system built with Vue.js for the frontend, Node.js for the backend, and MySQL as the database. The project is fully containerized using Docker and Docker Compose, ensuring seamless setup and execution.

---

## **Technologies Used**

- **Frontend**: Vue.js with Vuetify for a modern and responsive UI.
- **Backend**: Node.js with Express and TypeORM for RESTful APIs.
- **Database**: MySQL for storing product and user data.
- **Database Management**: phpMyAdmin for database visualization and manipulation.
- **Containerization**: Docker and Docker Compose for managing services.

---

## **Features**

### **Frontend**
- Display products in a responsive grid with images.
- Add, edit, and delete products.
- Manage user account (update email, password, and delete account).

### **Backend**
- APIs for product and user account management.
- JWT-based authentication.
- Support for uploading and updating product images.

### **Database**
- Automated database setup with pre-configured schemas.

---

## **Prerequisites**

Before starting, ensure you have the following installed:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

## **Setup and Run**

### 1. **Clone the Repository**
```bash
git clone https://github.com/Pedrohbbier/project-products.git
cd project-products
```

### 2. **Configure Environment Variables**

#### **Backend**

Navigate to the backend directory:
```bash
cd nodejs-api
```

Create a `.env` file:
```bash
cp .env.example .env
```

#### **Frontend**

Navigate to the frontend directory:
```bash
cd ../frontend
```

Create a `.env` file:
```bash
cp .env.example .env
```

### 3. **Build and Run with Docker**

Navigate back to the root directory:
```bash
cd ..
```

Build and run the Docker containers:
```bash
docker compose up --build
```

### **Accessing the Application**

#### **Frontend**
Open your browser and go to:
```
http://localhost:3000
```

#### **Backend**
Backend APIs are hosted at:
```
http://localhost:2005
```

---

## **Project Structure**

```bash
project/
├── docker-compose.yml         # Docker Compose configuration
├── nodejs-api/                # Backend folder
│   ├── Dockerfile             # Backend Dockerfile
│   ├── src/                   # Source code
│   ├── uploads/               # Uploaded images
│   └── .env                   # Environment variables
├── frontend/                  # Frontend folder
│   ├── Dockerfile             # Frontend Dockerfile
│   ├── src/                   # Vue.js source code
│   └── .env                   # Environment variables
└── README.md                  # Documentation
```

---

## **How It Works**

- **Frontend**: Interacts with the backend via RESTful APIs, provides a user-friendly interface for product and account management.
- **Backend**: Handles authentication, CRUD operations for products, and user account management.
- **Database**: Stores product and user data with schema migrations handled automatically by the backend.

---

## **Contributing**

1. Fork the repository.
2. Create a new branch for your feature or bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your message here"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

---
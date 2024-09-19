# Mach9: National Bridge Inventory

## Overview

This project is organized into three main components:
- **API**: The backend server using Apollo GraphQL.
- **Client**: The frontend application built with React.
- **Scripts**: Utility scripts for data conversion and extraction to the API folder.

## Folder Structure

- **api**: Contains the backend server and GraphQL API implementation.
- **client**: Contains the frontend application and related code.
- **scripts**: Contains scripts for data processing.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v20 or higher)
- [npm](https://www.npmjs.com/) (v10 or higher)

### Setup

#### 1. API Server

i. Navigate to the `api` folder:
   ```bash
   cd api
   ```

ii. Install dependencies:
   ```bash
   npm install
   ```

iii. Start the API server:
   ```bash
   npm run start
   ```

   The API server will run on [http://localhost:4000](http://localhost:4000) by default.

#### 2. Client Application

i. Navigate to the `client` folder:
   ```bash
   cd client
   ```

i. Install dependencies:
   ```bash
   npm install
   ```

iii. Start the development server:
   ```bash
   npm run dev
   ```

   The client application will run on [http://localhost:5173/](http://localhost:5173/) by default.

#### 3. Scripts

i. Navigate to the `scripts` folder:
   ```bash
   cd scripts
   ```

ii. Run the desired script to convert or extract data:
   ```bash
   npm run <script-name>
   ```

   Replace `<script-name>` with the specific script command such as `readCSV.js`.

## Configuration

- Ensure that the API server and client are properly configured to communicate with each other.
- Update environment variables and configuration files as needed.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For any questions or issues, please reach out to [Allen Sun](mailto:alsiam.dev@gmail.com).

```

Feel free to adjust any details, like the email address or specific commands, to better fit your actual setup.
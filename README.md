# Car Sales Web 🚗

A full-stack car sales website built with Vue.js frontend and Node.js/Express backend with MySQL database.

## Features

### 🔍 Car Listings & Search
- Browse extensive collection of car listings
- Advanced search and filtering (make, model, price, year, transmission, fuel type, etc.)
- Detailed car specifications with image gallery
- Responsive card-based layout

### 👤 User Authentication
- Secure user registration and login for sellers
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control (Seller/Admin)

### 💼 Seller Dashboard
- Add, edit, and delete car listings
- Upload multiple images per listing
- View and manage inquiries
- Track listing status (pending/approved/rejected)

### 🛡️ Admin Panel
- Dashboard with statistics
- Approve/reject car listings
- Manage users (enable/disable accounts)
- View all inquiries
- Comprehensive car and user management

### 📧 Inquiry System
- Contact form for each listing
- Buyers can send inquiries to sellers
- Sellers receive and manage inquiries
- Admin oversight of all inquiries

## Tech Stack

### Frontend
- **Vue.js 3** - Progressive JavaScript framework
- **Vue Router** - Client-side routing
- **Pinia** - State management
- **Axios** - HTTP client
- **Responsive Design** - Mobile-friendly interface

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MySQL** - Relational database
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Multer** - File upload handling

## Project Structure

```
CarSalesWeb/
├── backend/
│   ├── config/
│   │   ├── database.js       # Database connection
│   │   └── upload.js          # File upload configuration
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── carController.js
│   │   └── inquiryController.js
│   ├── middleware/
│   │   └── auth.js            # Authentication middleware
│   ├── models/
│   │   ├── Car.js
│   │   ├── Inquiry.js
│   │   └── User.js
│   ├── routes/
│   │   ├── admin.js
│   │   ├── auth.js
│   │   ├── cars.js
│   │   └── inquiries.js
│   ├── uploads/               # Uploaded images
│   ├── database.sql           # Database schema
│   ├── server.js              # Main server file
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── CarCard.vue
│   │   │   ├── CarForm.vue
│   │   │   ├── Footer.vue
│   │   │   ├── InquiryForm.vue
│   │   │   ├── Navigation.vue
│   │   │   └── SearchFilter.vue
│   │   ├── views/
│   │   │   ├── AdminDashboard.vue
│   │   │   ├── CarDetails.vue
│   │   │   ├── Home.vue
│   │   │   ├── Login.vue
│   │   │   ├── Register.vue
│   │   │   └── SellerDashboard.vue
│   │   ├── router/
│   │   │   └── index.js
│   │   ├── store/
│   │   │   ├── auth.js
│   │   │   └── car.js
│   │   ├── services/
│   │   │   ├── adminService.js
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── carService.js
│   │   │   └── inquiryService.js
│   │   ├── App.vue
│   │   └── main.js
│   ├── vue.config.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** (v14 or higher)
- **MySQL** (v5.7 or higher)
- **npm** or **yarn**

### Database Setup

1. **Create the database:**

```bash
mysql -u root -p
```

2. **Run the database schema:**

```sql
source backend/database.sql
```

Or manually execute the SQL file:

```bash
mysql -u root -p < backend/database.sql
```

3. **Create default admin account:**

The database script includes a default admin account:
- **Email:** admin@carsales.com
- **Password:** admin123
- **Note:** You need to update the hashed password in the SQL file or create it via API

To create a proper admin account, you can use bcrypt to hash your password:

```javascript
const bcrypt = require('bcryptjs');
const password = 'your_password';
const hashedPassword = bcrypt.hashSync(password, 10);
console.log(hashedPassword);
```

Then update the INSERT statement in `backend/database.sql` with the hashed password.

### Backend Setup

1. **Navigate to backend directory:**

```bash
cd backend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure environment variables:**

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

Edit `.env` file:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=carsales_db

JWT_SECRET=your_secret_key_change_this
JWT_EXPIRE=7d

MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

4. **Start the backend server:**

```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```

The backend server will run on http://localhost:5000

### Frontend Setup

1. **Navigate to frontend directory:**

```bash
cd frontend
```

2. **Install dependencies:**

```bash
npm install
```

3. **Configure environment variables:**

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` file:

```env
VUE_APP_API_URL=http://localhost:5000/api
```

4. **Start the development server:**

```bash
npm run serve
```

The frontend will run on http://localhost:8080

5. **Build for production:**

```bash
npm run build
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Cars
- `GET /api/cars` - Get all cars (with filters)
- `GET /api/cars/:id` - Get car by ID
- `POST /api/cars` - Create new car (seller)
- `PUT /api/cars/:id` - Update car (seller)
- `DELETE /api/cars/:id` - Delete car (seller)
- `GET /api/cars/seller/my-cars` - Get seller's cars
- `GET /api/cars/makes` - Get all car makes
- `GET /api/cars/body-types` - Get all body types

### Inquiries
- `POST /api/inquiries` - Submit inquiry (public)
- `GET /api/inquiries/car/:carId` - Get inquiries for a car (owner/admin)
- `GET /api/inquiries/my-inquiries` - Get seller's inquiries
- `GET /api/inquiries/all` - Get all inquiries (admin)
- `DELETE /api/inquiries/:id` - Delete inquiry

### Admin
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/status` - Update user status
- `DELETE /api/admin/users/:id` - Delete user
- `PUT /api/admin/cars/:id/status` - Update car status
- `GET /api/admin/stats` - Get dashboard statistics

## Default Credentials

### Admin Account
- **Email:** admin@carsales.com
- **Password:** admin123 (change after first login)

### Test Seller Account
You can create a seller account by registering through the frontend.

## Features in Detail

### Search & Filter Options
- **Search:** By make, model, or description keywords
- **Price Range:** Min and max price filters
- **Year Range:** Filter by manufacture year
- **Make/Brand:** Filter by car manufacturer
- **Body Type:** Sedan, SUV, Coupe, etc.
- **Transmission:** Automatic or Manual
- **Fuel Type:** Petrol, Diesel, Electric, Hybrid
- **Mileage:** Maximum mileage filter
- **Sort Options:** By price, year, mileage, or newest

### Image Upload
- Support for multiple images per car (up to 10)
- Accepted formats: JPG, PNG, GIF, WEBP
- Maximum file size: 5MB per image
- Images stored in `/backend/uploads/` directory
- Automatic file naming with timestamps

### Security Features
- JWT token-based authentication
- Password hashing with bcrypt (10 rounds)
- Protected API routes
- Role-based access control
- Input validation using express-validator
- SQL injection prevention with parameterized queries
- CORS configuration

## Development

### Running in Development Mode

1. **Backend with auto-reload:**
```bash
cd backend
npm run dev
```

2. **Frontend with hot-reload:**
```bash
cd frontend
npm run serve
```

### Code Linting

Frontend:
```bash
cd frontend
npm run lint
```

## Production Deployment

### Backend Deployment

1. Set `NODE_ENV=production` in `.env`
2. Configure production database
3. Set secure JWT secret
4. Use a process manager like PM2:

```bash
npm install -g pm2
pm2 start server.js --name "carsales-backend"
```

### Frontend Deployment

1. Build the production bundle:
```bash
cd frontend
npm run build
```

2. Serve the `dist` folder using nginx or similar web server

### Environment Variables for Production

Ensure all sensitive information is properly configured:
- Use strong JWT secrets
- Configure proper database credentials
- Set appropriate CORS origins
- Enable HTTPS
- Configure proper file upload limits

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running
- Check database credentials in `.env`
- Ensure database exists and schema is loaded

### File Upload Issues
- Check `uploads` directory exists and has write permissions
- Verify `MAX_FILE_SIZE` in `.env`
- Check file type restrictions in `backend/config/upload.js`

### Authentication Issues
- Verify JWT_SECRET is set in `.env`
- Check token expiration settings
- Clear browser localStorage if needed

### CORS Issues
- Verify frontend URL in CORS configuration
- Check API_URL in frontend `.env`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or contributions, please open an issue on GitHub.

---

Built with ❤️ using Vue.js, Node.js, Express, and MySQL
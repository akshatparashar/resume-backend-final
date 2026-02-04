# AI Resume Analyzer - Backend API

Complete Node.js/Express backend with MongoDB for AI-Powered Resume Analyzer & Career Mentor.

## 🚀 Features

- **User Authentication** - JWT-based auth with bcrypt password hashing
- **Resume Upload & Parsing** - Parse PDF and DOCX files
- **AI-Powered Analysis** - Resume scoring, ATS compatibility, skill analysis
- **Job Matching** - Match resumes against job descriptions
- **RESTful API** - Clean, organized API endpoints
- **Security** - Helmet, CORS, rate limiting, input validation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** - Comes with Node.js

## 🛠️ Installation & Setup

### Step 1: Install MongoDB

#### On Windows:
1. Download MongoDB Community Server from https://www.mongodb.com/try/download/community
2. Run the installer and follow the installation wizard
3. MongoDB will start automatically as a service

#### On macOS:
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community@7.0
brew services start mongodb-community@7.0
```

#### On Linux (Ubuntu/Debian):
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-7.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
sudo systemctl enable mongod
```

#### Verify MongoDB Installation:
```bash
# Check if MongoDB is running
mongosh
# You should see MongoDB shell prompt
```

### Step 2: Install Backend Dependencies

```bash
# Navigate to backend directory
cd project/backend

# Install dependencies
npm install
```

### Step 3: Configure Environment Variables

```bash
# Copy example env file
cp .env.example .env

# Edit .env file with your settings
```

**`.env` Configuration:**
```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/resume-analyzer

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS
FRONTEND_URL=http://localhost:3000

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

**Important:** Change `JWT_SECRET` to a strong, random string in production!

### Step 4: Create Uploads Directory

```bash
# From backend directory
mkdir uploads
```

### Step 5: Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

You should see:
```
✅ MongoDB Connected: localhost
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   ⚡ AI Resume Analyzer API Server                       ║
║                                                           ║
║   🚀 Server running in development mode on port 5000     ║
║   📊 Database: MongoDB                                    ║
║   🔗 API: http://localhost:5000/api                      ║
║   ✅ Health: http://localhost:5000/api/health            ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

### Step 6: Test the API

```bash
# Health check
curl http://localhost:5000/api/health
```

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── resumeController.js  # Resume operations
│   └── jobMatchController.js # Job matching logic
├── middleware/
│   └── auth.js              # JWT authentication
├── models/
│   ├── User.js              # User schema
│   ├── Resume.js            # Resume schema
│   └── JobMatch.js          # Job match schema
├── routes/
│   ├── auth.js              # Auth routes
│   ├── resumes.js           # Resume routes
│   └── jobMatch.js          # Job match routes
├── utils/
│   ├── resumeParser.js      # PDF/DOCX parsing
│   ├── resumeAnalyzer.js    # Resume analysis
│   └── jobMatcher.js        # Job matching algorithm
├── uploads/                 # Uploaded resumes
├── .env                     # Environment variables
├── .env.example            # Example env file
├── package.json            # Dependencies
├── server.js               # Main server file
└── README.md              # This file
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/updatedetails` | Update user details | Yes |

### Resumes

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/resumes/upload` | Upload & analyze resume | Yes |
| GET | `/api/resumes` | Get all user resumes | Yes |
| GET | `/api/resumes/latest` | Get latest resume | Yes |
| GET | `/api/resumes/:id` | Get single resume | Yes |
| DELETE | `/api/resumes/:id` | Delete resume | Yes |

### Job Matching

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/job-match` | Match resume with JD | Yes |
| GET | `/api/job-match` | Get all job matches | Yes |
| GET | `/api/job-match/:id` | Get single job match | Yes |
| DELETE | `/api/job-match/:id` | Delete job match | Yes |

## 📝 API Usage Examples

### 1. Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "Software Engineer",
    "targetRole": "Senior Full Stack Developer",
    "experienceLevel": "mid"
  }'
```

Response:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "Software Engineer",
    "targetRole": "Senior Full Stack Developer",
    "experienceLevel": "mid"
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### 3. Upload Resume

```bash
curl -X POST http://localhost:5000/api/resumes/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "resume=@/path/to/resume.pdf" \
  -F "targetRole=fullstack-developer" \
  -F "experienceLevel=mid"
```

### 4. Match with Job Description

```bash
curl -X POST http://localhost:5000/api/job-match \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "jobDescription": "We are looking for a Full Stack Developer with React and Node.js experience...",
    "jobTitle": "Senior Full Stack Developer",
    "company": "Tech Corp"
  }'
```

## 🗄️ Database Schema

### User Collection
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: String,
  targetRole: String,
  experienceLevel: String,
  createdAt: Date
}
```

### Resume Collection
```javascript
{
  user: ObjectId (ref: User),
  fileName: String,
  fileUrl: String,
  fileSize: Number,
  parsedContent: String,
  scores: {
    resumeScore: Number,
    atsScore: Number,
    skillMatch: Number
  },
  extractedData: {
    name, email, phone,
    skills: [String],
    experience: [Object],
    education: [Object],
    certifications: [String]
  },
  analysis: {
    strengths: [String],
    weaknesses: [String],
    missingSkills: [String],
    recommendations: [String],
    keywords: [String]
  },
  targetRole: String,
  experienceLevel: String,
  createdAt: Date
}
```

### JobMatch Collection
```javascript
{
  user: ObjectId (ref: User),
  resume: ObjectId (ref: Resume),
  jobDescription: String,
  jobTitle: String,
  company: String,
  matchScores: {
    overall: Number,
    skills: Number,
    experience: Number,
    keywords: Number
  },
  matchedSkills: [String],
  missingSkills: [String],
  matchedKeywords: [Object],
  missingKeywords: [String],
  recommendations: [String],
  createdAt: Date
}
```

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - bcrypt with salt rounds
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Prevent abuse (100 requests per 10 min)
- **File Validation** - Only PDF and DOCX allowed
- **Size Limits** - Max 10MB file upload

## 🧪 Testing

```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Test with Postman
# Import the API collection and test all endpoints
```

## 🐛 Troubleshooting

### MongoDB Connection Error

```
Error: MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
```bash
# Check if MongoDB is running
mongosh

# If not, start it:
# Windows: Open Services and start MongoDB
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Change PORT in .env file
PORT=5001

# Or kill the process using port 5000
# Windows: netstat -ano | findstr :5000
# macOS/Linux: lsof -ti:5000 | xargs kill
```

### File Upload Error

**Solution:**
- Ensure `uploads/` directory exists
- Check file size (must be < 10MB)
- Only PDF and DOCX files allowed

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **multer** - File upload handling
- **pdf-parse** - PDF parsing
- **mammoth** - DOCX parsing
- **cors** - CORS middleware
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **dotenv** - Environment variables
- **morgan** - Logging

## 🚀 Deployment

### Environment Variables for Production

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=your-production-secret-minimum-32-characters
FRONTEND_URL=https://your-frontend-domain.com
```

### Deploy to Heroku

```bash
# Install Heroku CLI
# Create Heroku app
heroku create your-app-name

# Set environment variables
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set JWT_SECRET=your-secret

# Deploy
git push heroku main
```

### Deploy to AWS/DigitalOcean

1. Set up MongoDB Atlas (cloud database)
2. Configure environment variables
3. Use PM2 for process management
4. Set up nginx as reverse proxy

## 📄 License

MIT

## 👨‍💻 Support

For issues and questions:
- Check the troubleshooting section
- Review API documentation
- Check MongoDB logs

---

**Built with Node.js, Express, and MongoDB** 🚀

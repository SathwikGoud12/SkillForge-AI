import { useState } from "react";
import TopicServices from "@/appwrite/TopicServices";
import NotesServices from "@/appwrite/NotesServices";
import InterviewQuestionService from "@/appwrite/InterviewQuestionsServices";
import AssessmentService from "@/appwrite/AssessmentSevice";
import ProjectService from "@/appwrite/ProjectService";

const topicSvc = new TopicServices();
const notesSvc = new NotesServices();
const qSvc = new InterviewQuestionService();
const assSvc = new AssessmentService();
const projSvc = new ProjectService();

const DOMAINS = {
    MERN: "6946553b0021f29ad5f6",
    ANALYTICS: "69a09c3a00189e7149a5",
    JAVA: "69a09e440027cb2e32bf",
    DEVOPS: "69a09ed0001561779100",
    CYBER: "69a09f1c0008396366e4",
    UIUX: "69a0a011000d34b76100",
};

// ── Seed Data ────────────────────────────────────────────────────────────────
const SEED = [
    // ── MERN Stack ──
    {
        domain: DOMAINS.MERN, title: "MongoDB Fundamentals", desc: "NoSQL document database, CRUD, aggregation pipelines and Mongoose ODM", order: 1, diff: "Beginner",
        notes: [
            { title: "What is MongoDB?", exp: "MongoDB stores data in flexible JSON-like documents in collections (not tables). No fixed schema required — great for evolving data models.", code: `const mongoose = require('mongoose');\nawait mongoose.connect('mongodb://localhost/mydb');\n\nconst UserSchema = new mongoose.Schema({ name: String, email: { type: String, unique: true } });\nconst User = mongoose.model('User', UserSchema);\nawait User.create({ name: 'Alice', email: 'alice@test.com' });` },
            { title: "CRUD Operations", exp: "Create, Read, Update, Delete are the four core database operations. Mongoose provides clean async methods for all four.", code: `// Create\nawait User.create({ name: 'Bob' });\n// Read\nconst users = await User.find({ name: 'Bob' });\n// Update\nawait User.updateOne({ name: 'Bob' }, { $set: { name: 'Robert' } });\n// Delete\nawait User.deleteOne({ name: 'Robert' });` },
        ],
        questions: [
            { q: "What is the difference between SQL and NoSQL?", a: "SQL uses structured tables with fixed schemas. NoSQL (like MongoDB) uses flexible document storage with no fixed schema. MongoDB scales horizontally and handles unstructured data well.", diff: "Easy" },
            { q: "What is an aggregation pipeline?", a: "A multi-stage framework to transform and compute data. Stages like $match (filter), $group (aggregate), $sort, $project run sequentially on documents.", diff: "Medium" },
            { q: "What is indexing in MongoDB and why is it important?", a: "Indexes store a sorted reference to fields, enabling fast lookups without full collection scans. Without indexes, every query scans all documents. Use sparingly — indexes slow writes.", diff: "Hard" },
        ],
        assessments: [{
            title: "MongoDB Basics Quiz", diff: "Beginner", duration: 15, qs: [
                { id: "q1", question: "Which method inserts one document?", options: ["db.add()", "db.insertOne()", "db.push()", "db.create()"], correctAnswer: "B" },
                { id: "q2", question: "What format does MongoDB store data in?", options: ["XML", "CSV", "BSON/JSON", "SQL rows"], correctAnswer: "C" },
                { id: "q3", question: "Which stage filters in aggregation?", options: ["$group", "$sort", "$match", "$project"], correctAnswer: "C" },
            ]
        }],
        projects: [{ title: "Blog Database Design", desc: "Design MongoDB schemas for users, posts, comments and tags. Add proper indexes and run aggregation queries for analytics.", tech: "MongoDB,Mongoose,Node.js" }],
    },

    {
        domain: DOMAINS.MERN, title: "Express.js & REST APIs", desc: "Build scalable REST APIs with Express, middleware, routing and error handling", order: 2, diff: "Intermediate",
        notes: [
            { title: "REST API with Express", exp: "Express is minimal and flexible. Use @RestController pattern with route handlers. Always respond with consistent JSON structures.", code: `const express = require('express');\nconst app = express();\napp.use(express.json());\n\napp.get('/api/users', async (req, res) => {\n  const users = await User.find();\n  res.json({ success: true, data: users });\n});\n\napp.post('/api/users', async (req, res) => {\n  const user = await User.create(req.body);\n  res.status(201).json({ success: true, data: user });\n});\n\napp.listen(5000);` },
        ],
        questions: [
            { q: "What is middleware in Express?", a: "Functions that execute during the request-response cycle, with access to req, res, next(). Used for auth checks, logging, body parsing, error handling.", diff: "Medium" },
            { q: "What HTTP status code means 'resource created'?", a: "201 Created. Use it for successful POST requests that create a new resource. 200 is for successful GET/PUT.", diff: "Easy" },
        ],
        assessments: [{
            title: "Express.js Quiz", diff: "Intermediate", duration: 20, qs: [
                { id: "q1", question: "Which Express method handles POST?", options: ["app.get()", "app.post()", "app.send()", "app.put()"], correctAnswer: "B" },
                { id: "q2", question: "What does next() do in middleware?", options: ["End the response", "Pass to next middleware", "Log request", "Parse body"], correctAnswer: "B" },
                { id: "q3", question: "Which status code means Unauthorized?", options: ["400", "403", "401", "500"], correctAnswer: "C" },
            ]
        }],
        projects: [{ title: "REST API for E-Commerce", desc: "Build a complete REST API with products, cart, orders endpoints. Include validation middleware and centralized error handling.", tech: "Node.js,Express,MongoDB" }],
    },

    {
        domain: DOMAINS.MERN, title: "React.js Core Concepts", desc: "Master React components, props, state management and hooks", order: 3, diff: "Beginner",
        notes: [
            { title: "Components & Props", exp: "React UIs are built from reusable components. Props flow data from parent to child (read-only). Use destructuring for clean code.", code: `function UserCard({ name, email, avatar }) {\n  return (\n    <div className="card">\n      <img src={avatar} alt={name} />\n      <h2>{name}</h2>\n      <p>{email}</p>\n    </div>\n  );\n}\n\n// Usage\n<UserCard name="Alice" email="alice@test.com" avatar="/pic.jpg" />` },
            { title: "useState & useEffect", exp: "useState manages local component state. useEffect runs side-effects after render — data fetching, subscriptions, DOM changes. The dependency array controls when it re-runs.", code: `import { useState, useEffect } from 'react';\n\nfunction DataFetcher({ url }) {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    fetch(url).then(r => r.json()).then(d => {\n      setData(d);\n      setLoading(false);\n    });\n  }, [url]); // re-runs when url changes\n\n  if (loading) return <p>Loading...</p>;\n  return <pre>{JSON.stringify(data, null, 2)}</pre>;\n}` },
        ],
        questions: [
            { q: "What is the Virtual DOM?", a: "A lightweight JS representation of the real DOM. React diffs the new virtual DOM against the previous one and only updates changed parts in the real DOM, making updates fast.", diff: "Easy" },
            { q: "Explain the rules of React Hooks.", a: "1) Only call hooks at the top level (not in loops/conditions). 2) Only call hooks from React function components or custom hooks. These rules ensure hook state is consistent across renders.", diff: "Medium" },
            { q: "What is React reconciliation?", a: "The process by which React updates the DOM. React creates a new virtual DOM tree, diffs it against the old one, then applies minimal DOM operations. Keys help identify list items for efficient updates.", diff: "Hard" },
        ],
        assessments: [{
            title: "React Fundamentals Quiz", diff: "Beginner", duration: 20, qs: [
                { id: "q1", question: "Which hook manages local state?", options: ["useEffect", "useRef", "useState", "useContext"], correctAnswer: "C" },
                { id: "q2", question: "Props in React are:", options: ["Mutable in child", "Read-only in child", "Global variables", "State variables"], correctAnswer: "B" },
                { id: "q3", question: "What does an empty [] dependency in useEffect mean?", options: ["Re-run on every render", "Run once on mount", "Never run", "Run on unmount"], correctAnswer: "B" },
                { id: "q4", question: "What is the purpose of the key prop?", options: ["Style elements", "Identify list items for updates", "Pass data down", "Handle events"], correctAnswer: "B" },
            ]
        }],
        projects: [{ title: "Task Manager App", desc: "Build a full task manager with add/edit/delete tasks, filter by status, priority levels, and local storage persistence.", tech: "React,CSS,LocalStorage" }],
    },

    {
        domain: DOMAINS.MERN, title: "Authentication & JWT", desc: "Implement secure auth with JWT, bcrypt and session management", order: 4, diff: "Intermediate",
        notes: [
            { title: "JWT Authentication Flow", exp: "JWT (JSON Web Token) is a stateless auth mechanism. On login, server creates a signed token. Client sends it in headers on every request. Server verifies signature — no DB lookup needed.", code: `const jwt = require('jsonwebtoken');\nconst bcrypt = require('bcrypt');\n\n// Login\napp.post('/auth/login', async (req, res) => {\n  const user = await User.findOne({ email: req.body.email });\n  const valid = await bcrypt.compare(req.body.password, user.password);\n  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });\n\n  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });\n  res.json({ token });\n});\n\n// Middleware to protect routes\nfunction authMiddleware(req, res, next) {\n  const token = req.headers.authorization?.split(' ')[1];\n  const payload = jwt.verify(token, process.env.JWT_SECRET);\n  req.user = payload;\n  next();\n}` },
        ],
        questions: [
            { q: "What are the three parts of a JWT token?", a: "Header (algorithm + token type), Payload (claims/data like userId, expiry), Signature (HMAC of header+payload using secret key). Encoded as base64url separated by dots.", diff: "Medium" },
            { q: "Why should passwords be hashed and not encrypted?", a: "Hashing is one-way (irreversible). If DB is breached, hashed passwords can't be reversed. Encryption is two-way — if the key is stolen, all passwords are exposed. Use bcrypt/Argon2 for password hashing.", diff: "Medium" },
        ],
        assessments: [{
            title: "Auth & Security Quiz", diff: "Intermediate", duration: 20, qs: [
                { id: "q1", question: "Where should JWT tokens be stored securely?", options: ["localStorage", "sessionStorage", "HttpOnly cookies", "window.token"], correctAnswer: "C" },
                { id: "q2", question: "What does bcrypt.compare() do?", options: ["Encrypts a password", "Checks plain text against hash", "Generates a JWT", "Decrypts password"], correctAnswer: "B" },
                { id: "q3", question: "What is the purpose of JWT expiry?", options: ["Improve performance", "Limit token validity to reduce breach risk", "Compress token size", "Enable refresh tokens"], correctAnswer: "B" },
            ]
        }],
        projects: [{ title: "Auth System with Refresh Tokens", desc: "Build complete authentication: register, login, JWT access tokens, refresh tokens stored in HttpOnly cookies, protected routes middleware.", tech: "Node.js,Express,JWT,bcrypt" }],
    },

    // ── Data Analytics ──
    {
        domain: DOMAINS.ANALYTICS, title: "Python for Data Analysis", desc: "Python fundamentals for data science: NumPy, Pandas data manipulation", order: 1, diff: "Beginner",
        notes: [
            { title: "Pandas DataFrames", exp: "Pandas DataFrames are 2D labeled data structures like spreadsheets. Essential for any data analysis task — loading, cleaning, filtering, grouping and transforming data.", code: `import pandas as pd\n\ndf = pd.read_csv('sales.csv')\n\nprint(df.head())           # First 5 rows\nprint(df.describe())       # Statistics\nprint(df.info())           # Data types\n\n# Filter rows\ndf_high = df[df['sales'] > 10000]\n\n# Group by and aggregate\nmonthly = df.groupby('month')['revenue'].sum()` },
        ],
        questions: [
            { q: "What is the difference between a Pandas Series and DataFrame?", a: "Series is 1D labeled array (single column). DataFrame is 2D — a collection of Series sharing the same index. Like a spreadsheet with rows and columns.", diff: "Easy" },
            { q: "How do you handle missing values in Pandas?", a: "df.isnull() detects NaN. df.dropna() removes rows. df.fillna(value) fills with a value. df.interpolate() estimates numerically. Choice depends on data context.", diff: "Medium" },
        ],
        assessments: [{
            title: "Python Data Analysis Quiz", diff: "Beginner", duration: 20, qs: [
                { id: "q1", question: "Which method reads a CSV in Pandas?", options: ["pd.open_csv()", "pd.read_csv()", "pd.load()", "pd.csv()"], correctAnswer: "B" },
                { id: "q2", question: "What does df.shape return?", options: ["Column names", "Data types", "(rows, cols) tuple", "Memory size"], correctAnswer: "C" },
                { id: "q3", question: "How to remove duplicates?", options: ["df.clean()", "df.drop_duplicates()", "df.unique()", "df.remove()"], correctAnswer: "B" },
            ]
        }],
        projects: [{ title: "Sales Data Analysis", desc: "Load and analyze a real sales CSV: clean nulls, compute revenue KPIs, find top products, visualize monthly trends, export summary report.", tech: "Python,Pandas,Matplotlib" }],
    },

    {
        domain: DOMAINS.ANALYTICS, title: "Data Visualization", desc: "Create insightful charts with Matplotlib, Seaborn and Plotly", order: 2, diff: "Beginner",
        notes: [
            { title: "Matplotlib & Seaborn Basics", exp: "Matplotlib is the foundation of Python visualization. Seaborn builds on it with beautiful statistical charts. Choose chart type based on what you want to communicate.", code: `import matplotlib.pyplot as plt\nimport seaborn as sns\n\n# Line chart\nplt.figure(figsize=(10, 6))\nplt.plot(df['month'], df['revenue'], marker='o', color='steelblue')\nplt.title('Monthly Revenue')\nplt.xlabel('Month')\nplt.ylabel('Revenue ($)')\nplt.tight_layout()\nplt.show()\n\n# Seaborn heatmap (correlations)\nsns.heatmap(df.corr(), annot=True, cmap='coolwarm')` },
        ],
        questions: [
            { q: "When should you use a bar chart vs line chart?", a: "Bar charts for comparing categorical data (e.g., sales by region). Line charts for showing trends over time (e.g., revenue by month). Use scatter plots for relationships between variables.", diff: "Easy" },
            { q: "What is a heatmap used for in data analysis?", a: "Heatmaps show the intensity of values across two dimensions using color. Commonly used to display correlation matrices — high correlation shows bright color, helping identify feature relationships.", diff: "Medium" },
        ],
        assessments: [{
            title: "Data Visualization Quiz", diff: "Beginner", duration: 15, qs: [
                { id: "q1", question: "Which chart is best for showing trends over time?", options: ["Bar chart", "Pie chart", "Line chart", "Scatter plot"], correctAnswer: "C" },
                { id: "q2", question: "What does a scatter plot show?", options: ["Categories", "Time trends", "Relationships between two variables", "Part-to-whole"], correctAnswer: "C" },
            ]
        }],
        projects: [{ title: "Interactive Sales Dashboard", desc: "Build an interactive dashboard with Plotly Dash showing sales KPIs, regional breakdowns, product performance charts with filters.", tech: "Python,Plotly,Pandas,Dash" }],
    },

    {
        domain: DOMAINS.ANALYTICS, title: "Machine Learning Basics", desc: "Supervised/unsupervised learning, model training and evaluation with scikit-learn", order: 3, diff: "Advanced",
        notes: [
            { title: "Supervised Learning", exp: "In supervised learning, the model learns from labeled training data. Classification predicts categories; regression predicts continuous values. Key algorithms: Linear Regression, Logistic Regression, Decision Trees, Random Forest, SVM.", code: `from sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.metrics import accuracy_score, classification_report\n\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, random_state=42\n)\n\nmodel = RandomForestClassifier(n_estimators=100, random_state=42)\nmodel.fit(X_train, y_train)\n\npreds = model.predict(X_test)\nprint(f'Accuracy: {accuracy_score(y_test, preds):.2f}')\nprint(classification_report(y_test, preds))` },
        ],
        questions: [
            { q: "What is overfitting and how do you prevent it?", a: "Overfitting is when a model learns training data too well (including noise) and fails to generalize. Prevent with: regularization (L1/L2), cross-validation, pruning, dropout (neural nets), or more training data.", diff: "Medium" },
            { q: "What is the bias-variance tradeoff?", a: "Bias: error from wrong assumptions (underfitting). Variance: sensitivity to training data fluctuations (overfitting). Good models balance both — complex enough to capture patterns, not so complex they memorize noise.", diff: "Hard" },
        ],
        assessments: [{
            title: "Machine Learning Quiz", diff: "Advanced", duration: 25, qs: [
                { id: "q1", question: "Which metric is best for imbalanced classes?", options: ["Accuracy", "Mean Squared Error", "F1 Score", "R-squared"], correctAnswer: "C" },
                { id: "q2", question: "What does train_test_split do?", options: ["Removes outliers", "Divides data for training and evaluation", "Normalizes features", "Selects features"], correctAnswer: "B" },
                { id: "q3", question: "What is cross-validation?", options: ["Cleaning data", "Testing on multiple data splits to reduce overfitting", "Visualizing model", "Removing features"], correctAnswer: "B" },
            ]
        }],
        projects: [{ title: "Customer Churn Prediction Model", desc: "Predict customer churn using telecom dataset. Compare 3+ algorithms, tune hyperparameters with GridSearchCV, evaluate with confusion matrix and ROC curve.", tech: "Python,scikit-learn,Pandas,seaborn" }],
    },

    // ── Java Full Stack ──
    {
        domain: DOMAINS.JAVA, title: "Core Java & OOP", desc: "Java fundamentals: OOP, interfaces, collections and generics", order: 1, diff: "Beginner",
        notes: [
            { title: "OOP Pillars in Java", exp: "Java is built on 4 OOP principles: Encapsulation (hide data with getters/setters), Inheritance (reuse via extends), Polymorphism (method overriding), Abstraction (abstract classes/interfaces).", code: `// Encapsulation\npublic class BankAccount {\n  private double balance;\n  public double getBalance() { return balance; }\n  public void deposit(double amount) {\n    if (amount > 0) balance += amount;\n  }\n}\n\n// Inheritance + Polymorphism\npublic abstract class Shape {\n  public abstract double area();\n}\npublic class Circle extends Shape {\n  private double r;\n  @Override\n  public double area() { return Math.PI * r * r; }\n}` },
        ],
        questions: [
            { q: "What is the difference between an abstract class and an interface?", a: "Abstract class: can have state, constructors, partial implementations, one per class. Interface: only method signatures (Java 8+ allows default/static methods), no state, a class can implement many.", diff: "Medium" },
            { q: "What is polymorphism in Java?", a: "The ability of one interface to be used for a general class of actions. Method overloading (compile-time) and method overriding (runtime). Enables flexible, extensible code through parent type references.", diff: "Medium" },
        ],
        assessments: [{
            title: "Core Java Quiz", diff: "Beginner", duration: 20, qs: [
                { id: "q1", question: "Keyword for inheritance in Java?", options: ["implements", "extends", "inherits", "super"], correctAnswer: "B" },
                { id: "q2", question: "What is method overloading?", options: ["Same name, different params", "Child overrides parent", "Hiding fields", "Abstract method"], correctAnswer: "A" },
                { id: "q3", question: "Which collection allows duplicates and maintains order?", options: ["Set", "Map", "List", "HashSet"], correctAnswer: "C" },
            ]
        }],
        projects: [{ title: "Banking System OOP Design", desc: "Implement Savings and CurrentAccount classes, interest calculation, transaction history (using collections), account statements.", tech: "Java,OOP,Collections" }],
    },

    {
        domain: DOMAINS.JAVA, title: "Spring Boot REST APIs", desc: "Build production-ready Spring Boot applications with REST endpoints", order: 2, diff: "Intermediate",
        notes: [
            { title: "Spring Boot REST Basics", exp: "Spring Boot auto-configures everything. Use @RestController, @GetMapping, @PostMapping for REST. @Autowired injects dependencies via Spring IoC container.", code: `@RestController\n@RequestMapping("/api/products")\npublic class ProductController {\n\n  @Autowired\n  private ProductService productService;\n\n  @GetMapping\n  public ResponseEntity<List<Product>> getAll() {\n    return ResponseEntity.ok(productService.findAll());\n  }\n\n  @PostMapping\n  public ResponseEntity<Product> create(@RequestBody @Valid ProductDTO dto) {\n    return ResponseEntity\n      .status(HttpStatus.CREATED)\n      .body(productService.create(dto));\n  }\n}` },
        ],
        questions: [
            { q: "What is the difference between @Controller and @RestController?", a: "@Controller returns view names (for MVC/templates). @RestController = @Controller + @ResponseBody, so it automatically serializes return values to JSON. Use @RestController for REST APIs.", diff: "Easy" },
            { q: "What does @Autowired do?", a: "Triggers Spring's dependency injection. Spring automatically injects the matching bean from the application context. Marks a field, constructor, or method to be autowired by Spring.", diff: "Easy" },
        ],
        assessments: [{
            title: "Spring Boot Quiz", diff: "Intermediate", duration: 20, qs: [
                { id: "q1", question: "Which annotation marks a Spring REST endpoint class?", options: ["@Service", "@RestController", "@Repository", "@Component"], correctAnswer: "B" },
                { id: "q2", question: "Which file configures Spring Boot?", options: ["web.xml", "pom.xml", "application.properties", "beans.xml"], correctAnswer: "C" },
                { id: "q3", question: "What does @GetMapping do?", options: ["Handles POST requests", "Maps GET HTTP requests to method", "Injects dependencies", "Validates input"], correctAnswer: "B" },
            ]
        }],
        projects: [{ title: "Library Management API", desc: "Build a complete REST API for a library: books CRUD, member management, book loans, search by author/genre, proper validation.", tech: "Java,Spring Boot,MySQL,JPA" }],
    },

    // ── DevOps ──
    {
        domain: DOMAINS.DEVOPS, title: "Docker & Containerization", desc: "Containerize applications with Docker, Dockerfile and Docker Compose", order: 1, diff: "Intermediate",
        notes: [
            { title: "Docker Fundamentals", exp: "Docker packages code + dependencies into portable containers that run the same everywhere. Dockerfile defines how to build an image. Images are run as containers.", code: `# Dockerfile\nFROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\nCOPY . .\nEXPOSE 3000\nUSER node\nCMD ["node", "server.js"]\n\n# Commands\n# docker build -t my-app .\n# docker run -p 3000:3000 -d my-app\n# docker ps\n# docker logs <container-id>` },
            { title: "Docker Compose", exp: "Docker Compose manages multi-container apps with a YAML file. Handles networking, volumes, and service dependencies automatically.", code: `# docker-compose.yml\nversion: '3.8'\nservices:\n  web:\n    build: .\n    ports: ["3000:3000"]\n    environment:\n      - NODE_ENV=production\n      - MONGO_URL=mongodb://db:27017/app\n    depends_on: [db]\n  db:\n    image: mongo:6\n    volumes:\n      - mongodata:/data/db\nvolumes:\n  mongodata:\n\n# docker compose up -d\n# docker compose down` },
        ],
        questions: [
            { q: "What is the difference between a Docker image and container?", a: "Image is a read-only template/snapshot. Container is a running instance of an image. Many containers can run from one image. Images are built; containers are executed.", diff: "Easy" },
            { q: "What are Docker volumes and why use them?", a: "Volumes are persistent storage that survive container restarts and deletion. Container filesystems are ephemeral — data is lost when it stops. Volumes store databases, uploads, any persistent state.", diff: "Medium" },
        ],
        assessments: [{
            title: "Docker Quiz", diff: "Intermediate", duration: 20, qs: [
                { id: "q1", question: "What command builds a Docker image?", options: ["docker run", "docker build", "docker create", "docker start"], correctAnswer: "B" },
                { id: "q2", question: "What does .dockerignore do?", options: ["Ignores Docker commands", "Excludes files from build context", "Speeds up container", "Skips layers"], correctAnswer: "B" },
                { id: "q3", question: "Which command shows running containers?", options: ["docker images", "docker ps", "docker list", "docker show"], correctAnswer: "B" },
            ]
        }],
        projects: [{ title: "Dockerize a MERN Stack App", desc: "Containerize a full MERN app with Docker Compose — separate services for React, Express API, and MongoDB with volume persistence and environment variables.", tech: "Docker,Docker Compose,MERN" }],
    },

    {
        domain: DOMAINS.DEVOPS, title: "CI/CD Pipelines", desc: "Automate build, test, deploy with GitHub Actions and Jenkins", order: 2, diff: "Intermediate",
        notes: [
            { title: "GitHub Actions CI/CD", exp: "GitHub Actions automates workflows triggered by git events (push, PR). Define pipelines in .github/workflows/*.yml. Jobs run on virtual machines (runners).", code: `# .github/workflows/ci-cd.yml\nname: CI/CD\non:\n  push:\n    branches: [main]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - uses: actions/setup-node@v3\n        with: { node-version: '18' }\n      - run: npm ci\n      - run: npm test\n  deploy:\n    needs: test\n    runs-on: ubuntu-latest\n    steps:\n      - name: Deploy to production\n        env:\n          DEPLOY_KEY: \${{ secrets.DEPLOY_KEY }}\n        run: ./scripts/deploy.sh` },
        ],
        questions: [
            { q: "What is the difference between CI and CD?", a: "CI (Continuous Integration): automatically build and test on every commit. CD (Continuous Delivery): automatically deploy passing builds to staging. Continuous Deployment: auto-deploy to production too.", diff: "Easy" },
            { q: "What are GitHub Actions secrets and why are they needed?", a: "Secrets are encrypted environment variables stored in repository/organization settings. Used for API keys, deploy credentials, passwords. Never hardcode credentials in workflow files.", diff: "Medium" },
        ],
        assessments: [{
            title: "CI/CD Quiz", diff: "Intermediate", duration: 20, qs: [
                { id: "q1", question: "What triggers a GitHub Actions workflow?", options: ["Only manual", "Events like push/PR", "Only on main", "Only merged PRs"], correctAnswer: "B" },
                { id: "q2", question: "What is a deployment pipeline?", options: ["Network cable", "Automated build/test/deploy steps", "A server type", "A database migration"], correctAnswer: "B" },
            ]
        }],
        projects: [{ title: "Full CI/CD Pipeline", desc: "Build a GitHub Actions pipeline: lint code, run tests, build Docker image, push to Docker Hub, deploy to Render/AWS with rollback on failure.", tech: "GitHub Actions,Docker,AWS" }],
    },

    {
        domain: DOMAINS.DEVOPS, title: "Kubernetes Orchestration", desc: "Deploy and manage containers at scale with Kubernetes", order: 3, diff: "Advanced",
        notes: [
            { title: "Kubernetes Core Concepts", exp: "Kubernetes (K8s) orchestrates containers across multiple nodes. Key objects: Pod (smallest unit), Deployment (manages pod replicas), Service (network access), Ingress (HTTP routing).", code: `# deployment.yaml\napiVersion: apps/v1\nkind: Deployment\nmetadata:\n  name: web-app\nspec:\n  replicas: 3\n  selector:\n    matchLabels: { app: web }\n  template:\n    metadata:\n      labels: { app: web }\n    spec:\n      containers:\n      - name: web\n        image: my-app:latest\n        ports: [{ containerPort: 3000 }]\n        resources:\n          limits: { memory: "256Mi", cpu: "500m" }\n\n# kubectl apply -f deployment.yaml\n# kubectl get pods` },
        ],
        questions: [
            { q: "What is the difference between a Pod and a Deployment?", a: "Pod is the smallest unit (one or more containers). Deployment manages pods — ensures desired number of replicas are running, handles rolling updates and rollbacks automatically.", diff: "Medium" },
            { q: "What is a Kubernetes Service?", a: "An abstraction that defines a stable network endpoint to access a set of pods. Types: ClusterIP (internal), NodePort (external on node), LoadBalancer (cloud LB), ExternalName (DNS alias).", diff: "Medium" },
        ],
        assessments: [{
            title: "Kubernetes Quiz", diff: "Advanced", duration: 25, qs: [
                { id: "q1", question: "What is the smallest deployable unit in Kubernetes?", options: ["Container", "Pod", "Node", "Deployment"], correctAnswer: "B" },
                { id: "q2", question: "What does kubectl apply do?", options: ["Deletes resources", "Creates/updates resources from YAML", "Scales pods", "Shows logs"], correctAnswer: "B" },
            ]
        }],
        projects: [{ title: "Deploy Microservices on K8s", desc: "Deploy a multi-service app on a local Kubernetes cluster (minikube): frontend, API, database services with Ingress routing and ConfigMaps.", tech: "Kubernetes,Docker,kubectl,YAML" }],
    },

    // ── Cybersecurity ──
    {
        domain: DOMAINS.CYBER, title: "Web Application Security", desc: "OWASP Top 10: SQL injection, XSS, CSRF and mitigation strategies", order: 1, diff: "Intermediate",
        notes: [
            { title: "SQL Injection Prevention", exp: "SQL injection embeds malicious SQL via user input. Most critical web vulnerability. Prevention: ALWAYS use parameterized queries or ORMs — never concatenate user input into SQL strings.", code: `// ❌ VULNERABLE\nconst q = "SELECT * FROM users WHERE email='" + email + "'";\n// Attacker input: ' OR '1'='1 -- bypasses auth!\n\n// ✅ SAFE - Parameterized Query\nconst q = "SELECT * FROM users WHERE email = $1";\ndb.query(q, [email]);\n\n// ✅ SAFE - ORM (Mongoose)\nconst user = await User.findOne({ email }); // auto-parameterized` },
            { title: "XSS Prevention", exp: "Cross-Site Scripting injects malicious scripts into pages. Stored XSS saves in DB; Reflected XSS in URL. Prevention: output encoding, Content Security Policy header, avoid innerHTML with user data.", code: `// ❌ VULNERABLE\ndocument.getElementById('msg').innerHTML = userInput;\n\n// ✅ SAFE - textContent\ndocument.getElementById('msg').textContent = userInput;\n\n// ✅ CSP Header\napp.use((req, res, next) => {\n  res.setHeader(\n    'Content-Security-Policy',\n    "default-src 'self'; script-src 'self'"\n  );\n  next();\n});` },
        ],
        questions: [
            { q: "What are the OWASP Top 10 vulnerabilities?", a: "1)Broken Access Control 2)Cryptographic Failures 3)Injection 4)Insecure Design 5)Security Misconfiguration 6)Vulnerable Components 7)Auth Failures 8)Data Integrity Failures 9)Logging Failures 10)SSRF", diff: "Medium" },
            { q: "What is CSRF and how do you prevent it?", a: "CSRF tricks authenticated users into executing unwanted actions. Prevention: CSRF tokens (unique per session form field), SameSite=Strict/Lax cookie attribute, validate Origin/Referer headers.", diff: "Medium" },
            { q: "What is the difference between authentication and authorization?", a: "Authentication verifies WHO you are (login, identity). Authorization verifies WHAT you can do (permissions, roles). Both are required: authenticate first, then authorize based on role.", diff: "Easy" },
        ],
        assessments: [{
            title: "Web Security Quiz", diff: "Intermediate", duration: 20, qs: [
                { id: "q1", question: "What prevents SQL injection?", options: ["HTTPS", "Parameterized queries", "Strong passwords", "Firewalls"], correctAnswer: "B" },
                { id: "q2", question: "Which HTTP header helps prevent XSS?", options: ["Authorization", "Content-Type", "Content-Security-Policy", "Accept"], correctAnswer: "C" },
                { id: "q3", question: "What does HTTPS protect against?", options: ["SQL injection", "Man-in-the-middle attacks", "CSRF", "Broken auth"], correctAnswer: "B" },
            ]
        }],
        projects: [{ title: "Security Audit Report", desc: "Audit DVWA or OWASP WebGoat app: find and exploit SQL injection, XSS, CSRF in a controlled lab. Document each finding with CVSS score and remediation steps.", tech: "Burp Suite,OWASP,Kali Linux" }],
    },

    {
        domain: DOMAINS.CYBER, title: "Cryptography Fundamentals", desc: "Encryption, hashing, PKI, TLS/SSL and digital signatures", order: 2, diff: "Intermediate",
        notes: [
            { title: "Symmetric vs Asymmetric Encryption", exp: "Symmetric: same key encrypts/decrypts (AES). Fast, but key sharing is a challenge. Asymmetric: public key encrypts, private key decrypts (RSA). Solves key distribution but slower.", code: `const crypto = require('crypto');\n\n// Symmetric: AES-256-GCM\nconst key = crypto.randomBytes(32);\nconst iv = crypto.randomBytes(16);\nconst cipher = crypto.createCipheriv('aes-256-gcm', key, iv);\nlet enc = cipher.update('secret', 'utf8', 'hex');\nenc += cipher.final('hex');\n\n// Hashing (one-way)\nconst hash = crypto\n  .createHash('sha256')\n  .update('my data')\n  .digest('hex');` },
        ],
        questions: [
            { q: "What is the difference between hashing and encryption?", a: "Encryption is two-way (reversible with key). Hashing is one-way (irreversible). Use encryption for data that needs retrieval. Use hashing for passwords and data integrity (you only need to verify, not reverse).", diff: "Easy" },
            { q: "What is TLS and how does it work?", a: "TLS (Transport Layer Security) encrypts data in transit. Works via: 1) Handshake (client/server agree on cipher, exchange certificates) 2) Key exchange (create session keys) 3) All data encrypted with session key.", diff: "Medium" },
        ],
        assessments: [{
            title: "Cryptography Quiz", diff: "Intermediate", duration: 20, qs: [
                { id: "q1", question: "Which is best for password storage?", options: ["AES", "RSA", "bcrypt/Argon2", "MD5"], correctAnswer: "C" },
                { id: "q2", question: "What does a digital signature verify?", options: ["Encryption strength", "Sender identity and data integrity", "Password strength", "SSL validity"], correctAnswer: "B" },
            ]
        }],
        projects: [{ title: "Encrypted Messaging App", desc: "Build a secure messaging system with end-to-end encryption using asymmetric keys, digital signatures for message authenticity, and secure key exchange.", tech: "Node.js,crypto,Security" }],
    },

    // ── UI/UX ──
    {
        domain: DOMAINS.UIUX, title: "Design Principles & Color Theory", desc: "Color theory, typography, grid systems and visual hierarchy", order: 1, diff: "Beginner",
        notes: [
            { title: "Color Theory for UI", exp: "Color creates hierarchy, emotion, and brand identity. The 60-30-10 rule: 60% primary/background, 30% secondary, 10% accent. WCAG AA requires 4.5:1 contrast ratio for normal text.", code: `/* Design Token System */\n:root {\n  --color-primary:     hsl(250, 80%, 55%);\n  --color-primary-50:  hsl(250, 80%, 97%);\n  --color-secondary:   hsl(200, 70%, 50%);\n  --color-neutral-900: hsl(220, 20%, 10%);\n  --color-neutral-600: hsl(220, 10%, 40%);\n  --color-neutral-100: hsl(220, 20%, 97%);\n  --color-success:     hsl(142, 71%, 45%);\n  --color-error:       hsl(0, 84%, 60%);\n}` },
            { title: "Typography Scale", exp: "Typography drives readability. Rules: max 2-3 typefaces, clear size hierarchy, 1.4-1.6 line height for body text, min 16px body size, sufficient contrast for all text.", code: `/* Modular Typographic Scale */\n:root {\n  --text-xs:   0.75rem;  /* 12px - captions */\n  --text-sm:   0.875rem; /* 14px - labels  */\n  --text-base: 1rem;     /* 16px - body    */\n  --text-lg:   1.25rem;  /* 20px - lead    */\n  --text-xl:   1.5rem;   /* 24px - h4      */\n  --text-2xl:  2rem;     /* 32px - h3      */\n  --text-3xl:  2.5rem;   /* 40px - h2      */\n  --text-4xl:  3rem;     /* 48px - h1      */\n  --leading-body:    1.6;\n  --leading-heading: 1.2;\n}` },
        ],
        questions: [
            { q: "What is the 60-30-10 color rule?", a: "A design balance rule: 60% dominant/background color, 30% secondary/complementary color, 10% accent color for calls-to-action. Creates visual harmony and guides the eye toward important elements.", diff: "Easy" },
            { q: "What is visual hierarchy and how do you create it?", a: "Visual hierarchy guides what users see first. Created through: size (larger = more important), color contrast, whitespace, typography weight/size, and positioning on page.", diff: "Medium" },
        ],
        assessments: [{
            title: "Design Principles Quiz", diff: "Beginner", duration: 15, qs: [
                { id: "q1", question: "WCAG AA minimum contrast for normal text?", options: ["2:1", "3:1", "4.5:1", "7:1"], correctAnswer: "C" },
                { id: "q2", question: "What is kerning?", options: ["Font weight", "Space between specific letter pairs", "Line height", "Font size"], correctAnswer: "B" },
                { id: "q3", question: "Which Gestalt principle groups similar elements?", options: ["Proximity", "Similarity", "Continuity", "Figure-Ground"], correctAnswer: "B" },
            ]
        }],
        projects: [{ title: "Brand Identity Design System", desc: "Create a complete visual identity: logo direction, color palette, typography scale, icon style guide, and component examples in Figma.", tech: "Figma,Color Theory,Typography" }],
    },

    {
        domain: DOMAINS.UIUX, title: "Figma & Prototyping", desc: "Components, auto-layout, variables, design tokens and interactive prototypes", order: 2, diff: "Intermediate",
        notes: [
            { title: "Figma Components & Auto-Layout", exp: "Components are reusable UI elements in Figma. Auto-layout works like CSS Flexbox — content-aware sizing, responsive padding. Use variants for different states (default, hover, active, disabled).", code: `// Design Tokens (exported from Figma for dev handoff)\n{\n  "color": {\n    "brand": {\n      "primary": { "value": "#7C3AED" },\n      "secondary": { "value": "#4F46E5" }\n    }\n  },\n  "spacing": {\n    "sm": { "value": "8px" },\n    "md": { "value": "16px" },\n    "lg": { "value": "24px" }\n  },\n  "radius": {\n    "sm": { "value": "4px" },\n    "md": { "value": "8px" },\n    "full": { "value": "9999px" }\n  }\n}` },
        ],
        questions: [
            { q: "What are design tokens?", a: "Named values that store design decisions (colors, spacing, typography). A single source of truth shared between design and code. Changing a token propagates everywhere, ensuring design consistency.", diff: "Medium" },
            { q: "What is the difference between a wireframe and a prototype?", a: "Wireframe: static lo-fi layout showing structure and placement without visual design. Prototype: interactive, clickable mockup simulating real user flows. Wireframes come first to validate layout before visual design.", diff: "Easy" },
        ],
        assessments: [{
            title: "Figma & Prototyping Quiz", diff: "Intermediate", duration: 20, qs: [
                { id: "q1", question: "What does Auto-layout in Figma mimic in code?", options: ["CSS Grid", "CSS Flexbox", "CSS Position", "CSS Float"], correctAnswer: "B" },
                { id: "q2", question: "What is a component variant?", options: ["A copy of a frame", "Different states of same component", "A plugin", "An animation"], correctAnswer: "B" },
                { id: "q3", question: "Design tokens are used to:", options: ["Create animations", "Store reusable design values", "Generate code automatically", "Make prototypes clickable"], correctAnswer: "B" },
            ]
        }],
        projects: [{ title: "Mobile Banking App UI", desc: "Design a complete mobile banking app in Figma with full component library, design tokens, 10+ screens (login, dashboard, transfers, history), and clickable prototype.", tech: "Figma,Prototyping,UI Design" }],
    },

    {
        domain: DOMAINS.UIUX, title: "Accessibility (a11y)", desc: "WCAG guidelines, screen readers, keyboard navigation and ARIA labels", order: 3, diff: "Intermediate",
        notes: [
            { title: "WCAG Accessibility Principles", exp: "WCAG 2.1 has 4 principles (POUR): Perceivable, Operable, Understandable, Robust. Level AA is the standard requirement. Most important: keyboard navigation, sufficient contrast, alt text, semantic HTML.", code: `<!-- ❌ Inaccessible -->\n<div onclick="submit()">Submit</div>\n<img src="chart.png">\n<span style="color:red">Error</span>\n\n<!-- ✅ Accessible -->\n<button type="submit" aria-label="Submit form">Submit</button>\n<img src="chart.png" alt="Bar chart showing Q4 revenue of $2M">\n<span role="alert" aria-live="polite">Email is required</span>\n\n<!-- Keyboard accessible custom dropdown -->\n<div role="listbox" tabindex="0" aria-label="Options">\n  <div role="option" tabindex="-1">Option A</div>\n</div>` },
        ],
        questions: [
            { q: "What are the 4 WCAG principles?", a: "POUR: Perceivable (users can perceive content), Operable (can navigate and interact), Understandable (clear and predictable), Robust (works across assistive technologies). All 4 must be met for accessibility compliance.", diff: "Medium" },
            { q: "What is the purpose of ARIA labels?", a: "ARIA (Accessible Rich Internet Applications) adds semantic meaning to non-semantic HTML for screen readers. aria-label provides a text alternative. aria-live announces dynamic content changes. Use native HTML elements first — ARIA as last resort.", diff: "Medium" },
        ],
        assessments: [{
            title: "Accessibility Quiz", diff: "Intermediate", duration: 20, qs: [
                { id: "q1", question: "What WCAG level is typically required?", options: ["Level A", "Level AA", "Level AAA", "Level B"], correctAnswer: "B" },
                { id: "q2", question: "What is the minimum contrast ratio for large text (WCAG AA)?", options: ["2:1", "3:1", "4.5:1", "7:1"], correctAnswer: "B" },
                { id: "q3", question: "What does alt text on images provide?", options: ["SEO keywords", "Text for screen readers", "Hover captions", "Image compression"], correctAnswer: "B" },
            ]
        }],
        projects: [{ title: "Accessible Component Library", desc: "Build a React component library (Button, Modal, Dropdown, Form) following WCAG AA. Include keyboard navigation, ARIA attributes, focus management, and test with screen readers.", tech: "React,ARIA,WCAG,Accessibility" }],
    },
];

// ── Component ────────────────────────────────────────────────────────────────
export default function SeedData() {
    const [log, setLog] = useState([]);
    const [running, setRunning] = useState(false);
    const [done, setDone] = useState(false);

    const addLog = (msg) => setLog(prev => [...prev, msg]);

    async function runSeed() {
        setRunning(true);
        setLog([]);
        setDone(false);
        let total = { topics: 0, notes: 0, questions: 0, assessments: 0, projects: 0 };

        for (const item of SEED) {
            try {
                addLog(`📚 Creating topic: ${item.title}...`);
                const topicRow = await topicSvc.createTopic({
                    title: item.title,
                    description: item.desc,
                    domainId: item.domain,
                    order: item.order,
                    isActive: true,
                });
                const topicId = topicRow.$id;
                total.topics++;

                for (const n of item.notes || []) {
                    try {
                        await notesSvc.createNote({ title: n.title, explanation: n.exp, codeExample: n.code || "", youtubeUrl: n.url || "", topicId, order: 1 });
                        total.notes++;
                    } catch (e) { addLog(`  ⚠️ Note failed: ${e.message}`); }
                }

                for (let i = 0; i < (item.questions || []).length; i++) {
                    const q = item.questions[i];
                    try {
                        await qSvc.createQuestion({ question: q.q, answer: q.a, difficulty: q.diff, topicId, order: i + 1 });
                        total.questions++;
                    } catch (e) { addLog(`  ⚠️ Question failed: ${e.message}`); }
                }

                for (const a of item.assessments || []) {
                    try {
                        await assSvc.createAssessment({ title: a.title, difficulty: a.diff, duration: a.duration, question: JSON.stringify(a.qs), topicId, isActive: true, passingScore: 70 });
                        total.assessments++;
                    } catch (e) { addLog(`  ⚠️ Assessment failed: ${e.message}`); }
                }

                for (const p of item.projects || []) {
                    try {
                        await projSvc.createProject({ title: p.title, description: p.desc, techStack: p.tech, topicId });
                        total.projects++;
                    } catch (e) { addLog(`  ⚠️ Project failed: ${e.message}`); }
                }

                addLog(`  ✅ Done: ${item.notes?.length || 0} notes · ${item.questions?.length || 0} Qs · ${item.assessments?.length || 0} assessments · ${item.projects?.length || 0} projects`);
            } catch (e) {
                addLog(`❌ Topic failed: ${item.title} — ${e.message}`);
            }
        }

        addLog(`\n🎉 Complete! Topics:${total.topics} Notes:${total.notes} Questions:${total.questions} Assessments:${total.assessments} Projects:${total.projects}`);
        setRunning(false);
        setDone(true);
    }

    return (
        <div style={{ maxWidth: 800, margin: "40px auto", padding: 24, fontFamily: "monospace" }}>
            <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 8 }}>🌱 SkillForge Data Seeder</h1>
            <p style={{ color: "#666", marginBottom: 24 }}>
                Populates all 6 domains with topics, notes, questions, assessments and projects.<br />
                <strong style={{ color: "#c00" }}>⚠️ Admin only — Run once! Will create duplicate data if run again.</strong>
            </p>

            <button
                onClick={runSeed}
                disabled={running || done}
                style={{
                    padding: "12px 32px", fontSize: 16, fontWeight: "bold",
                    background: done ? "#16a34a" : running ? "#94a3b8" : "#7c3aed",
                    color: "#fff", border: "none", borderRadius: 8, cursor: running || done ? "not-allowed" : "pointer",
                    marginBottom: 24,
                }}
            >
                {done ? "✅ Seeding Complete!" : running ? "⏳ Seeding..." : "▶ Start Seeding All Domains"}
            </button>

            {log.length > 0 && (
                <div style={{ background: "#0f172a", color: "#e2e8f0", padding: 16, borderRadius: 8, maxHeight: 500, overflowY: "auto", fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                    {log.map((l, i) => <div key={i}>{l}</div>)}
                </div>
            )}
        </div>
    );
}

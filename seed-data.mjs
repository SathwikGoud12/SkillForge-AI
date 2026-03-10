
// SkillForge AI - Domain Seed Script
// Run with: node seed-data.mjs

const ENDPOINT = "https://sgp.cloud.appwrite.io/v1";
const PROJECT_ID = "69394df8000409a8bb82";
const DB_ID = "69455c25002afee245db";

const TABLES = {
    topics: "topics",
    notes: "topicnotes",
    questions: "interviewquestions",
    assessments: "assessments",
    projects: "projects",
    domainProjects: "domainprojects",
};

// Domain IDs from Appwrite
const DOMAINS = {
    MERN: "6946553b0021f29ad5f6",
    DATA_ANALYTICS: "69a09c3a00189e7149a5",
    JAVA_FULLSTACK: "69a09e440027cb2e32bf",
    DEVOPS: "69a09ed0001561779100",
    CYBERSECURITY: "69a09f1c0008396366e4",
    UIUX: "69a0a011000d34b76100",
};

// ─── Helpers ────────────────────────────────────────────────────────────────
function uid() {
    return Math.random().toString(36).slice(2, 22).padEnd(20, "0").slice(0, 20);
}

async function createRow(tableId, data) {
    const res = await fetch(
        `${ENDPOINT}/databases/${DB_ID}/tables/${tableId}/rows`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Appwrite-Project": PROJECT_ID,
            },
            body: JSON.stringify({ rowId: uid(), data }),
        }
    );
    const json = await res.json();
    if (!res.ok) throw new Error(`${tableId}: ${json.message}`);
    return json;
}

async function seedTopic(domainId, title, description, order, difficulty = "Beginner") {
    const row = await createRow(TABLES.topics, { title, description, domainId, order, isActive: true });
    console.log(`  ✅ Topic: ${title}`);
    return row.$id;
}

async function seedNote(topicId, title, explanation, codeExample = "", youtubeUrl = "") {
    await createRow(TABLES.notes, { title, explanation, codeExample, youtubeUrl, topicId, order: 1 });
    console.log(`    📝 Note: ${title}`);
}

async function seedQuestion(topicId, question, answer, difficulty, order) {
    await createRow(TABLES.questions, { question, answer, difficulty, topicId, order });
    console.log(`    ❓ Q: ${question.slice(0, 50)}...`);
}

async function seedAssessment(topicId, title, difficulty, duration, questions) {
    await createRow(TABLES.assessments, {
        title, difficulty, duration, topicId, isActive: true,
        question: JSON.stringify(questions),
        passingScore: 70,
    });
    console.log(`    📊 Assessment: ${title}`);
}

async function seedProject(topicId, title, description, techStack, difficulty) {
    await createRow(TABLES.projects, { title, description, techStack, difficulty, topicId });
    console.log(`    🚀 Project: ${title}`);
}

async function seedDomainProject(domainId, title, description, difficulty, estimatedHours, requirements) {
    await createRow(TABLES.domainProjects, {
        title, description, difficulty, estimatedHours, domainId,
        requirements: JSON.stringify(requirements), isActive: true
    });
    console.log(`  🏆 Domain Project: ${title}`);
}

// ─── MERN Stack ──────────────────────────────────────────────────────────────
async function seedMERN() {
    console.log("\n🟢 Seeding MERN Stack...");
    const domainId = DOMAINS.MERN;

    const topics = [
        ["MongoDB Fundamentals", "Learn NoSQL database design, collections, CRUD operations and aggregation pipelines", 1, "Beginner"],
        ["Express.js & REST APIs", "Build scalable REST APIs with Express.js, middleware, routing and error handling", 2, "Intermediate"],
        ["React.js Core Concepts", "Master components, props, state, hooks, and the React lifecycle", 3, "Beginner"],
        ["Node.js & Async JavaScript", "Server-side JS with Node.js, event loop, streams, and async/await patterns", 4, "Intermediate"],
        ["Authentication & JWT", "Implement secure auth using JWT tokens, bcrypt, and session management", 5, "Intermediate"],
        ["State Management - Redux", "Global state with Redux Toolkit, reducers, actions, and middleware", 6, "Advanced"],
        ["Deployment & CI/CD", "Deploy MERN apps on Render, Vercel with environment config and pipelines", 7, "Advanced"],
    ];

    for (const [title, desc, order, diff] of topics) {
        const topicId = await seedTopic(domainId, title, desc, order, diff);

        if (title === "MongoDB Fundamentals") {
            await seedNote(topicId, "What is MongoDB?", "MongoDB is a NoSQL document database that stores data in flexible, JSON-like documents. Unlike relational databases, MongoDB doesn't require a predefined schema, making it ideal for modern applications.",
                `// Connect to MongoDB\nconst mongoose = require('mongoose');\nmongoose.connect('mongodb://localhost/mydb');\n\n// Define a Schema\nconst userSchema = new mongoose.Schema({\n  name: String,\n  email: { type: String, unique: true },\n  createdAt: { type: Date, default: Date.now }\n});\nconst User = mongoose.model('User', userSchema);`);
            await seedNote(topicId, "CRUD Operations", "Create, Read, Update, Delete are the four basic operations in MongoDB. These map to insertOne/Many, find/findOne, updateOne/Many, and deleteOne/Many.",
                `// Create\nawait User.create({ name: 'Alice', email: 'alice@example.com' });\n// Read\nconst users = await User.find({ name: 'Alice' });\n// Update\nawait User.updateOne({ email: 'alice@example.com' }, { name: 'Alice Smith' });\n// Delete\nawait User.deleteOne({ email: 'alice@example.com' });`);
            await seedQuestion(topicId, "What is the difference between SQL and NoSQL databases?", "SQL databases are relational, use structured schemas and tables. NoSQL databases like MongoDB are schema-flexible, store docs as JSON/BSON, and scale horizontally. MongoDB is better for unstructured or rapidly evolving data.", "Easy", 1);
            await seedQuestion(topicId, "What is an aggregation pipeline in MongoDB?", "Aggregation pipeline is a framework for data aggregation modeled on the concept of data processing pipelines. Documents enter a multi-stage pipeline that transforms them into an aggregated result using stages like $match, $group, $sort, $project.", "Medium", 2);
            await seedQuestion(topicId, "Explain MongoDB indexing and why it matters.", "Indexes support efficient execution of queries. Without indexes, MongoDB must scan every document. Indexes store a sorted list of field values, dramatically speeding up reads. Use createIndex() to add. Over-indexing slows writes.", "Hard", 3);
            await seedAssessment(topicId, "MongoDB Basics Quiz", "Beginner", 20, [
                { id: "q1", question: "Which command inserts a document in MongoDB?", options: ["db.insert()", "db.collection.insertOne()", "db.add()", "db.push()"], correctAnswer: "B" },
                { id: "q2", question: "What format does MongoDB store documents in?", options: ["XML", "CSV", "BSON/JSON", "SQL"], correctAnswer: "C" },
                { id: "q3", question: "Which clause filters documents in MongoDB?", options: ["WHERE", "$match / find()", "FILTER", "SELECT"], correctAnswer: "B" },
                { id: "q4", question: "What is a replica set in MongoDB?", options: ["A backup file", "A group of MongoDB processes that maintain same data", "A query type", "A collection type"], correctAnswer: "B" },
            ]);
            await seedProject(topicId, "Blog Database Design", "Design and implement a MongoDB schema for a blog platform with users, posts, comments and tags. Include proper indexes and validation.", "MongoDB,Mongoose,Node.js", "Beginner");
        }

        if (title === "React.js Core Concepts") {
            await seedNote(topicId, "Components & Props", "React apps are built from components — reusable, independent pieces of UI. Props pass data from parent to child components (read-only).",
                `function UserCard({ name, email, avatar }) {\n  return (\n    <div className="card">\n      <img src={avatar} alt={name} />\n      <h2>{name}</h2>\n      <p>{email}</p>\n    </div>\n  );\n}`);
            await seedNote(topicId, "useState & useEffect Hooks", "useState adds state to functional components. useEffect runs side effects after render — data fetching, subscriptions, DOM manipulation.",
                `import { useState, useEffect } from 'react';\n\nfunction DataFetcher({ url }) {\n  const [data, setData] = useState(null);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    fetch(url)\n      .then(r => r.json())\n      .then(d => { setData(d); setLoading(false); });\n  }, [url]);\n\n  if (loading) return <p>Loading...</p>;\n  return <pre>{JSON.stringify(data, null, 2)}</pre>;\n}`);
            await seedQuestion(topicId, "What is the Virtual DOM and how does React use it?", "The Virtual DOM is a lightweight JS representation of the real DOM. React compares (diffs) the new virtual DOM with the previous one and only updates the actual DOM where changes occurred, making updates fast and efficient.", "Easy", 1);
            await seedQuestion(topicId, "Explain the rules of React Hooks.", "1) Only call Hooks at the top level (not inside loops/conditionals). 2) Only call Hooks from React functions. These rules ensure Hook state is preserved correctly across renders.", "Medium", 2);
            await seedAssessment(topicId, "React Fundamentals Quiz", "Beginner", 20, [
                { id: "q1", question: "Which hook manages local state in a functional component?", options: ["useEffect", "useRef", "useState", "useContext"], correctAnswer: "C" },
                { id: "q2", question: "Props in React are:", options: ["Mutable within the child", "Read-only in the child", "Global variables", "State variables"], correctAnswer: "B" },
                { id: "q3", question: "When does useEffect run by default?", options: ["Before render", "After every render", "Only on mount", "Only on unmount"], correctAnswer: "B" },
                { id: "q4", question: "What does the key prop help React with?", options: ["Styling elements", "Identifying list items for efficient updates", "Passing data to children", "Event handling"], correctAnswer: "B" },
            ]);
            await seedProject(topicId, "Task Manager App", "Build a full task management app with React. Features: add/edit/delete tasks, filter by status, local storage persistence, and animated UI.", "React,CSS,LocalStorage", "Intermediate");
        }

        if (title === "Express.js & REST APIs") {
            await seedNote(topicId, "Building REST APIs with Express", "Express is a minimal Node.js framework. REST APIs use HTTP methods (GET, POST, PUT, DELETE) to perform CRUD on resources.",
                `const express = require('express');\nconst app = express();\napp.use(express.json());\n\n// GET all users\napp.get('/api/users', async (req, res) => {\n  const users = await User.find();\n  res.json({ success: true, data: users });\n});\n\n// POST create user\napp.post('/api/users', async (req, res) => {\n  const user = await User.create(req.body);\n  res.status(201).json({ success: true, data: user });\n});\n\napp.listen(5000);`);
            await seedQuestion(topicId, "What is middleware in Express?", "Middleware are functions that execute during the request-response cycle. They have access to req, res, and next(). Used for logging, auth, parsing, error handling. Called in order they are defined.", "Medium", 1);
            await seedAssessment(topicId, "Express.js Quiz", "Intermediate", 20, [
                { id: "q1", question: "Which method handles POST requests in Express?", options: ["app.get()", "app.post()", "app.send()", "app.receive()"], correctAnswer: "B" },
                { id: "q2", question: "What does res.json() do?", options: ["Parses JSON body", "Sends JSON response", "Validates JSON", "Stores JSON"], correctAnswer: "B" },
                { id: "q3", question: "What is the purpose of next() in middleware?", options: ["End the response", "Pass control to next middleware", "Log the request", "Parse the body"], correctAnswer: "B" },
            ]);
            await seedProject(topicId, "RESTful API for E-Commerce", "Design and build a complete REST API for an e-commerce platform with products, cart, and order management. Include proper validation and error handling.", "Node.js,Express,MongoDB", "Intermediate");
        }
    }

    await seedDomainProject(domainId, "Full-Stack Social Media App", "Build a complete social media platform with user auth, posts, likes, comments, real-time notifications using the full MERN stack.", "Advanced", 40,
        ["User registration and JWT authentication", "Create/edit/delete posts with image upload", "Like and comment system", "Real-time notifications with Socket.io", "User profile with followers/following", "Deploy to Vercel + Render"]);
}

// ─── Data Analytics ─────────────────────────────────────────────────────────
async function seedDataAnalytics() {
    console.log("\n🔵 Seeding Data Analytics...");
    const domainId = DOMAINS.DATA_ANALYTICS;

    const topics = [
        ["Python for Data Analysis", "Master Python fundamentals for data science: NumPy, Pandas, and data manipulation", 1, "Beginner"],
        ["Data Visualization", "Create insightful charts with Matplotlib, Seaborn, and Plotly", 2, "Beginner"],
        ["SQL for Analytics", "Advanced SQL queries, window functions, CTEs, and database optimization", 3, "Intermediate"],
        ["Statistics & Probability", "Statistical concepts: distributions, hypothesis testing, correlation and regression", 4, "Intermediate"],
        ["Machine Learning Basics", "Supervised/unsupervised learning, model training, evaluation, and scikit-learn", 5, "Advanced"],
        ["Data Cleaning & ETL", "Handle missing data, outliers, data pipelines, and ETL processes", 6, "Intermediate"],
        ["Power BI & Dashboards", "Build interactive business intelligence dashboards and reports", 7, "Beginner"],
    ];

    for (const [title, desc, order, diff] of topics) {
        const topicId = await seedTopic(domainId, title, desc, order, diff);

        if (title === "Python for Data Analysis") {
            await seedNote(topicId, "Pandas DataFrames", "Pandas is the core library for data analysis in Python. DataFrames are 2D tables with labeled rows/columns, similar to Excel spreadsheets but far more powerful.",
                `import pandas as pd\nimport numpy as np\n\n# Create a DataFrame\ndf = pd.DataFrame({\n    'Name': ['Alice', 'Bob', 'Charlie'],\n    'Age': [28, 34, 22],\n    'Salary': [75000, 85000, 65000]\n})\n\n# Basic operations\nprint(df.describe())          # Statistics\nprint(df[df['Age'] > 25])     # Filter\nprint(df.groupby('Age').mean()) # Group by`);
            await seedQuestion(topicId, "What is the difference between a Pandas Series and DataFrame?", "A Series is a 1D labeled array (like a column). A DataFrame is a 2D labeled data structure with rows and columns — essentially a collection of Series sharing the same index.", "Easy", 1);
            await seedQuestion(topicId, "How do you handle missing values in Pandas?", "Use df.isnull() to detect, df.dropna() to remove rows/cols with NaN, df.fillna(value) to replace with a value, or df.interpolate() for numeric interpolation.", "Medium", 2);
            await seedAssessment(topicId, "Python Data Analysis Quiz", "Beginner", 20, [
                { id: "q1", question: "Which Pandas method reads a CSV file?", options: ["pd.open_csv()", "pd.read_csv()", "pd.load_csv()", "pd.import_csv()"], correctAnswer: "B" },
                { id: "q2", question: "What does df.shape return?", options: ["Column names", "Data types", "(rows, columns) tuple", "Memory usage"], correctAnswer: "C" },
                { id: "q3", question: "Which method removes duplicate rows?", options: ["df.clean()", "df.drop_duplicates()", "df.unique()", "df.filter()"], correctAnswer: "B" },
            ]);
            await seedProject(topicId, "Sales Data Analysis", "Analyze a real sales dataset: clean data, compute KPIs, find top products, seasonal trends, and export a summary report.", "Python,Pandas,NumPy", "Beginner");
        }

        if (title === "Machine Learning Basics") {
            await seedNote(topicId, "Supervised Learning", "In supervised learning, the model learns from labeled training data. Key algorithms: Linear Regression (continuous output), Logistic Regression (classification), Decision Trees, Random Forests, SVM.",
                `from sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestClassifier\nfrom sklearn.metrics import accuracy_score\n\nX_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)\n\nmodel = RandomForestClassifier(n_estimators=100)\nmodel.fit(X_train, y_train)\n\npreds = model.predict(X_test)\nprint(f'Accuracy: {accuracy_score(y_test, preds):.2f}')`);
            await seedQuestion(topicId, "What is overfitting and how do you prevent it?", "Overfitting occurs when a model learns the training data too well including noise, performing poorly on new data. Prevent with: cross-validation, regularization (L1/L2), dropout, pruning, or more training data.", "Medium", 1);
            await seedAssessment(topicId, "ML Fundamentals Quiz", "Advanced", 25, [
                { id: "q1", question: "What is the bias-variance tradeoff?", options: ["Speed vs accuracy", "Underfitting vs overfitting balance", "Training vs test size", "Model vs data complexity"], correctAnswer: "B" },
                { id: "q2", question: "Which metric is best for imbalanced classification?", options: ["Accuracy", "Mean Squared Error", "F1 Score", "R-squared"], correctAnswer: "C" },
                { id: "q3", question: "What does cross-validation do?", options: ["Increases dataset size", "Tests model on multiple data splits", "Removes outliers", "Normalizes features"], correctAnswer: "B" },
            ]);
            await seedProject(topicId, "Customer Churn Prediction", "Build a ML model to predict customer churn using real telecom data. Compare multiple algorithms, tune hyperparameters, and present findings in a dashboard.", "Python,scikit-learn,Pandas,Matplotlib", "Advanced");
        }
    }

    await seedDomainProject(domainId, "End-to-End Analytics Pipeline", "Build a complete data analytics pipeline from raw data ingestion to interactive dashboard with predictions.", "Advanced", 35,
        ["Data collection from CSV/API sources", "ETL pipeline with Python and Pandas", "Exploratory Data Analysis with visualizations", "Statistical analysis and hypothesis testing", "ML model for predictions", "Power BI or Plotly Dash dashboard"]);
}

// ─── Java Full Stack ────────────────────────────────────────────────────────
async function seedJavaFullStack() {
    console.log("\n☕ Seeding Java Full Stack...");
    const domainId = DOMAINS.JAVA_FULLSTACK;

    const topics = [
        ["Core Java & OOP", "Java fundamentals: OOP principles, classes, interfaces, collections, and generics", 1, "Beginner"],
        ["Spring Boot Basics", "Build production-ready Spring Boot applications with auto-configuration and REST", 2, "Intermediate"],
        ["Spring Data JPA & Hibernate", "ORM with JPA/Hibernate, entity relationships, JPQL, and database integration", 3, "Intermediate"],
        ["Spring Security & JWT", "Secure Spring APIs with Spring Security, JWT authentication, and role-based access", 4, "Advanced"],
        ["React Frontend Integration", "Build React frontends that consume Java Spring Boot REST APIs", 5, "Intermediate"],
        ["Microservices Architecture", "Design microservices with Spring Cloud, API Gateway, Eureka, and Feign clients", 6, "Advanced"],
        ["Testing in Java", "Unit and integration testing with JUnit 5, Mockito, and Spring Boot Test", 7, "Intermediate"],
    ];

    for (const [title, desc, order, diff] of topics) {
        const topicId = await seedTopic(domainId, title, desc, order, diff);

        if (title === "Spring Boot Basics") {
            await seedNote(topicId, "Creating REST APIs with Spring Boot", "Spring Boot eliminates boilerplate with auto-configuration. Use @RestController, @GetMapping, @PostMapping to build REST APIs quickly.",
                `@RestController\n@RequestMapping("/api/products")\npublic class ProductController {\n\n    @Autowired\n    private ProductService productService;\n\n    @GetMapping\n    public ResponseEntity<List<Product>> getAllProducts() {\n        return ResponseEntity.ok(productService.findAll());\n    }\n\n    @PostMapping\n    public ResponseEntity<Product> createProduct(@RequestBody @Valid ProductDTO dto) {\n        Product product = productService.create(dto);\n        return ResponseEntity.status(HttpStatus.CREATED).body(product);\n    }\n}`);
            await seedQuestion(topicId, "What is the difference between @Component, @Service, and @Repository?", "@Component is generic Spring bean. @Service marks business logic layer. @Repository marks data access layer and adds exception translation. All are detected by component scan but semantically different.", "Medium", 1);
            await seedQuestion(topicId, "What is Spring Boot auto-configuration?", "Auto-configuration automatically configures Spring application based on classpath dependencies. E.g., if H2 is on classpath, it auto-configures an in-memory database. Configured via @SpringBootApplication and spring.factories.", "Medium", 2);
            await seedAssessment(topicId, "Spring Boot Quiz", "Intermediate", 20, [
                { id: "q1", question: "Which annotation marks a Spring REST controller?", options: ["@Controller", "@RestController", "@Service", "@Component"], correctAnswer: "B" },
                { id: "q2", question: "What does @Autowired do?", options: ["Creates a new object", "Injects dependencies automatically", "Maps HTTP requests", "Validates input"], correctAnswer: "B" },
                { id: "q3", question: "Which file configures Spring Boot properties?", options: ["web.xml", "pom.xml", "application.properties", "beans.xml"], correctAnswer: "C" },
            ]);
            await seedProject(topicId, "Library Management System API", "Build a complete REST API for a library: books CRUD, member management, loan tracking with proper validation and error responses.", "Java,Spring Boot,MySQL", "Intermediate");
        }

        if (title === "Core Java & OOP") {
            await seedNote(topicId, "OOP Principles in Java", "Java is built on 4 OOP pillars: Encapsulation (data hiding with getters/setters), Inheritance (extends), Polymorphism (method overriding/overloading), Abstraction (abstract classes/interfaces).",
                `// Encapsulation\npublic class BankAccount {\n    private double balance; // hidden\n    public double getBalance() { return balance; }\n    public void deposit(double amount) {\n        if (amount > 0) balance += amount;\n    }\n}\n\n// Inheritance + Polymorphism\npublic abstract class Shape {\n    public abstract double area();\n}\npublic class Circle extends Shape {\n    private double radius;\n    @Override\n    public double area() { return Math.PI * radius * radius; }\n}`);
            await seedQuestion(topicId, "What is the difference between an abstract class and an interface in Java?", "Abstract class can have constructors, state, and partial implementations. Interface (Java 8+) can have default/static methods but no state. A class can implement multiple interfaces but extend only one abstract class.", "Medium", 1);
            await seedAssessment(topicId, "Core Java Quiz", "Beginner", 20, [
                { id: "q1", question: "Which keyword is used for inheritance in Java?", options: ["implements", "extends", "inherits", "super"], correctAnswer: "B" },
                { id: "q2", question: "What is method overloading?", options: ["Same method name, different parameters", "Same method in subclass", "Hiding parent method", "Overriding interface methods"], correctAnswer: "A" },
                { id: "q3", question: "Which collection allows duplicate elements?", options: ["Set", "Map", "List", "HashSet"], correctAnswer: "C" },
            ]);
            await seedProject(topicId, "Banking System OOP Design", "Design and implement a banking system using Java OOP: Account types (savings/current), transactions, interest calculation, and transaction history.", "Java,OOP", "Beginner");
        }
    }

    await seedDomainProject(domainId, "E-Commerce Full Stack Platform", "Build a complete Java + React e-commerce application with product management, shopping cart, order processing, and admin panel.", "Advanced", 45,
        ["Spring Boot REST API with JPA", "React frontend with cart and checkout", "JWT authentication and role-based access", "Payment gateway integration", "Admin dashboard with analytics", "Docker containerization"]);
}

// ─── DevOps ─────────────────────────────────────────────────────────────────
async function seedDevOps() {
    console.log("\n⚡ Seeding DevOps...");
    const domainId = DOMAINS.DEVOPS;

    const topics = [
        ["Linux & Shell Scripting", "Master Linux commands, file system, permissions, and bash scripting for automation", 1, "Beginner"],
        ["Docker & Containerization", "Containerize applications with Docker, Dockerfile, Docker Compose, and registries", 2, "Intermediate"],
        ["Kubernetes Orchestration", "Deploy and manage containerized apps at scale with Kubernetes (K8s)", 3, "Advanced"],
        ["CI/CD Pipelines", "Automate build, test, and deploy workflows with Jenkins, GitHub Actions, GitLab CI", 4, "Intermediate"],
        ["Infrastructure as Code", "Provision cloud infrastructure with Terraform and manage config with Ansible", 5, "Advanced"],
        ["Monitoring & Observability", "Monitor systems with Prometheus, Grafana, ELK Stack, and alerting", 6, "Advanced"],
        ["Cloud Platforms - AWS", "Core AWS services: EC2, S3, RDS, Lambda, IAM, VPC for production workloads", 7, "Intermediate"],
    ];

    for (const [title, desc, order, diff] of topics) {
        const topicId = await seedTopic(domainId, title, desc, order, diff);

        if (title === "Docker & Containerization") {
            await seedNote(topicId, "Docker Fundamentals", "Docker packages apps and dependencies into portable containers. A Dockerfile defines how to build an image. Images are run as containers.",
                `# Dockerfile for Node.js app\nFROM node:18-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci --only=production\nCOPY . .\nEXPOSE 3000\nUSER node\nCMD ["node", "server.js"]\n\n# Build and run\n# docker build -t my-app .\n# docker run -p 3000:3000 my-app`);
            await seedNote(topicId, "Docker Compose", "Docker Compose defines multi-container apps in a YAML file. Manages networking, volumes, and dependencies between services.",
                `# docker-compose.yml\nversion: '3.8'\nservices:\n  web:\n    build: .\n    ports: ["3000:3000"]\n    environment:\n      - NODE_ENV=production\n      - DB_URL=mongodb://db:27017/myapp\n    depends_on: [db]\n  db:\n    image: mongo:6\n    volumes:\n      - mongodata:/data/db\nvolumes:\n  mongodata:`);
            await seedQuestion(topicId, "What is the difference between a Docker image and a container?", "An image is a read-only template/blueprint. A container is a running instance of an image. Multiple containers can run from the same image. Images are built; containers are run.", "Easy", 1);
            await seedQuestion(topicId, "What are Docker volumes and why use them?", "Volumes are persistent storage that survive container restarts and removal. Data not in a volume is lost when the container stops. Use volumes for databases, uploaded files, and any persistent state.", "Medium", 2);
            await seedAssessment(topicId, "Docker Quiz", "Intermediate", 20, [
                { id: "q1", question: "Which command builds a Docker image?", options: ["docker run", "docker build", "docker create", "docker start"], correctAnswer: "B" },
                { id: "q2", question: "What is the purpose of .dockerignore?", options: ["Ignore Docker commands", "Exclude files from build context", "Stop container auto-start", "Skip layers"], correctAnswer: "B" },
                { id: "q3", question: "Which command lists running containers?", options: ["docker images", "docker ps", "docker list", "docker show"], correctAnswer: "B" },
            ]);
            await seedProject(topicId, "Dockerize a MERN Application", "Containerize a full MERN stack app with Docker Compose: separate containers for React, Express, and MongoDB with proper networking and volume management.", "Docker,Docker Compose,MERN", "Intermediate");
        }

        if (title === "CI/CD Pipelines") {
            await seedNote(topicId, "GitHub Actions CI/CD", "GitHub Actions automates workflows triggered by git events. Define pipelines in .github/workflows/*.yml files.",
                `# .github/workflows/deploy.yml\nname: CI/CD Pipeline\non:\n  push:\n    branches: [main]\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v3\n      - uses: actions/setup-node@v3\n        with: { node-version: '18' }\n      - run: npm ci\n      - run: npm test\n  deploy:\n    needs: test\n    runs-on: ubuntu-latest\n    steps:\n      - name: Deploy to production\n        run: echo "Deploy step here"`);
            await seedQuestion(topicId, "What is the difference between CI and CD?", "CI (Continuous Integration) automatically builds and tests code on every commit. CD (Continuous Delivery/Deployment) automatically deploys passing builds to staging or production environments.", "Easy", 1);
            await seedAssessment(topicId, "CI/CD Quiz", "Intermediate", 20, [
                { id: "q1", question: "What triggers a GitHub Actions workflow?", options: ["Only manual trigger", "Events like push, PR, schedule", "Only on merged PRs", "Only on main branch"], correctAnswer: "B" },
                { id: "q2", question: "What is a deployment pipeline?", options: ["A network cable", "Automated steps to build/test/deploy code", "A type of server", "A database migration"], correctAnswer: "B" },
            ]);
            await seedProject(topicId, "Automated Deployment Pipeline", "Set up a complete CI/CD pipeline with GitHub Actions: lint, test, build Docker image, push to registry, deploy to cloud with rollback on failure.", "GitHub Actions,Docker,AWS/Render", "Advanced");
        }
    }

    await seedDomainProject(domainId, "Production-Ready DevOps Infrastructure", "Build a complete cloud infrastructure with container orchestration, CI/CD, monitoring, and auto-scaling for a microservices application.", "Expert", 50,
        ["Kubernetes cluster setup on AWS EKS", "Terraform infrastructure provisioning", "GitHub Actions CI/CD pipeline", "Prometheus + Grafana monitoring", "ELK stack for log aggregation", "Auto-scaling and load balancing"]);
}

// ─── Cybersecurity ──────────────────────────────────────────────────────────
async function seedCybersecurity() {
    console.log("\n🔒 Seeding Cybersecurity...");
    const domainId = DOMAINS.CYBERSECURITY;

    const topics = [
        ["Networking Fundamentals", "TCP/IP, DNS, HTTP/S, firewalls, VPNs, and network security concepts", 1, "Beginner"],
        ["Web Application Security", "OWASP Top 10: SQL injection, XSS, CSRF, broken auth, and mitigation strategies", 2, "Intermediate"],
        ["Ethical Hacking & Penetration Testing", "Methodology, tools (Nmap, Metasploit, Burp Suite), and responsible disclosure", 3, "Advanced"],
        ["Cryptography Fundamentals", "Symmetric/asymmetric encryption, hashing, PKI, TLS/SSL, and digital signatures", 4, "Intermediate"],
        ["Security Operations (SOC)", "SIEM, threat detection, incident response, and log analysis", 5, "Advanced"],
        ["Cloud Security", "Securing AWS/Azure/GCP: IAM, security groups, encryption, compliance", 6, "Advanced"],
        ["Secure Coding Practices", "Write secure code: input validation, parameterized queries, secret management", 7, "Intermediate"],
    ];

    for (const [title, desc, order, diff] of topics) {
        const topicId = await seedTopic(domainId, title, desc, order, diff);

        if (title === "Web Application Security") {
            await seedNote(topicId, "SQL Injection", "SQL injection occurs when user input is directly embedded in SQL queries. Attackers can bypass authentication, dump databases, or destroy data. Prevention: always use parameterized queries or ORMs.",
                `// ❌ VULNERABLE\nconst query = "SELECT * FROM users WHERE email='" + email + "'";\n// Attacker input: ' OR '1'='1\n// Becomes: SELECT * FROM users WHERE email='' OR '1'='1'\n\n// ✅ SECURE - Parameterized Query\nconst query = "SELECT * FROM users WHERE email = ?";\ndb.query(query, [email]); // User input never touches SQL`);
            await seedNote(topicId, "Cross-Site Scripting (XSS)", "XSS allows attackers to inject malicious scripts into web pages viewed by other users. Types: Stored, Reflected, DOM-based. Prevention: output encoding, CSP headers, input validation.",
                `// ❌ VULNERABLE\ndocument.innerHTML = userInput; // executes scripts!\n\n// ✅ SECURE\ndocument.textContent = userInput; // treated as text\n\n// Or encode HTML entities\nfunction escapeHtml(str) {\n  return str\n    .replace(/&/g, '&amp;')\n    .replace(/</g, '&lt;')\n    .replace(/>/g, '&gt;')\n    .replace(/"/g, '&quot;');\n}`);
            await seedQuestion(topicId, "What are the OWASP Top 10 vulnerabilities?", "The OWASP Top 10 are the most critical web security risks: 1) Broken Access Control, 2) Cryptographic Failures, 3) Injection, 4) Insecure Design, 5) Security Misconfiguration, 6) Vulnerable Components, 7) Auth Failures, 8) Data Integrity Failures, 9) Logging Failures, 10) SSRF.", "Medium", 1);
            await seedQuestion(topicId, "What is CSRF and how do you prevent it?", "Cross-Site Request Forgery tricks authenticated users into executing unintended actions. Prevention: CSRF tokens (unique per session), SameSite cookie attribute, validating Origin/Referer headers.", "Medium", 2);
            await seedAssessment(topicId, "Web Security Quiz", "Intermediate", 20, [
                { id: "q1", question: "What prevents SQL injection attacks?", options: ["HTTPS", "Parameterized queries", "Strong passwords", "Firewalls"], correctAnswer: "B" },
                { id: "q2", question: "Which HTTP header helps prevent XSS?", options: ["Authorization", "Content-Type", "Content-Security-Policy", "Accept"], correctAnswer: "C" },
                { id: "q3", question: "What does HTTPS protect against?", options: ["SQL injection", "Man-in-the-middle attacks", "CSRF", "XSS"], correctAnswer: "B" },
            ]);
            await seedProject(topicId, "Vulnerable Web App Security Audit", "Use DVWA or OWASP WebGoat to identify and exploit web vulnerabilities (in a safe lab environment). Document findings with CVE references and remediation steps.", "Burp Suite,OWASP,Kali Linux", "Intermediate");
        }

        if (title === "Cryptography Fundamentals") {
            await seedNote(topicId, "Symmetric vs Asymmetric Encryption", "Symmetric encryption uses the same key to encrypt and decrypt (e.g., AES). Fast, but key distribution is challenging. Asymmetric uses public/private key pairs (e.g., RSA). Public key encrypts; private key decrypts. Slower but solves key exchange.",
                `const crypto = require('crypto');\n\n// AES-256-GCM (Symmetric)\nconst key = crypto.randomBytes(32);\nconst iv = crypto.randomBytes(16);\n\nconst cipher = crypto.createCipheriv('aes-256-gcm', key, iv);\nlet encrypted = cipher.update('secret message', 'utf8', 'hex');\nencrypted += cipher.final('hex');\n\n// Hashing (one-way)\nconst hash = crypto.createHash('sha256').update('data').digest('hex');`);
            await seedQuestion(topicId, "What is the difference between hashing and encryption?", "Encryption is two-way (can decrypt with key). Hashing is one-way (cannot reverse). Use encryption for data that needs to be retrieved (e.g., files), hashing for passwords and data integrity verification.", "Easy", 1);
            await seedAssessment(topicId, "Cryptography Quiz", "Intermediate", 20, [
                { id: "q1", question: "Which algorithm is commonly used for password hashing?", options: ["AES", "RSA", "bcrypt/Argon2", "MD5"], correctAnswer: "C" },
                { id: "q2", question: "What does a digital signature verify?", options: ["Encryption strength", "Identity of sender and data integrity", "Password length", "SSL validity"], correctAnswer: "B" },
            ]);
            await seedProject(topicId, "Encrypted Messaging System", "Build a secure messaging app implementing end-to-end encryption using asymmetric cryptography, message signing, and secure key exchange.", "Node.js,Crypto,Security", "Advanced");
        }
    }

    await seedDomainProject(domainId, "Security Assessment & Hardening Project", "Conduct a full security audit of a sample web application, identify vulnerabilities, and implement comprehensive security hardening.", "Expert", 40,
        ["Network scanning and reconnaissance", "Web application vulnerability assessment", "Exploitation in controlled environment", "Security report with CVSS scores", "Patch and remediation implementation", "Security monitoring setup"]);
}

// ─── UI/UX ─────────────────────────────────────────────────────────────────
async function seedUIUX() {
    console.log("\n🎨 Seeding UI/UX Design...");
    const domainId = DOMAINS.UIUX;

    const topics = [
        ["Design Principles & Theory", "Color theory, typography, grid systems, Gestalt principles, and visual hierarchy", 1, "Beginner"],
        ["User Research Methods", "Interviews, surveys, usability testing, personas, and user journey mapping", 2, "Beginner"],
        ["Wireframing & Prototyping", "Low/high-fidelity wireframes, interactive prototypes with Figma", 3, "Intermediate"],
        ["Figma Mastery", "Components, auto-layout, variables, design tokens, and collaborative design in Figma", 4, "Intermediate"],
        ["Interaction Design & Micro-animations", "Motion design, transitions, micro-interactions, and animation principles", 5, "Advanced"],
        ["Accessibility (a11y)", "WCAG guidelines, color contrast, screen readers, keyboard navigation, ARIA labels", 6, "Intermediate"],
        ["Design Systems", "Build and document consistent design systems with tokens, components, and guidelines", 7, "Advanced"],
    ];

    for (const [title, desc, order, diff] of topics) {
        const topicId = await seedTopic(domainId, title, desc, order, diff);

        if (title === "Design Principles & Theory") {
            await seedNote(topicId, "Color Theory for UI", "Color creates hierarchy, emotion, and brand identity. Key concepts: Hue (color), Saturation (intensity), Lightness. Use the 60-30-10 rule: 60% primary, 30% secondary, 10% accent. Ensure WCAG AA contrast ratio (4.5:1 for text).",
                `/* Good color system with CSS variables */\n:root {\n  --color-primary: hsl(250, 80%, 55%);    /* Purple */\n  --color-primary-light: hsl(250, 80%, 95%);\n  --color-neutral-900: hsl(220, 20%, 10%); /* Dark text */\n  --color-neutral-500: hsl(220, 10%, 50%); /* Secondary text */\n  --color-success: hsl(142, 71%, 45%);\n  --color-error: hsl(0, 84%, 60%);\n}`);
            await seedNote(topicId, "Typography in UI Design", "Typography drives readability and hierarchy. Key rules: limit to 2-3 typefaces, establish clear scale (headings, body, captions), maintain adequate line spacing (1.4-1.6 for body), and minimum 16px body text.",
                `/* Typographic scale */\n:root {\n  --text-xs: 0.75rem;    /* 12px - captions */\n  --text-sm: 0.875rem;   /* 14px - labels */\n  --text-base: 1rem;     /* 16px - body */\n  --text-lg: 1.125rem;   /* 18px - lead */\n  --text-xl: 1.25rem;    /* 20px - h4 */\n  --text-2xl: 1.5rem;    /* 24px - h3 */\n  --text-3xl: 1.875rem;  /* 30px - h2 */\n  --text-4xl: 2.25rem;   /* 36px - h1 */\n  --leading-body: 1.6;\n  --leading-heading: 1.2;\n}`);
            await seedQuestion(topicId, "What is the 60-30-10 color rule?", "The 60-30-10 rule is a design principle where 60% of a design uses the dominant/primary color, 30% uses a secondary color, and 10% uses an accent color. This creates visual balance and guides the user's eye.", "Easy", 1);
            await seedQuestion(topicId, "What is visual hierarchy and how is it created?", "Visual hierarchy guides users' attention through size (larger = more important), color (contrast draws attention), spacing, typography weight, and positioning. It helps users understand what to look at first.", "Medium", 2);
            await seedAssessment(topicId, "Design Principles Quiz", "Beginner", 20, [
                { id: "q1", question: "What is the minimum WCAG AA contrast ratio for normal text?", options: ["2:1", "3:1", "4.5:1", "7:1"], correctAnswer: "C" },
                { id: "q2", question: "What does kerning refer to in typography?", options: ["Font weight", "Space between specific letter pairs", "Line height", "Font size"], correctAnswer: "B" },
                { id: "q3", question: "Which Gestalt principle explains why we see groups of similar elements as related?", options: ["Proximity", "Similarity", "Continuity", "Closure"], correctAnswer: "B" },
            ]);
            await seedProject(topicId, "Brand Identity Design System", "Create a complete visual identity for a fictional startup: logo concept, color palette, typography scale, iconography, and a style guide document.", "Figma,Color Theory,Typography", "Beginner");
        }

        if (title === "Figma Mastery") {
            await seedNote(topicId, "Figma Components & Auto-Layout", "Components in Figma are reusable UI elements. Auto-layout makes components respond to content changes like CSS Flexbox. Use variants for different states (default, hover, active, disabled).",
                `// Design token structure in Figma (documented in JSON)\n{\n  "color": {\n    "brand": { "primary": "#7C3AED", "secondary": "#4F46E5" },\n    "neutral": { "100": "#F5F5F5", "900": "#111827" }\n  },\n  "spacing": { "sm": 8, "md": 16, "lg": 24, "xl": 32 },\n  "radius": { "sm": 4, "md": 8, "lg": 16, "full": 9999 },\n  "fontSize": { "sm": 14, "base": 16, "lg": 18, "xl": 24 }\n}`);
            await seedQuestion(topicId, "What are design tokens and why are they important?", "Design tokens are named values that store design decisions (colors, spacing, typography). They create a single source of truth shared between design and code. Changes in tokens propagate everywhere, ensuring consistency.", "Medium", 1);
            await seedAssessment(topicId, "Figma Quiz", "Intermediate", 20, [
                { id: "q1", question: "What does Auto-layout in Figma mimic?", options: ["CSS Grid", "CSS Flexbox", "CSS Position", "CSS Float"], correctAnswer: "B" },
                { id: "q2", question: "What is a Figma component variant?", options: ["A copy of a frame", "Different states of the same component", "A plugin", "An animation"], correctAnswer: "B" },
                { id: "q3", question: "What are design tokens used for?", options: ["Prototyping interactions", "Storing reusable design values", "Generating code", "Creating animations"], correctAnswer: "B" },
            ]);
            await seedProject(topicId, "Mobile App UI in Figma", "Design a complete mobile banking app in Figma with a proper component library, design tokens, multiple screens, and interactive prototype with realistic animations.", "Figma,UI Design,Prototyping", "Intermediate");
        }
    }

    await seedDomainProject(domainId, "Complete Product Design Case Study", "Design an end-to-end product from user research to high-fidelity prototype with full design system documentation.", "Advanced", 30,
        ["User research through interviews and surveys", "Create user personas and journey maps", "Low-fidelity wireframes for all key screens", "High-fidelity UI design in Figma", "Interactive clickable prototype", "Design system documentation handoff for developers"]);
}

// ─── Main ─────────────────────────────────────────────────────────────────
async function main() {
    console.log("🌱 Starting SkillForge AI Data Seed...\n");

    try {
        await seedMERN();
        await seedDataAnalytics();
        await seedJavaFullStack();
        await seedDevOps();
        await seedCybersecurity();
        await seedUIUX();

        console.log("\n\n🎉 All domains seeded successfully!");
        console.log("✅ Topics, Notes, Questions, Assessments & Projects added for all 6 domains");
    } catch (err) {
        console.error("\n❌ Seed failed:", err.message);
        process.exit(1);
    }
}

main();

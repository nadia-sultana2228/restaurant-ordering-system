pipeline {
    agent any

    environment {
        NODE_VERSION = '18.x'
    }

    stages {
        stage('Clone Repository') {
            steps {
                cleanWs()
                checkout scm
            }
        }

        stage('Setup Node.js') {
            steps {
                sh '''
                    echo "Installing Node.js..."
                    curl -fsSL https://deb.nodesource.com/setup_$NODE_VERSION | sudo -E bash -
                    sudo apt-get install -y nodejs
                '''
            }
        }

        stage('Build Backend') {
            steps {
                sh '''
                    echo "Building Backend..."
                    cd backend
                    npm install
                    npm run build
                '''
            }
        }

        stage('Deploy Backend') {
            steps {
                sh '''
                    echo "Deploying Backend..."
                    cd backend
                    pm2 restart server.js || pm2 start server.js --name restaurant-backend
                '''
            }
        }

        stage('Build Frontend') {
            steps {
                sh '''
                    echo "Building Frontend..."
                    cd frontend
                    npm install
                    npm run build
                '''
            }
        }

        stage('Deploy Frontend') {
            steps {
                sh '''
                    echo "Deploying Frontend..."
                    sudo cp -r frontend/dist/* /var/www/html/
                    sudo systemctl restart nginx
                '''
            }
        }
    }

    post {
        success {
            echo "✅ Deployment successful!"
        }
        failure {
            echo "❌ Deployment failed. Check logs."
        }
    }
}

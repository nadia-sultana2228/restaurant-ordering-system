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
                    node -v
                    npm -v
                '''
            }
        }

        stage('Build Backend') {
            steps {
                sh '''
                    echo "Building Backend..."
                    cd backend
                    npm install

                    # Check if a build script exists before running it
                    if grep -q '"build"' package.json; then
                        echo "Running npm run build..."
                        npm run build
                    else
                        echo "⚠️ No build script found in package.json, skipping build..."
                    fi
                '''
            }
        }

        stage('Deploy Backend') {
            steps {
                sh '''
                    echo "Deploying Backend..."
                    cd backend
                    pm2 delete restaurant-backend || true
                    pm2 start index.js --name restaurant-backend
                    pm2 save
                    '''
            }
        }

        stage('Build Frontend') {
            steps {
                sh '''
                echo "Building Frontend..."
                cd frontend
                npm install --legacy-peer-deps
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

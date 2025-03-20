pipeline {
    agent any

    environment {
        NODE_VERSION = '18'  // Define Node.js version
        FRONTEND_DIR = '/var/www/restaurant-ordering-system/frontend'  // Change if needed
        BACKEND_DIR = '/var/www/restaurant-ordering-system/backend'
    }

    stages {
        stage('Clone Repository') {
            steps {
                cleanWs()  // Clean workspace to avoid conflicts
                checkout scm  // Automatically pulls the latest code
            }
        }

        stage('Setup Node.js') {
            steps {
                sh '''
                    # Install Node.js & npm if not installed
                    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                    sudo apt-get install -y nodejs
                    node -v
                    npm -v
                '''
            }
        }

        stage('Deploy Backend') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh '''
                        npm install  # Install backend dependencies
                        sudo npm install -g pm2  # Install PM2 globally

                        # Restart backend safely
                        pm2 delete restaurant-backend || true  
                        pm2 start index.js --name restaurant-backend  
                        pm2 save  # Save PM2 process for reboot
                    '''
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh '''
                        npm install  # Install frontend dependencies
                        npm run build  # Build frontend

                        # If deploying on S3
                        aws s3 sync dist/ s3://${S3_BUCKET} --delete  

                        # If deploying on Nginx, copy files
                        sudo cp -r dist/* /var/www/html/  
                        sudo systemctl restart nginx  
                    '''
                }
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

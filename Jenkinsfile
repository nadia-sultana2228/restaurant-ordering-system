pipeline {
    agent any

    environment {
        NODE_ENV = "production"
        APP_DIR = "/var/www/restaurant-ordering-system/backend"
        REPO_URL = "https://github.com/nadia-sultana2228/restaurant-ordering-system.git"
    }

    stages {
        stage('Checkout Code') {
            steps {
                script {
                    // Pull the latest code
                    sh "cd $APP_DIR && git reset --hard && git pull origin main"
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    // Install npm dependencies
                    sh "cd $APP_DIR && npm install"
                }
            }
        }

        stage('Restart Application') {
            steps {
                script {
                    // Stop the existing PM2 process
                    sh "pm2 delete restaurant-backend || true"

                    // Start the application using PM2
                    sh "cd $APP_DIR && pm2 start index.js --name 'restaurant-backend' --watch"
                }
            }
        }
    }

    post {
        success {
            echo '✅ Deployment Successful!'
        }
        failure {
            echo '❌ Deployment Failed! Check logs.'
        }
    }
}

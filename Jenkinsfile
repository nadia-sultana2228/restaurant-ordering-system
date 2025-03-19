pipeline {
    agent any

    environment {
        GIT_CREDENTIALS_ID = 'github-token' // Replace with your Jenkins GitHub token credentials ID
        FRONTEND_DIR = '/var/www/restaurant-ordering-system/frontend'
        BACKEND_DIR = '/var/www/restaurant-ordering-system/backend'
    }

    stages {
        stage('Clone Repository') {
            steps {
                script {
                    git branch: 'master', 
                        credentialsId: GIT_CREDENTIALS_ID, 
                        url: 'https://github.com/nadia-sultana2228/restaurant-ordering-system.git'
                }
            }
        }

        stage('Build Backend') {
            steps {
                script {
                    dir('backend') {
                        sh 'npm install'
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Build Frontend') {
            steps {
                script {
                    dir('frontend') {
                        sh 'npm install'
                        sh 'npm run build'
                    }
                }
            }
        }

        stage('Deploy Backend') {
            steps {
                script {
                    sh """
                    cd backend
                    pm2 stop all || true
                    pm2 start npm --name "restaurant-backend" -- run start
                    """
                }
            }
        }

        stage('Deploy Frontend') {
            steps {
                script {
                    sh """
                    sudo rm -rf $FRONTEND_DIR/*
                    sudo cp -r frontend/build/* $FRONTEND_DIR/
                    sudo systemctl restart nginx
                    """
                }
            }
        }
    }

    post {
        success {
            echo "✅ Deployment Successful!"
        }
        failure {
            echo "❌ Deployment Failed!"
        }
    }
}

              

       pipeline {
    agent any

    environment {
        REPO_URL = 'git@github.com:nadia-sultana2228/restaurant-ordering-system.git'
        BRANCH = 'master'
        FRONTEND_DIR = 'frontend'
        BACKEND_DIR = 'backend'
        EC2_USER = 'ubuntu'
        EC2_HOST = '3.111.169.166'
        SSH_KEY = credentials('nginxkeypair')  // Use Jenkins credentials ID
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: "${BRANCH}", credentialsId: 'github-token', url: "${REPO_URL}"
            }
        }

        stage('Build Backend') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh 'npm install'
                    sh 'npm run build'
                }
            }
        }

        stage('Deploy Backend to EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} <<EOF
                    cd /var/www/restaurant-ordering-system/backend
                    git pull origin ${BRANCH}
                    npm install
                    pm2 restart all
                    exit
                    EOF
                    """
                }
            }
        }

        stage('Deploy Frontend to EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} <<EOF
                    cd /var/www/restaurant-ordering-system/frontend
                    git pull origin ${BRANCH}
                    npm install
                    npm run build
                    sudo systemctl restart nginx
                    exit
                    EOF
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

       pipeline {
    agent any

    environment {
        REPO_URL = 'https://github.com/nadia-sultana2228/restaurant-ordering-system.git'
        BRANCH = 'master'
        FRONTEND_DIR = 'frontend'
        BACKEND_DIR = 'backend'
        EC2_USER = 'ubuntu'
        EC2_HOST = '3.111.169.166'
        SSH_KEY = credentials('nginxkeypair')  // Use Jenkins stored SSH key
    }

    stages {
        stage('Clone Repository') {
            steps {
                script {
                    sh '''
                    rm -rf restaurant-ordering-system
                    git clone -b $BRANCH $REPO_URL
                    '''
                }
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                dir("${BACKEND_DIR}") {
                    sh 'npm install'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                dir("${FRONTEND_DIR}") {
                    sh '''
                    npm install
                    npm run build
                    '''
                }
            }
        }

        stage('Deploy Backend to EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh """
                    scp -o StrictHostKeyChecking=no -r ${BACKEND_DIR} ${EC2_USER}@${EC2_HOST}:/var/www/restaurant-ordering-system/
                    ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} <<EOF
                    cd /var/www/restaurant-ordering-system/backend
                    npm install
                    pm2 restart all || pm2 start index.js --name "backend"
                    EOF
                    """
                }
            }
        }

        stage('Deploy Frontend to Nginx') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    sh """
                    scp -o StrictHostKeyChecking=no -r ${FRONTEND_DIR}/dist/* ${EC2_USER}@${EC2_HOST}:/var/www/html/
                    ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_HOST} <<EOF
                    sudo systemctl restart nginx
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

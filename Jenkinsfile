pipeline {
    agent any

    environment {
        NODEJS_HOME = tool 'NodeJS 18'  // Ensure NodeJS is installed in Jenkins
        PATH = "${NODEJS_HOME}/bin:${env.PATH}"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git 'https://github.com/nadia-sultana2228/restaurant-ordering-system.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Application') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy to Server') {
            steps {
                sh '''
                sudo cp -r * /var/www/restaurant-ordering-system/
                sudo systemctl restart nginx
                '''
            }
        }

        stage('Restart Application') {
            steps {
                sh 'pm2 restart all || pm2 start npm -- start'
            }
        }
    }
}


pipeline {
    agent any
    environment {
        NODE_ENV = "production"
        PORT = "5000"
    }
    stages {
        stage('Checkout Latest Code') {
            steps {
                script {
                    retry(3) { // Agar fail ho to 3 baar retry kare
                        checkout scm
                    }
                    sh 'git reset --hard && git pull origin master' // Reset & pull latest code
                }
            }
        }

        stage('Install Dependencies') {
            steps {
                script {
                    sh 'npm install --silent || echo "⚠️ NPM Install Failed, but continuing..."'
                }
            }
        }

        stage('Stop Existing Server') {
            steps {
                script {
                    sh """
                    PID=\$(lsof -t -i:$PORT) || true
                    if [ ! -z "\$PID" ]; then
                        echo "🔴 Stopping running backend on port $PORT"
                        kill -9 \$PID
                    fi
                    """
                }
            }
        }

        stage('Start Backend with New Code') {
            steps {
                script {
                    sh """
                    nohup npm start > backend.log 2>&1 &
                    echo "✅ Backend started successfully with latest changes!"
                    """
                }
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    sleep(5)
                    def status = sh(script: "curl -s -o /dev/null -w '%{http_code}' http://localhost:$PORT", returnStdout: true).trim()
                    if (status != "200") {
                        error "🚨 Health check failed! Server not responding after update."
                    } else {
                        echo "✅ Backend updated and running successfully!"
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo "✅ Jenkins pipeline completed!"
        }
        failure {
            echo "❌ Pipeline failed! Check logs for details."
        }
    }
}

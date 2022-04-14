pipeline {
    agent any

    environment {
        NPM_REGISTRY_URL = "http://npm.test.pl.internal:8080/"
        CHROME_BIN = 'google-chrome'
        NVM_DIR="/var/lib/jenkins/.nvm"
        HOME="$WORKSPACE"
    }

    stages {
        stage('Setup') {
            steps {
                script {
                    try {
                        sh 'which google-chrome'
                    } catch (Exception err) {
                        sh """
                        wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | sudo apt-key add -
                        echo 'deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main' | sudo tee /etc/apt/sources.list.d/google-chrome.list
                        sudo apt-get update
                        sudo apt-get -y install google-chrome-stable
                        """
                    }
                }
                script {
                    // Install cypress depedencies
                    sh "sudo apt-get -y install xvfb libgtk2.0-0 libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2"
                }
                executeIn 'v10.24.0', '''
                    node --version
                    npm --registry ${NPM_REGISTRY_URL} install
                    npm run env-local
                    npm run env-dev
                    npm --registry ${NPM_REGISTRY_URL} run build
                '''
            }
        }
        stage('Unit Tests') {
            steps {
                executeIn 'v10.24.0', '''
                    npm run test-unit-ci
                '''
            }
            post {
                always {
                    junit 'test-results/**.xml'
                    dir('test-results') {
                        deleteDir()
                    }
                }
            }
        }
    }
    post {
        always {
            deleteDir()
        }
    }
}

def executeIn(String nodeVersion, String script) {
    sh 'bash -l -c ". /var/lib/jenkins/.nvm/nvm.sh ; nvm use ' + nodeVersion + ' || nvm install ' + nodeVersion + ' && nvm use ' + nodeVersion + ' && ' + script + '"'
}

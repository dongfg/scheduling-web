pipeline {
  agent any
  environment {
    ACCOUNT_ID = '1607652824904310'
    REGION    = 'cn-hangzhou'
  }
  stages {
    stage("检出代码") {
      steps {
        checkout([
          $class: 'GitSCM',
          branches: [[name: env.GIT_BUILD_REF]],
          userRemoteConfigs: [[
            url: env.GIT_REPO_URL,
            credentialsId: env.CREDENTIALS_ID
        ]]])
      }
    }

    stage('构建') {
      steps {
        script {
            sh '''
            npm install
            npm run build
            mv dist deploy/
            go build -o ./deploy/bootstrap ./deploy
            '''
        }
      }
    }
    stage('部署') {
      when {
        buildingTag()
      }
      steps {
        script {
          try {
            withCredentials([usernamePassword(credentialsId: 'fc5871ba-5c4b-4b91-97e4-32328fba7d6e', usernameVariable: 'ACCESS_KEY_ID', passwordVariable: 'ACCESS_KEY_SECRET')]) {
              sh "curl -o fun-linux.zip http://funcruft-release.oss-accelerate.aliyuncs.com/fun/fun-v3.6.21-linux.zip"
              sh "unzip fun-linux.zip"
              sh "mv fun-v3.6.21-linux /usr/local/bin/fun"
              sh "cd ./deploy && fun deploy -y"
            }
          } catch(err) {
            echo err.getMessage()
          }
        }
      }
    }
  }
}
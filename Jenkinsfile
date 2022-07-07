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
            mv dist .deploy/
            go build -o .deploy/bootstrap .deploy/main.go
            '''
        }
      }
    }
    stage('下载证书') {
      steps {
        script {
            sh '''
              curl -fL "https://dongfg-generic.pkg.coding.net/serverless-aliyun/secrets/ssl.fun.key?version=latest" -o ./.deploy/ssl.private.pem
              curl -fL "https://dongfg-generic.pkg.coding.net/serverless-aliyun/secrets/ssl.fun.cer?version=latest" -o ./.deploy/ssl.cert.pem
            '''
        }
      }
    }
    stage('部署') {
      when {
        branch 'master'
      }
      steps {
        script {
          try {
            withCredentials([usernamePassword(credentialsId: '6384c2ec-5a4d-4b6c-ad57-992dc5a88842', usernameVariable: 'ACCESS_KEY_ID', passwordVariable: 'ACCESS_KEY_SECRET')]) {
              sh "curl -o fun-linux.zip http://funcruft-release.oss-accelerate.aliyuncs.com/fun/fun-v3.6.21-linux.zip"
              sh "unzip fun-linux.zip"
              sh "mv fun-v3.6.21-linux /usr/local/bin/fun"
              sh "cd .deploy/ && fun deploy -y"
            }
          } catch(err) {
            echo err.getMessage()
          }
        }
      }
    }
  }
}

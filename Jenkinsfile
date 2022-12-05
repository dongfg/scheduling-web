pipeline {
  agent any
  environment {
    DOCKER_CACHE_NAME = '/root/.cache/docker/node-16.tar'
    DOCKER_CACHE_EXISTS = fileExists "${DOCKER_CACHE_NAME}"
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

    stage('加载缓存') {
      when { expression { DOCKER_CACHE_EXISTS == 'true' } }
      steps {
        sh "docker load -i ${DOCKER_CACHE_NAME}"
      }
    }

    stage('构建') {
      agent {
        docker {
          image 'node:16'
          reuseNode true
        }
      }
      steps {
        sh 'rm -rf ./dist'
        sh 'yarn'
        sh 'yarn build'
      }
    }

    stage('生成缓存') {
      when { expression { DOCKER_CACHE_EXISTS == 'false' } }
      steps {
        sh 'mkdir -p /root/.cache/docker/'
        sh "docker save -o ${DOCKER_CACHE_NAME} node:16"
      }
    }

    stage('部署') {
      when {
        buildingTag()
      }
      steps {
        script {
          withCredentials([usernamePassword(credentialsId: '96ac0d91-9a7b-4aab-aff7-36b7e80dbf7c', usernameVariable: 'USER', passwordVariable: 'ACCESS_TOKEN')]) {
            sh """
              cd dist
              echo "scheduling.dongfg.com" > CNAME
              git init
              git config --local user.name dongfg
              git config --local user.email mail@dongfg.com
              git remote add origin https://${ACCESS_TOKEN}@github.com/dongfg/scheduling-web.git
              git checkout -b gh-pages
              git add --all
              git commit -m "deploy gh-pages"
              git push origin gh-pages -f
            """
          }
        }
      }
    }
  }
}
FROM node:12

# 작업 디렉토리 생성
WORKDIR /home/ubuntu/HTDSS/HTDSS

# npm install 을 위해, package.json과 package-lock.json을 먼저 copy해둠
COPY package*.json ./

# 패키지 설치
RUN yarn install

# 앱의 소스코드 복사
COPY . .

#  접속할 포트 번호
EXPOSE 3000

#컨테이너가 켜지자마자 실행할 명령어 
#npm start : package.json의 scripts에 있는 start 명령어를 실행
CMD ["yarn", "start"]

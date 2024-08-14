## 서버 실행 방법

프로젝트 최상단에 .env 파일 생성 (https://yangsit.tistory.com/entry/EEKE-DB-env)
```
npm install
```
```
npm start
```

## 서버 배포 스크립트
```
cd eeke
git pull origin main
pm2 kill
npm i --force
pm2 start bin/www

# 모니터링
pm2 monit
```

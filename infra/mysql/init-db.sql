-- MySQL 초기화 스크립트
-- 컨테이너가 처음 시작될 때 자동으로 실행됩니다

-- 데이터베이스가 없으면 생성 (CHARACTER SET과 COLLATE 지정)
CREATE DATABASE IF NOT EXISTS mbwt 
  CHARACTER SET utf8mb4 
  COLLATE utf8mb4_unicode_ci;


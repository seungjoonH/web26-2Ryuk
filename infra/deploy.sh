#!/bin/bash
set -e

# 색상 정의
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 로깅 함수
log() {
  echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] [INFO]${NC} $1"
}

log_error() {
  echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] [ERROR]${NC} $1" >&2
}

log_warn() {
  echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] [WARN]${NC} $1"
}

# 1️⃣ 스크립트 및 프로젝트 경로 설정
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT" || exit 1

# 2️⃣ infra/.env 로드
ENV_FILE="$SCRIPT_DIR/.env"

if [ -f "$ENV_FILE" ]; then
  log ".env 파일 로드 중... ($ENV_FILE)"
  set -a  # export 자동
  source "$ENV_FILE"
  set +a
else
  log_warn ".env 파일이 존재하지 않습니다: $ENV_FILE"
  log "환경 변수가 이미 설정되어 있다고 가정하고 진행합니다."
fi

DOCKER_IMAGE_TAG=${DOCKER_IMAGE_TAG:-latest}

log "배포 시작 (태그: $DOCKER_IMAGE_TAG)"

# 3️⃣ 이전 이미지 태그 백업 (롤백용)
PREVIOUS_TAG=$(docker compose -f "$SCRIPT_DIR/docker-compose.yml" config 2>/dev/null | grep "image:" | head -1 | awk -F: '{print $NF}' | tr -d ' ' || echo "latest")
log "이전 배포 태그: $PREVIOUS_TAG"

# 4️⃣ 배포 전 검증
log "배포 전 검증 시작..."

# 4.1 Docker Compose 파일 검증
if ! docker compose -f "$SCRIPT_DIR/docker-compose.yml" config >/dev/null 2>&1; then
  log_error "Docker Compose 파일 검증 실패"
  exit 1
fi
log "✓ Docker Compose 파일 검증 완료"

# 4.2 이미지 존재 확인
log "이미지 존재 여부 확인 중..."
if ! docker manifest inspect "$DOCKER_USERNAME/$DOCKER_IMAGE_BACKEND:$DOCKER_IMAGE_TAG" >/dev/null 2>&1; then
  log_error "Backend 이미지가 존재하지 않습니다: $DOCKER_USERNAME/$DOCKER_IMAGE_BACKEND:$DOCKER_IMAGE_TAG"
  exit 1
fi
log "✓ Backend 이미지 확인 완료"

if ! docker manifest inspect "$DOCKER_USERNAME/$DOCKER_IMAGE_FRONTEND:$DOCKER_IMAGE_TAG" >/dev/null 2>&1; then
  log_error "Frontend 이미지가 존재하지 않습니다: $DOCKER_USERNAME/$DOCKER_IMAGE_FRONTEND:$DOCKER_IMAGE_TAG"
  exit 1
fi
log "✓ Frontend 이미지 확인 완료"

# 5️⃣ DockerHub 로그인
if [ -n "$DOCKER_USERNAME" ] && [ -n "$DOCKER_PASSWORD" ]; then
  log "DockerHub 로그인 중..."
  if ! docker login -u "$DOCKER_USERNAME" -p "$DOCKER_PASSWORD" >/dev/null 2>&1; then
    log_error "DockerHub 로그인 실패"
    exit 1
  fi
  log "✓ DockerHub 로그인 완료"
else
  log_warn "DOCKER_USERNAME 또는 DOCKER_PASSWORD가 설정되지 않음 (로그인 생략)"
fi

# 6️⃣ 이미지 Pull (실패 시 롤백)
log "이미지 Pull 시작..."
if ! docker pull "$DOCKER_USERNAME/$DOCKER_IMAGE_BACKEND:$DOCKER_IMAGE_TAG"; then
  log_error "Backend 이미지 Pull 실패"
  if [ "$PREVIOUS_TAG" != "latest" ] && [ "$PREVIOUS_TAG" != "$DOCKER_IMAGE_TAG" ]; then
    log_warn "이전 태그로 롤백 시도: $PREVIOUS_TAG"
    DOCKER_IMAGE_TAG=$PREVIOUS_TAG
  else
    exit 1
  fi
fi

if ! docker pull "$DOCKER_USERNAME/$DOCKER_IMAGE_FRONTEND:$DOCKER_IMAGE_TAG"; then
  log_error "Frontend 이미지 Pull 실패"
  if [ "$PREVIOUS_TAG" != "latest" ] && [ "$PREVIOUS_TAG" != "$DOCKER_IMAGE_TAG" ]; then
    log_warn "이전 태그로 롤백 시도: $PREVIOUS_TAG"
    DOCKER_IMAGE_TAG=$PREVIOUS_TAG
    docker pull "$DOCKER_USERNAME/$DOCKER_IMAGE_BACKEND:$DOCKER_IMAGE_TAG" || true
    docker pull "$DOCKER_USERNAME/$DOCKER_IMAGE_FRONTEND:$DOCKER_IMAGE_TAG" || true
  else
    exit 1
  fi
fi
log "✓ 이미지 Pull 완료"

# 7️⃣ 헬스체크 함수
health_check() {
  log "헬스체크 수행 중..."
  local max_attempts=30
  local attempt=0
  
  while [ $attempt -lt $max_attempts ]; do
    # 컨테이너 상태 확인
    local api_status=$(docker compose -f "$SCRIPT_DIR/docker-compose.yml" ps api 2>/dev/null | grep -q "Up" && echo "up" || echo "down")
    local nginx_status=$(docker compose -f "$SCRIPT_DIR/docker-compose.yml" ps nginx 2>/dev/null | grep -q "Up" && echo "up" || echo "down")
    
    if [ "$api_status" = "up" ] && [ "$nginx_status" = "up" ]; then
      # 컨테이너 내부에서 헬스체크 (호스트 포트 개방 없이 확인)
      if docker compose -f "$SCRIPT_DIR/docker-compose.yml" exec -T api \
        wget --quiet --tries=1 --spider "http://localhost:${API_PORT:-3000}/health" >/dev/null 2>&1; then
        log "✓ 헬스체크 통과"
        return 0
      fi
    fi
    
    attempt=$((attempt + 1))
    sleep 2
  done
  
  log_error "헬스체크 실패 (${max_attempts}회 시도)"
  return 1
}

# 8️⃣ 서비스 재시작
log "서비스 재시작 중..."
log "기존 서비스 종료 중..."
docker compose -f "$SCRIPT_DIR/docker-compose.yml" down 2>&1 || log_warn "기존 서비스가 없거나 종료 중 오류 발생 (무시하고 계속 진행)"

log "서비스 시작 중..."
if ! docker compose -f "$SCRIPT_DIR/docker-compose.yml" up -d; then
  log_error "서비스 시작 실패"
  log "상세 오류 확인 중..."
  docker compose -f "$SCRIPT_DIR/docker-compose.yml" config
  docker compose -f "$SCRIPT_DIR/docker-compose.yml" ps -a
  # 롤백 시도
  if [ "$PREVIOUS_TAG" != "latest" ] && [ "$PREVIOUS_TAG" != "$DOCKER_IMAGE_TAG" ]; then
    log_warn "이전 버전으로 롤백 시도..."
    DOCKER_IMAGE_TAG=$PREVIOUS_TAG
    export DOCKER_IMAGE_TAG
    docker compose -f "$SCRIPT_DIR/docker-compose.yml" up -d || exit 1
  else
    exit 1
  fi
fi

# 9️⃣ 헬스체크 수행
if ! health_check; then
  log_error "헬스체크 실패"
  # 롤백 시도
  if [ "$PREVIOUS_TAG" != "latest" ] && [ "$PREVIOUS_TAG" != "$DOCKER_IMAGE_TAG" ]; then
    log_warn "이전 버전으로 롤백 시도..."
    DOCKER_IMAGE_TAG=$PREVIOUS_TAG
    export DOCKER_IMAGE_TAG
    docker compose -f "$SCRIPT_DIR/docker-compose.yml" down
    docker compose -f "$SCRIPT_DIR/docker-compose.yml" up -d
    
    if health_check; then
      log "✓ 롤백 후 헬스체크 통과"
    else
      log_error "롤백 후에도 헬스체크 실패"
      exit 1
    fi
  else
    exit 1
  fi
fi

# 🔟 완료 로그
log "배포 완료 ✅"
log "배포된 태그: $DOCKER_IMAGE_TAG"
docker compose -f "$SCRIPT_DIR/docker-compose.yml" ps

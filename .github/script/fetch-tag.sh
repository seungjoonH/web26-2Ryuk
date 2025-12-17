#!/usr/bin/env bash
set -e

###############################################
# VERSION BUMP SCRIPT (METHOD 2: Merge Commit → API 조회)
#
# 1) merge commit 메시지에서 PR 번호 추출
# 2) GitHub API 로 PR 제목 조회
# 3) PR 제목 규칙 기반 SemVer 증가
#    - [Release] → minor +1
#    - [Fix] → patch +1
#    - 그 외 → 버전 증가하지 않음
# 4) 태그 생성 및 push (description 은 PR 제목)
###############################################

echo "🔍 Fetching latest merge commit..."
MERGE_MSG=$(git log -1 --pretty=%B)

echo "📝 Merge Commit Message:"
echo "$MERGE_MSG"

###############################################
# 1. Merge commit 메시지에서 PR 번호 추출 (#123)
###############################################

PR_NUMBER=$(echo "$MERGE_MSG" | grep -oE '#[0-9]+' | tr -d '#')

if [[ -z "$PR_NUMBER" ]]; then
  echo "❌ PR NUMBER NOT FOUND IN MERGE COMMIT."
  echo "Merge commit message:"
  echo "$MERGE_MSG"
  exit 1
fi

echo "➡️ Detected PR Number: $PR_NUMBER"

###############################################
# 2. GitHub API 로 PR 제목 조회
###############################################
echo "🌐 Fetching PR info from GitHub API..."

API_URL="https://api.github.com/repos/${GITHUB_REPOSITORY}/pulls/$PR_NUMBER"

PR_DATA=$(curl -s \
  -H "Authorization: token $GH_TOKEN" \
  "$API_URL")

PR_TITLE=$(echo "$PR_DATA" | jq -r '.title')

if [[ "$PR_TITLE" == "null" || -z "$PR_TITLE" ]]; then
  echo "❌ Failed to fetch PR title"
  echo "$PR_DATA"
  exit 1
fi

echo "📌 PR Title: $PR_TITLE"

###############################################
# 3. 최신 태그 가져오기 & SemVer 증가
###############################################
echo "🔍 Fetching Git tags..."
git fetch --tags || true

LATEST_TAG=$(git tag --sort=-v:refname | head -n 1)

if [[ -z "$LATEST_TAG" ]]; then
  LATEST_TAG="v0.0.0"
fi

echo "➡️ Latest tag: $LATEST_TAG"

VERSION="${LATEST_TAG#v}"
IFS='.' read -r MAJOR MINOR PATCH <<< "$VERSION"

# 숫자 검증
if ! [[ "$MAJOR" =~ ^[0-9]+$ && "$MINOR" =~ ^[0-9]+$ && "$PATCH" =~ ^[0-9]+$ ]]; then
  MAJOR=0; MINOR=0; PATCH=0
fi

###############################################
# 4. PR 제목 기반 버전 증가
###############################################
if [[ "$PR_TITLE" =~ ^\[?[Rr]elease\]? ]]; then
  echo "🔧 Detected Release → minor version bump"
  MINOR=$((MINOR + 1))
  PATCH=0
  NEW_TAG="v$MAJOR.$MINOR.$PATCH"
  
  echo "🆕 New tag: $NEW_TAG"
  echo "📄 Tag description: $PR_TITLE"
  
  ###############################################
  # 5. 태그 생성 및 push
  ###############################################
  if git rev-parse "$NEW_TAG" >/dev/null 2>&1; then
    echo "⚠️ Tag $NEW_TAG already exists — skipping."
  else
    git tag -a "$NEW_TAG" -m "$PR_TITLE"
    git push origin "$NEW_TAG"
  fi
  
  ###############################################
  # 6. GitHub Actions output
  ###############################################
  echo "tag=$NEW_TAG" >> $GITHUB_OUTPUT
  echo "description=$PR_TITLE" >> $GITHUB_OUTPUT
  
  echo "✅ Version bump completed."
elif [[ "$PR_TITLE" =~ ^\[?[Ff]ix\]? ]]; then
  echo "🔧 Detected Fix → patch version bump"
  PATCH=$((PATCH + 1))
  NEW_TAG="v$MAJOR.$MINOR.$PATCH"
  
  echo "🆕 New tag: $NEW_TAG"
  echo "📄 Tag description: $PR_TITLE"
  
  ###############################################
  # 5. 태그 생성 및 push
  ###############################################
  if git rev-parse "$NEW_TAG" >/dev/null 2>&1; then
    echo "⚠️ Tag $NEW_TAG already exists — skipping."
  else
    git tag -a "$NEW_TAG" -m "$PR_TITLE"
    git push origin "$NEW_TAG"
  fi
  
  ###############################################
  # 6. GitHub Actions output
  ###############################################
  echo "tag=$NEW_TAG" >> $GITHUB_OUTPUT
  echo "description=$PR_TITLE" >> $GITHUB_OUTPUT
  
  echo "✅ Version bump completed."
else
  echo "⚠️ PR 제목이 [Release] 또는 [Fix]가 아닙니다."
  echo "📌 PR Title: $PR_TITLE"
  echo "⏭️ 버전 증가를 건너뜁니다."
  
  # 빈 태그를 출력하여 빌드가 실행되지 않도록 함
  echo "tag=" >> $GITHUB_OUTPUT
  echo "description=$PR_TITLE" >> $GITHUB_OUTPUT
  
  echo "✅ Version bump skipped."
fi
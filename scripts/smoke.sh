#!/usr/bin/env bash

set -euo pipefail

DOMAIN="${DOMAIN:-https://<your-domain>}"
TOKEN="${TOKEN:-}"

echo "1) 잘못된 입력 → 400 확인"
curl -s -X POST "$DOMAIN/api/generate-prompt" \
  -H "Content-Type: application/json" \
  -d '{"subject":"","params":{"ar":"oops"}}' | jq .

echo "2) 유효 입력 → 200 (인증 필요시 Authorization 헤더 사용)"
AUTH=()
if [[ -n "$TOKEN" ]]; then AUTH=(-H "Authorization: Bearer $TOKEN"); fi
curl -s -X POST "$DOMAIN/api/generate-prompt" \
  -H "Content-Type: application/json" "${AUTH[@]}" \
  -d '{"subject":"a cinematic cat portrait","params":{"ar":"3:2","style":"cinematic"}}' | jq .

echo "3) 레이트리밋(429) 샘플"
for i in {1..50}; do
  curl -s -o /dev/null -w "%{http_code}\n" "$DOMAIN/api/generate-prompt" || true
done


#!/usr/bin/env bash

set -euo pipefail

APP="${1:-https://your-app.vercel.app}"

echo "==> Stripe listen"
stripe listen --forward-to "$APP/api/stripe/webhook" >/dev/null &
LISTEN_PID=$!
trap "kill $LISTEN_PID 2>/dev/null || true" EXIT

sleep 2

echo "==> Trigger checkout.session.completed"
stripe trigger checkout.session.completed

echo "==> Trigger invoice.paid (x2 for idempotency check)"
stripe trigger invoice.paid
stripe trigger invoice.paid

echo "==> Done. Inspect wallet_ledger.ext_event_id and webhook_events for event IDs."



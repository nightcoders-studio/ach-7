#!/usr/bin/env bash
set -e

BASE="http://localhost:3531"
PASS="test123456"
EMAIL_KONSUMEN="test-konsumen-$(date +%s)@test.com"

# Known IDs from database
FARMER_ID="7d0d3e32-f164-4c53-a073-9fb9f2b912a9"
PRODUK_ID="87876d5e-3d2b-4aa7-8049-999946394b88"

echo "=== TEST 1: Public Endpoints ==="

echo "--- GET /api/produk ---"
curl -s "$BASE/api/produk" | python3 -c "
import sys,json; d=json.load(sys.stdin); 
print(f'  OK: {d[\"pagination\"][\"total\"]} products, page {d[\"pagination\"][\"page\"]}/{d[\"pagination\"][\"totalPages\"]}')
"

echo "--- GET /api/produk/[id] ---"
curl -s "$BASE/api/produk/$PRODUK_ID" | python3 -c "
import sys,json; d=json.load(sys.stdin); 
print(f'  OK: \"{d[\"namaProduk\"]}\" by {d[\"farmer\"][\"nama\"]} — Rp {d[\"hargaPerKg\"]}/kg, stok {d[\"stok\"]} {d[\"satuan\"]}')
"

echo "--- GET /api/petani/[id] ---"
curl -s "$BASE/api/petani/$FARMER_ID" | python3 -c "
import sys,json; d=json.load(sys.stdin); 
print(f'  OK: {d[\"nama\"]} — {len(d[\"products\"])} produk aktif, rating {d[\"avgRating\"] or \"belum ada\"}')
"

echo "--- GET /api/produk?search=cabai ---"
curl -s "$BASE/api/produk?search=cabai" | python3 -c "
import sys,json; d=json.load(sys.stdin);
print(f'  OK: {d[\"pagination\"][\"total\"]} results for search \"cabai\"')
"

echo "--- GET /api/produk?kategori=SAYUR ---"
curl -s "$BASE/api/produk?kategori=SAYUR" | python3 -c "
import sys,json; d=json.load(sys.stdin);
print(f'  OK: {d[\"pagination\"][\"total\"]} results for kategori SAYUR')
"

echo "--- GET /api/produk not found ---"
curl -s -o /dev/null -w '  Status: %{http_code}\n' "$BASE/api/produk/00000000-0000-0000-0000-000000000000"

echo "--- GET /api/petani not found ---"
curl -s -o /dev/null -w '  Status: %{http_code}\n' "$BASE/api/petani/00000000-0000-0000-0000-000000000000"

echo ""
echo "=== TEST 2: Auth Guards (tanpa token) ==="
for endpoint in "pesanan" "pesanan/123/route" "review"; do
  for method in "GET" "POST"; do
    status=$(curl -s -o /dev/null -w '%{http_code}' "$BASE/api/$endpoint" -X $method 2>/dev/null || echo "err")
    echo "  $method /api/$endpoint → $status"
  done
done

echo ""
echo "=== TEST 3: Protected Endpoints (dengan login) ==="

SUPABASE_URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env | cut -d= -f2 | tr -d ' ')
SUPABASE_ANON_KEY=$(grep NEXT_PUBLIC_SUPABASE_ANON_KEY .env | cut -d= -f2 | tr -d ' ')

echo "Registering konsumen: $EMAIL_KONSUMEN..."
SIGNUP_RESP=$(curl -s "$SUPABASE_URL/auth/v1/signup" \
  -H "apikey: $SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$EMAIL_KONSUMEN\",\"password\":\"$PASS\"}")

ACCESS_TOKEN=$(echo "$SIGNUP_RESP" | python3 -c "
import sys,json
try:
  d=json.load(sys.stdin)
  print(d.get('access_token','') or '')
except: print('')
" 2>/dev/null || echo "")

USER_ID=$(echo "$SIGNUP_RESP" | python3 -c "
import sys,json
try:
  d=json.load(sys.stdin)
  print(d.get('user',{}).get('id','') or '')
except: print('')
" 2>/dev/null || echo "")

if [ -z "$ACCESS_TOKEN" ]; then
  echo "  Signup failed (mungkin email confirmation required). Mencoba login..."
  LOGIN_RESP=$(curl -s "$SUPABASE_URL/auth/v1/token?grant_type=password" \
    -H "apikey: $SUPABASE_ANON_KEY" \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$EMAIL_KONSUMEN\",\"password\":\"$PASS\"}")
  ACCESS_TOKEN=$(echo "$LOGIN_RESP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('access_token',''))" 2>/dev/null || echo "")
  USER_ID=$(echo "$LOGIN_RESP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('user',{}).get('id',''))" 2>/dev/null || echo "")
fi

if [ -z "$ACCESS_TOKEN" ]; then
  echo "  ERROR: Gagal login. Response: $SIGNUP_RESP"
  exit 1
fi

echo "  ✅ Login berhasil — User ID: ${USER_ID:0:8}..."
echo ""

echo "--- POST /api/auth/create-profile (konsumen) ---"
PROFILE_RESP=$(curl -s "$BASE/api/auth/create-profile" \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d "{\"userId\":\"$USER_ID\",\"email\":\"$EMAIL_KONSUMEN\",\"nama\":\"Test Konsumen E2E\",\"noHp\":\"081234567890\",\"role\":\"KONSUMEN\"}")
echo "  Response: $PROFILE_RESP"
echo ""

echo "--- POST /api/pesanan (checkout) ---"
ORDER_RESP=$(curl -s "$BASE/api/pesanan" \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d "{
    \"farmerId\": \"$FARMER_ID\",
    \"items\": [{\"productId\": \"$PRODUK_ID\", \"qty\": 2}],
    \"alamatPengiriman\": \"Jl. Tgk. Chik Ditiro No. 10, Banda Aceh\",
    \"ongkir\": 15000,
    \"catatan\": \"Pesanan test E2E\",
    \"metodeBayar\": \"TRANSFER\"
  }")
echo "  Response: $ORDER_RESP"
ORDER_ID=$(echo "$ORDER_RESP" | python3 -c "
import sys,json
try:
  d=json.load(sys.stdin); print(d.get('id',''))
except: print('')
" 2>/dev/null || echo "")
echo "  Order ID: $ORDER_ID"
echo ""

if [ -n "$ORDER_ID" ]; then
  echo "--- GET /api/pesanan (list) ---"
  curl -s "$BASE/api/pesanan" \
    -H "Authorization: Bearer $ACCESS_TOKEN" | python3 -c "
import sys,json; d=json.load(sys.stdin)
print(f'  ✅ {len(d)} order(s) ditemukan')
for o in d:
  print(f'     - {o[\"id\"][:8]}... | {o[\"status\"]} | Rp {o[\"grandTotal\"]} | {o[\"farmer\"][\"nama\"]}')
"
  echo ""

  echo "--- GET /api/pesanan/[id] (detail) ---"
  curl -s "$BASE/api/pesanan/$ORDER_ID" \
    -H "Authorization: Bearer $ACCESS_TOKEN" | python3 -c "
import sys,json; d=json.load(sys.stdin)
items = ', '.join([f\"{i['productName']} x{i['qty']}\" for i in d['items']])
print(f'  ✅ Order: {d[\"status\"]} | Grand Total: Rp {d[\"grandTotal\"]}')
print(f'     Items: {items}')
print(f'     Alamat: {d[\"alamatPengiriman\"]}')
print(f'     Pembayaran: {d[\"transaction\"][\"metodeBayar\"]} ({d[\"transaction\"][\"statusPayment\"]})')
print(f'     Review: {\"✅ sudah\" if d.get(\"review\") else \"❌ belum\"}')
"
  echo ""

  echo "--- PATCH /api/pesanan/[id] (terima — harus gagal, status masih MENUNGGU) ---"
  curl -s "$BASE/api/pesanan/$ORDER_ID" \
    -X PATCH \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -d '{"action":"terima"}' | python3 -c "
import sys,json; d=json.load(sys.stdin)
print(f'  ✅ Expected error: \"{d.get(\"error\",\"?\")}\"')
"
  echo ""

  echo "--- PATCH /api/pesanan/[id] (batalkan) ---"
  curl -s "$BASE/api/pesanan/$ORDER_ID" \
    -X PATCH \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $ACCESS_TOKEN" \
    -d '{"action":"batalkan"}' | python3 -c "
import sys,json; d=json.load(sys.stdin)
print(f'  ✅ {d}')
"
fi

echo ""
echo "=== TEST 4: POST /api/review (tanpa order selesai — harus gagal) ==="
curl -s "$BASE/api/review" \
  -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d "{\"orderId\":\"$ORDER_ID\",\"rating\":5,\"komentar\":\"Mantap!\"}" | python3 -c "
import sys,json; d=json.load(sys.stdin)
print(f'  ✅ Expected error: \"{d.get(\"error\",\"?\")}\"')
"

echo ""
echo "============================================"
echo "✅ SEMUA TEST SELESAI"
echo "============================================"

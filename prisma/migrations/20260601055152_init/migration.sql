-- CreateEnum
CREATE TYPE "Role" AS ENUM ('KONSUMEN', 'PETANI', 'ADMIN');

-- CreateEnum
CREATE TYPE "VerifikasiStatus" AS ENUM ('MENUNGGU', 'TERVERIFIKASI', 'DITOLAK');

-- CreateEnum
CREATE TYPE "KategoriProduk" AS ENUM ('SAYUR', 'BUAH', 'BERAS', 'CABAI', 'BAWANG', 'LAINNYA');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('MENUNGGU', 'DIPROSES', 'DIKIRIM', 'SELESAI', 'DIBATALKAN');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUND');

-- CreateEnum
CREATE TYPE "MetodeBayar" AS ENUM ('TRANSFER', 'QRIS');

-- CreateEnum
CREATE TYPE "WithdrawStatus" AS ENUM ('MENUNGGU', 'DIPROSES', 'SELESAI', 'DITOLAK');

-- CreateEnum
CREATE TYPE "DisputeStatus" AS ENUM ('DIBUKA', 'DIPROSES', 'SELESAI');

-- CreateEnum
CREATE TYPE "Putusan" AS ENUM ('REFUND_PENUH', 'CAIR_PETANI', 'REFUND_SEBAGIAN');

-- CreateTable
CREATE TABLE "profiles" (
    "id" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'KONSUMEN',
    "nama" TEXT NOT NULL,
    "email" TEXT,
    "no_hp" TEXT,
    "foto" TEXT,
    "alamat" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "farmer_profiles" (
    "id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "foto_ktp" TEXT NOT NULL,
    "alamat_lahan" TEXT NOT NULL,
    "status_verifikasi" "VerifikasiStatus" NOT NULL DEFAULT 'MENUNGGU',
    "rekening_bank" TEXT NOT NULL,
    "no_rekening" TEXT NOT NULL,
    "nama_pemilik_rekening" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "farmer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "farmer_id" TEXT NOT NULL,
    "nama_produk" TEXT NOT NULL,
    "kategori" "KategoriProduk" NOT NULL,
    "harga_per_kg" DECIMAL(12,2) NOT NULL,
    "stok" INTEGER NOT NULL,
    "satuan" TEXT NOT NULL DEFAULT 'kg',
    "foto" TEXT,
    "deskripsi" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "konsumen_id" TEXT NOT NULL,
    "farmer_id" TEXT NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'MENUNGGU',
    "total_harga" DECIMAL(12,2) NOT NULL,
    "ongkir" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "grand_total" DECIMAL(12,2) NOT NULL,
    "catatan" TEXT,
    "alamat_pengiriman" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "product_id" TEXT NOT NULL,
    "product_name" TEXT NOT NULL,
    "qty" INTEGER NOT NULL,
    "harga_satuan" DECIMAL(12,2) NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "metode_bayar" "MetodeBayar" NOT NULL,
    "status_payment" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "snap_token" TEXT,
    "payment_gateway_ref" TEXT,
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "wallets" (
    "id" TEXT NOT NULL,
    "farmer_id" TEXT NOT NULL,
    "saldo" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "wallets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "withdraw_requests" (
    "id" TEXT NOT NULL,
    "farmer_id" TEXT NOT NULL,
    "nominal" DECIMAL(12,2) NOT NULL,
    "status" "WithdrawStatus" NOT NULL DEFAULT 'MENUNGGU',
    "rekening_bank" TEXT NOT NULL,
    "no_rekening" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "withdraw_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "konsumen_id" TEXT NOT NULL,
    "farmer_id" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "komentar" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "disputes" (
    "id" TEXT NOT NULL,
    "order_id" TEXT NOT NULL,
    "alasan" TEXT NOT NULL,
    "status" "DisputeStatus" NOT NULL DEFAULT 'DIBUKA',
    "putusan" "Putusan",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "disputes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profiles_email_key" ON "profiles"("email");

-- CreateIndex
CREATE UNIQUE INDEX "farmer_profiles_profile_id_key" ON "farmer_profiles"("profile_id");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_order_id_key" ON "transactions"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "wallets_farmer_id_key" ON "wallets"("farmer_id");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_order_id_key" ON "reviews"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "disputes_order_id_key" ON "disputes"("order_id");

-- AddForeignKey
ALTER TABLE "farmer_profiles" ADD CONSTRAINT "farmer_profiles_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_konsumen_id_fkey" FOREIGN KEY ("konsumen_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "withdraw_requests" ADD CONSTRAINT "withdraw_requests_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_konsumen_id_fkey" FOREIGN KEY ("konsumen_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_farmer_id_fkey" FOREIGN KEY ("farmer_id") REFERENCES "profiles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "disputes" ADD CONSTRAINT "disputes_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

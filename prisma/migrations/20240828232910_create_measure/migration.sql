-- CreateTable
CREATE TABLE "measures" (
    "id" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,
    "type" TEXT NOT NULL,
    "has_confirmed" BOOLEAN NOT NULL,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "measures_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "measures_image_key" ON "measures"("image");

-- AddForeignKey
ALTER TABLE "measures" ADD CONSTRAINT "measures_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

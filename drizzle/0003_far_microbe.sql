DROP INDEX "reviews_date_idx";--> statement-breakpoint
DROP INDEX "reviews_display_date_idx";--> statement-breakpoint
CREATE INDEX "reviews_display_date_idx" ON "reviews" USING btree ("display_review","created_at" DESC NULLS LAST);--> statement-breakpoint
ALTER TABLE "reviews" DROP COLUMN "date";
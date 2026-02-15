CREATE INDEX "cakes_category_idx" ON "cakes" USING btree ("category");--> statement-breakpoint
CREATE INDEX "cakes_name_idx" ON "cakes" USING btree ("name");--> statement-breakpoint
CREATE INDEX "cakes_created_at_idx" ON "cakes" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "orders_cake_id_idx" ON "orders" USING btree ("cake_id");--> statement-breakpoint
CREATE INDEX "orders_status_idx" ON "orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "orders_created_at_idx" ON "orders" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "orders_status_created_idx" ON "orders" USING btree ("status","created_at");--> statement-breakpoint
CREATE INDEX "reviews_rating_idx" ON "reviews" USING btree ("rating");--> statement-breakpoint
CREATE INDEX "reviews_date_idx" ON "reviews" USING btree ("date");--> statement-breakpoint
CREATE INDEX "reviews_display_review_idx" ON "reviews" USING btree ("display_review");--> statement-breakpoint
CREATE INDEX "reviews_display_date_idx" ON "reviews" USING btree ("display_review","date" DESC NULLS LAST);
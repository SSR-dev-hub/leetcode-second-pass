ALTER TABLE `problems` ADD `fsrs_stability` real;
--> statement-breakpoint
ALTER TABLE `problems` ADD `fsrs_difficulty` real;
--> statement-breakpoint
ALTER TABLE `problems` ADD `fsrs_state` integer;
--> statement-breakpoint
ALTER TABLE `problems` ADD `fsrs_lapses` integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE `problems` ADD `fsrs_learning_steps` integer DEFAULT 0 NOT NULL;

CREATE TABLE `accepted_submissions` (
  `id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  `problem_id` integer NOT NULL,
  `submission_number` text NOT NULL,
  `submitted_at` integer NOT NULL,
  `url` text NOT NULL,
  `is_best` integer DEFAULT false NOT NULL,
  `created_at` integer NOT NULL,
  FOREIGN KEY (`problem_id`) REFERENCES `problems`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `accepted_submissions_problem_number_unique` ON `accepted_submissions` (`problem_id`,`submission_number`);

CREATE TABLE "portfolio_projects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"features" text[] DEFAULT '{}' NOT NULL,
	"location" text NOT NULL,
	"image_url" text,
	"images" text[] DEFAULT '{}',
	"video_url" text,
	"videos" text[] DEFAULT '{}',
	"is_published" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"category" text NOT NULL,
	"description" text NOT NULL,
	"technical_specifications" text[] DEFAULT '{}' NOT NULL,
	"image_url" text,
	"images" text[] DEFAULT '{}',
	"is_published" boolean DEFAULT true,
	"is_featured" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"dimensions" jsonb DEFAULT '{}'::jsonb,
	"body_color" text,
	"beam_angle" text,
	"power_consumption" text,
	"ip_rating" text,
	"color_temperature" text,
	"lumens_output" text,
	"material" text,
	"mounting_type" text,
	"control_type" text,
	"warranty_period" text,
	"certifications" text[] DEFAULT '{}'
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);

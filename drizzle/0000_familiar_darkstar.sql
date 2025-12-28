CREATE TYPE "public"."announcement_category" AS ENUM('general', 'event', 'schedule', 'ministry', 'outreach', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."announcement_priority" AS ENUM('high', 'normal', 'low');--> statement-breakpoint
CREATE TYPE "public"."announcement_status" AS ENUM('draft', 'published', 'expired', 'archived');--> statement-breakpoint
CREATE TYPE "public"."event_category" AS ENUM('worship', 'fellowship', 'youth', 'education', 'outreach', 'ministry', 'special', 'community');--> statement-breakpoint
CREATE TYPE "public"."event_registration_status" AS ENUM('registered', 'waitlist', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('draft', 'published', 'cancelled', 'completed');--> statement-breakpoint
CREATE TYPE "public"."ministry_level" AS ENUM('senior_leadership', 'board_member', 'ministry_leader', 'ministry_member', 'volunteer');--> statement-breakpoint
CREATE TYPE "public"."ministry_role" AS ENUM('pastor', 'associate_pastor', 'elder', 'deacon', 'deaconess', 'worship_leader', 'youth_pastor', 'children_minister', 'music_director', 'choir_director', 'usher_coordinator', 'womens_ministry_leader', 'mens_ministry_leader', 'sunday_school_superintendent', 'secretary', 'treasurer', 'trustee', 'evangelist', 'missionary', 'small_group_leader', 'media_coordinator', 'outreach_coordinator');--> statement-breakpoint
CREATE TYPE "public"."prayer_request_category" AS ENUM('health', 'family', 'work', 'spiritual', 'financial', 'relationships', 'ministry', 'community', 'salvation', 'thanksgiving', 'other');--> statement-breakpoint
CREATE TYPE "public"."prayer_request_priority" AS ENUM('urgent', 'high', 'normal', 'low');--> statement-breakpoint
CREATE TYPE "public"."prayer_request_status" AS ENUM('pending', 'approved', 'active', 'answered', 'expired', 'archived');--> statement-breakpoint
CREATE TYPE "public"."recurring_pattern" AS ENUM('daily', 'weekly', 'biweekly', 'monthly', 'yearly');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'member', 'visitor');--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" varchar(255) NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" varchar(255),
	"scope" varchar(255),
	"id_token" text,
	"session_state" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"category" "announcement_category" NOT NULL,
	"priority" "announcement_priority" DEFAULT 'normal' NOT NULL,
	"author" varchar(255) NOT NULL,
	"author_id" uuid NOT NULL,
	"status" "announcement_status" DEFAULT 'draft' NOT NULL,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_registrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"user_name" varchar(255) NOT NULL,
	"user_email" varchar(255) NOT NULL,
	"registration_date" timestamp DEFAULT now() NOT NULL,
	"notes" text,
	"status" "event_registration_status" DEFAULT 'registered' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"category" "event_category" NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"location" varchar(255) NOT NULL,
	"address" text,
	"organizer" varchar(255) NOT NULL,
	"organizer_id" uuid NOT NULL,
	"capacity" integer DEFAULT 0,
	"registered_count" integer DEFAULT 0 NOT NULL,
	"requires_registration" boolean DEFAULT false NOT NULL,
	"is_recurring" boolean DEFAULT false NOT NULL,
	"recurring_pattern" "recurring_pattern",
	"recurring_days" jsonb DEFAULT '[]'::jsonb,
	"recurring_end_date" timestamp,
	"status" "event_status" DEFAULT 'draft' NOT NULL,
	"image_url" text,
	"contact_email" varchar(255),
	"contact_phone" varchar(20),
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"price" numeric(10, 2) DEFAULT '0.00',
	"registration_deadline" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prayer_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"category" "prayer_request_category" NOT NULL,
	"priority" "prayer_request_priority" DEFAULT 'normal' NOT NULL,
	"requested_by" varchar(255) NOT NULL,
	"requested_by_id" uuid NOT NULL,
	"requested_by_email" varchar(255),
	"is_anonymous" boolean DEFAULT false NOT NULL,
	"status" "prayer_request_status" DEFAULT 'pending' NOT NULL,
	"is_public" boolean DEFAULT true NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"prayer_count" integer DEFAULT 0 NOT NULL,
	"follow_up_notes" text,
	"admin_notes" text,
	"answered_date" timestamp,
	"answered_description" text,
	"expires_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "prayer_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"prayer_request_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"user_name" varchar(255) NOT NULL,
	"response" text,
	"is_prayed" boolean DEFAULT true NOT NULL,
	"prayed_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_token" varchar(255) NOT NULL,
	"user_id" uuid NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "sessions_session_token_unique" UNIQUE("session_token")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"email_verified" timestamp,
	"image" text,
	"role" "user_role" DEFAULT 'member' NOT NULL,
	"ministry_role" "ministry_role",
	"ministry_level" "ministry_level",
	"ministry_start_date" timestamp,
	"ministry_description" text,
	"hashed_password" text,
	"phone" varchar(20),
	"address" text,
	"membership_date" timestamp,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification_tokens" (
	"identifier" varchar(255) NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_registrations" ADD CONSTRAINT "event_registrations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_organizer_id_users_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prayer_requests" ADD CONSTRAINT "prayer_requests_requested_by_id_users_id_fk" FOREIGN KEY ("requested_by_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prayer_responses" ADD CONSTRAINT "prayer_responses_prayer_request_id_prayer_requests_id_fk" FOREIGN KEY ("prayer_request_id") REFERENCES "public"."prayer_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "prayer_responses" ADD CONSTRAINT "prayer_responses_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
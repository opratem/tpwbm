import { redirect } from "next/navigation";

export default function MembersPage() {
  // Redirect to the dashboard
  redirect("/members/dashboard");
}

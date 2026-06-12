import { redirect } from "next/navigation";

export default function ManageStudentsPage() {
  redirect("/admin/dashboard/all-students");
}

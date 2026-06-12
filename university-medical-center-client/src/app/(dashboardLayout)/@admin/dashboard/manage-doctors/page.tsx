import { redirect } from "next/navigation";

export default function ManageDoctorsPage() {
  redirect("/admin/dashboard/all-doctors");
}

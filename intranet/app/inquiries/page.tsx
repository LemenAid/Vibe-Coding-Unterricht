import { getResolvedInquiriesForStaff, getUserInquiries } from "@/lib/actions";
import { getCurrentUser } from "@/lib/auth";
import { InquiryList } from "./inquiry-list";

export default async function InquiriesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const isStaff = user.role !== 'student';
  
  // Fetch data on server
  const inquiries = isStaff 
    ? await getResolvedInquiriesForStaff() 
    : await getUserInquiries();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          History
        </h1>
        <p className="text-gray-500">
          {isStaff 
            ? 'Historie aller beantworteten Anfragen.' 
            : 'Historie deiner gesamten Kommunikation.'}
        </p>
      </div>

      <InquiryList initialInquiries={inquiries} isStaff={isStaff} />
    </div>
  );
}

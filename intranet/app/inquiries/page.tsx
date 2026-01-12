import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getUserInquiries, getResolvedInquiriesForStaff } from "@/lib/actions";
import { getCurrentUser } from "@/lib/auth";

export default async function InquiriesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const isStaff = user.role !== 'student';
  
  const inquiries = isStaff 
    ? await getResolvedInquiriesForStaff() 
    : await getUserInquiries();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isStaff ? 'Beantwortete Anfragen' : 'Meine Anfragen'}
        </h1>
        <p className="text-gray-500">
          {isStaff 
            ? 'Historie der beantworteten Fragen.' 
            : 'Historie deiner Fragen an Lehrer und Administration.'}
        </p>
      </div>

      <div className="grid gap-4">
        {inquiries.map((inquiry) => (
          <Card key={inquiry.id}>
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <CardTitle className="text-lg">{inquiry.subject}</CardTitle>
                        <CardDescription>
                            {isStaff ? (
                                <>Von: {(inquiry as any).user?.name || 'Unbekannt'} • {formatDate(inquiry.createdAt)}</>
                            ) : (
                                <>An: {inquiry.category === 'TEACHER' ? 'Lehrer' : 'Admin'} • {formatDate(inquiry.createdAt)}</>
                            )}
                        </CardDescription>
                    </div>
                    <Badge variant={inquiry.status === 'OPEN' ? 'secondary' : 'default'} className={inquiry.status === 'ANSWERED' ? 'bg-green-600 hover:bg-green-700' : ''}>
                        {inquiry.status === 'OPEN' ? 'Offen' : 'Beantwortet'}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-md text-sm text-gray-700">
                    <span className="font-semibold block mb-1">
                        {isStaff ? 'Frage:' : 'Deine Nachricht:'}
                    </span>
                    {inquiry.message}
                </div>
                
                {inquiry.answer && (
                    <div className="bg-blue-50 border border-blue-100 p-3 rounded-md text-sm text-blue-900">
                        <span className="font-semibold block mb-1 text-blue-700">Antwort:</span>
                        {inquiry.answer}
                    </div>
                )}
            </CardContent>
          </Card>
        ))}
        {inquiries.length === 0 && (
            <div className="text-center py-12 text-gray-500">
                {isStaff ? 'Keine beantworteten Anfragen gefunden.' : 'Du hast noch keine Anfragen gestellt.'}
            </div>
        )}
      </div>
    </div>
  );
}

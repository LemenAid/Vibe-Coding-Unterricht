"use client";

import { useState } from "react";
import { format } from "date-fns";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type Inquiry = {
    id: string;
    subject: string;
    message: string;
    answer: string | null;
    status: string;
    createdAt: Date;
    category: string;
    user?: { name: string };
    recipient?: { name: string } | null;
};

type InquiryListProps = {
    initialInquiries: Inquiry[]; 
    isStaff: boolean;
};

export function InquiryList({ initialInquiries, isStaff }: InquiryListProps) {
    const [filterText, setFilterText] = useState("");
    const [filterCategory, setFilterCategory] = useState("ALL");
    const [dateOrder, setDateOrder] = useState("desc");

    // Convert dates from string (serialized) back to object if needed, though they might come as Date objects if we use server component passing props.
    // However, Client Components receiving props from Server Components get serialized JSON. Dates become strings.
    const inquiries = initialInquiries.map((i) => ({
        ...i,
        createdAt: new Date(i.createdAt)
    }));

    const filteredInquiries = inquiries.filter((inquiry) => {
        const matchesText = 
            inquiry.subject.toLowerCase().includes(filterText.toLowerCase()) ||
            inquiry.message.toLowerCase().includes(filterText.toLowerCase()) ||
            (inquiry.answer && inquiry.answer.toLowerCase().includes(filterText.toLowerCase())) ||
            (inquiry.user?.name && inquiry.user.name.toLowerCase().includes(filterText.toLowerCase()));

        const matchesCategory = filterCategory === "ALL" || inquiry.category === filterCategory;

        return matchesText && matchesCategory;
    }).sort((a, b) => {
        if (dateOrder === 'desc') {
            return b.createdAt.getTime() - a.createdAt.getTime();
        } else {
            return a.createdAt.getTime() - b.createdAt.getTime();
        }
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-lg border shadow-sm">
                <div className="flex-1 space-y-2">
                    <Label htmlFor="search">Suche</Label>
                    <Input 
                        id="search"
                        placeholder="Suchen nach Betreff, Inhalt oder Person..." 
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-48 space-y-2">
                    <Label>Kategorie / Empfänger</Label>
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger>
                            <SelectValue placeholder="Alle" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Alle anzeigen</SelectItem>
                            <SelectItem value="ADMIN">Administration</SelectItem>
                            <SelectItem value="TEACHER">Lehrer</SelectItem>
                            <SelectItem value="STUDENT">Schüler</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-full md:w-48 space-y-2">
                    <Label>Datum</Label>
                    <Select value={dateOrder} onValueChange={setDateOrder}>
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="desc">Neueste zuerst</SelectItem>
                            <SelectItem value="asc">Älteste zuerst</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-4">
                {filteredInquiries.map((inquiry) => (
                <Card key={inquiry.id}>
                    <CardHeader>
                        <div className="flex justify-between items-start">
                            <div className="space-y-1">
                                <CardTitle className="text-lg">{inquiry.subject}</CardTitle>
                                <CardDescription>
                                    {isStaff ? (
                                        <>Von: {inquiry.user?.name || 'Unbekannt'} • {format(inquiry.createdAt, 'dd.MM.yyyy HH:mm')}</>
                                    ) : (
                                        <>An: {inquiry.recipient ? inquiry.recipient.name : (inquiry.category === 'TEACHER' ? 'Lehrer (Allgemein)' : 'Admin (Allgemein)')} • {format(inquiry.createdAt, 'dd.MM.yyyy HH:mm')}</>
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
                {filteredInquiries.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        Keine Einträge gefunden.
                    </div>
                )}
            </div>
        </div>
    );
}

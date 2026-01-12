import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { PlusCircle, Search, Tag } from "lucide-react";
import { getBulletinPosts, createBulletinPost } from "@/lib/actions";

export default async function BulletinPage() {
  const posts = await getBulletinPosts();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schwarzes Brett</h1>
          <p className="text-gray-500">Suche und Biete – von Studenten für Studenten.</p>
        </div>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Anzeige aufgeben
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neue Anzeige erstellen</DialogTitle>
              <DialogDescription>
                Erstelle eine Suche oder ein Angebot für das schwarze Brett.
              </DialogDescription>
            </DialogHeader>
            <form action={createBulletinPost} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="title">Titel</Label>
                    <Input id="title" name="title" placeholder="z.B. Suche Nachhilfe in Mathe" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="description">Beschreibung</Label>
                    <Input id="description" name="description" placeholder="Details zu deinem Anliegen..." required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="contactInfo">Kontakt</Label>
                    <Input id="contactInfo" name="contactInfo" placeholder="Email oder Telefonnummer" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="type">Typ</Label>
                    <select 
                        name="type" 
                        id="type" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <option value="SEARCH">Suche</option>
                        <option value="OFFER">Biete</option>
                    </select>
                </div>
                <DialogFooter>
                    <Button type="submit">Veröffentlichen</Button>
                </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id} className="flex flex-col">
            <CardHeader>
              <div className="flex justify-between items-start">
                <Badge variant={post.type === 'OFFER' ? "default" : "secondary"}>
                    {post.type === 'OFFER' ? 'Biete' : 'Suche'}
                </Badge>
                <span className="text-xs text-gray-400">
                    {post.createdAt.toLocaleDateString()}
                </span>
              </div>
              <CardTitle className="mt-2 text-lg">{post.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-gray-600">
                {post.description}
              </p>
            </CardContent>
            <CardFooter className="bg-gray-50 p-4 rounded-b-lg">
                <div className="text-xs font-medium text-gray-500 flex items-center gap-2">
                    <Tag size={12} />
                    Kontakt: {post.contactInfo}
                </div>
            </CardFooter>
          </Card>
        ))}
        {posts.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
                Noch keine Anzeigen vorhanden. Sei der Erste!
            </div>
        )}
      </div>
    </div>
  );
}

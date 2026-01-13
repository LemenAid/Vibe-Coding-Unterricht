"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTeacherSelection } from "./teacher-context";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function TagSelector({ allTags }: { allTags: any[] }) {
    const [open, setOpen] = useState(false);
    const { selectedTags, addTag, removeTag } = useTeacherSelection();
    
    // Convert allTags to a simpler format if needed, or use directly
    const availableTags = allTags.filter(
        (tag) => !selectedTags.some((selected) => selected.id === tag.id)
    );

    return (
        <div className="space-y-3">
             <div className="flex flex-wrap gap-2">
                {selectedTags.map((tag) => (
                    <Badge key={tag.id} variant="secondary" className="gap-1 pr-1">
                        {tag.name}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 hover:bg-transparent text-muted-foreground hover:text-foreground"
                            onClick={() => removeTag(tag.id)}
                            type="button"
                        >
                            <X className="h-3 w-3" />
                        </Button>
                        <input type="hidden" name="tags" value={tag.id} />
                    </Badge>
                ))}
            </div>

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full justify-between"
                        type="button"
                    >
                        Tags hinzufügen...
                        <Plus className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                    <Command>
                        <CommandInput placeholder="Tag suchen..." />
                        <CommandList>
                            <CommandEmpty>Kein Tag gefunden.</CommandEmpty>
                            <CommandGroup>
                                {availableTags.map((tag) => (
                                    <CommandItem
                                        key={tag.id}
                                        value={tag.name}
                                        onSelect={() => {
                                            addTag(tag);
                                            setOpen(false);
                                        }}
                                    >
                                        <Plus className="mr-2 h-4 w-4" />
                                        {tag.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    );
}

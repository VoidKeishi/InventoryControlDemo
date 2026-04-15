"use client";

import { useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { Item } from "@/types";

interface ItemSelectProps {
  items: Item[];
  value: string | null;
  onSelect: (itemId: string) => void;
  excludeIds?: string[];
  placeholder?: string;
}

export function ItemSelect({
  items,
  value,
  onSelect,
  excludeIds = [],
  placeholder = "Chọn vật liệu...",
}: ItemSelectProps) {
  const [open, setOpen] = useState(false);

  const availableItems = items.filter((i) => !excludeIds.includes(i.id));
  const selectedItem = items.find((i) => i.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="outline" className="w-full justify-between font-normal" />
        }
      >
        {selectedItem ? (
          <span className="truncate">
            {selectedItem.id} — {selectedItem.name}
          </span>
        ) : (
          <span className="text-muted-foreground">{placeholder}</span>
        )}
        <ChevronsUpDown size={14} className="ml-2 shrink-0 text-muted-foreground" />
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Tìm mã hoặc tên..." />
          <CommandList>
            <CommandEmpty>Không tìm thấy vật liệu</CommandEmpty>
            <CommandGroup>
              {availableItems.map((item) => (
                <CommandItem
                  key={item.id}
                  value={`${item.id} ${item.name}`}
                  onSelect={() => {
                    onSelect(item.id);
                    setOpen(false);
                  }}
                  data-checked={value === item.id ? "true" : undefined}
                >
                  <span className="font-medium">{item.id}</span>
                  <span className="truncate text-muted-foreground">
                    {item.name}
                  </span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {item.unit}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

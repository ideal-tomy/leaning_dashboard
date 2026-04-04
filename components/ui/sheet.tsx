"use client";

import * as React from "react";
import { Drawer } from "vaul";
import { cn } from "@/lib/utils";

function Sheet({
  children,
  open,
  onOpenChange,
}: {
  children: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange} repositionInputs={false}>
      {children}
    </Drawer.Root>
  );
}

const SheetTrigger = Drawer.Trigger;
const SheetPortal = Drawer.Portal;
const SheetClose = Drawer.Close;

const SheetOverlay = React.forwardRef<
  React.ElementRef<typeof Drawer.Overlay>,
  React.ComponentPropsWithoutRef<typeof Drawer.Overlay>
>(({ className, ...props }, ref) => (
  <Drawer.Overlay
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/40", className)}
    {...props}
  />
));
SheetOverlay.displayName = "SheetOverlay";

const SheetContent = React.forwardRef<
  React.ElementRef<typeof Drawer.Content>,
  React.ComponentPropsWithoutRef<typeof Drawer.Content> & {
    title?: string;
  }
>(({ className, children, title = "パネル", ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <Drawer.Content
      ref={ref}
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 mt-24 flex max-h-[85vh] flex-col rounded-t-2xl border border-border bg-background pb-safe",
        className
      )}
      {...props}
    >
      <div className="mx-auto mt-3 h-1.5 w-12 shrink-0 rounded-full bg-slate-300" />
      <Drawer.Title className="sr-only">{title}</Drawer.Title>
      <div className="overflow-y-auto px-4 pb-6 pt-2">{children}</div>
    </Drawer.Content>
  </SheetPortal>
));
SheetContent.displayName = "SheetContent";

export { Sheet, SheetTrigger, SheetPortal, SheetClose, SheetContent, SheetOverlay };

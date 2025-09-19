import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getToolDisplayName(toolName: string, args?: any): string {
  if (toolName === "str_replace_editor") {
    if (args?.command) {
      switch (args.command) {
        case "create":
          return "Creating file...";
        case "str_replace":
          return "Updating code...";
        case "insert":
          return "Adding content...";
        case "view":
          return "Reading file...";
        case "undo_edit":
          return "Reverting changes...";
        default:
          return "Editing file...";
      }
    }
    return "Editing file...";
  }
  
  if (toolName === "file_manager") {
    return "Managing files...";
  }
  
  // Return the original tool name if no mapping exists
  return toolName;
}

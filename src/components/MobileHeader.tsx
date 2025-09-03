import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface MobileHeaderProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  onSignOut?: () => void;
  onProfile?: () => void;
}

const MobileHeader = ({ title, showBack, onBack, onSignOut, onProfile }: MobileHeaderProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-b border-border safe-area-top">
      <div className="flex items-center justify-between h-14 px-4">
        <div className="flex items-center">
          {showBack ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="p-2 -ml-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : (
            <div className="w-9" /> // Spacer
          )}
        </div>
        
        <h1 className="text-lg font-semibold truncate max-w-[200px]">
          {title}
        </h1>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="p-2 -mr-2">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            {onProfile && (
              <DropdownMenuItem onClick={onProfile}>
                Profile
              </DropdownMenuItem>
            )}
            {onSignOut && (
              <DropdownMenuItem onClick={onSignOut}>
                Sign Out
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default MobileHeader;
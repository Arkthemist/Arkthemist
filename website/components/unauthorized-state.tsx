import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock } from "lucide-react";
import Link from "next/link";
import { ConnectWallet } from "./connect-wallet";

export function UnauthorizedState() {
  return (
    <Card className="flex flex-col items-center justify-center p-8 text-center h-[400px] max-w-md mx-auto">
      <Lock className="h-12 w-12 text-muted-foreground mb-4" />
      <h2 className="text-2xl font-semibold mb-3">Access Required</h2>
      <p className="text-muted-foreground mb-6">
        Please sign in or create an account to view and manage your cases.
      </p>
      <div className="flex gap-4">
        <ConnectWallet />
      </div>
    </Card>
  );
} 
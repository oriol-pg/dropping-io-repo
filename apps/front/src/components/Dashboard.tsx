import { Badge } from '@workspace/ui/components/badge';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card';

interface DashboardProps {
  user: {
    email: string;
    name?: string;
  };
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome!</CardTitle>
        <CardDescription>
          You're successfully logged in
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">Logged in as:</p>
          <Badge variant="secondary" className="text-sm">
            {user.email}
          </Badge>
        </div>

        <div className="pt-4">
          <Button
            onClick={onLogout}
            variant="outline"
            className="w-full"
          >
            Sign Out
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

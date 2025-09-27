import { ChatTerminal } from "@/components/ChatTerminal";
import { LoginForm } from "@/components/LoginForm";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const { user, isAuthenticated, login, logout, isLoading, error } = useAuth();

  if (isAuthenticated && user) {
    return <ChatTerminal username={user.username} onLogout={logout} />;
  }

  return (
    <LoginForm 
      onLogin={login}
      isLoading={isLoading}
      error={error}
    />
  );
};

export default Index;

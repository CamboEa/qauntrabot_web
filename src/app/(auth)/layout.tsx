import { AuthProvider } from "@/contexts/AuthContext";
import ToastProvider from "@/components/providers/ToastProvider";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <ToastProvider />
    </AuthProvider>
  );
}

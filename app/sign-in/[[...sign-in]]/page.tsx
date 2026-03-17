import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <div className="text-2xl font-bold tracking-tight text-gray-900 mb-1">Ivedian</div>
        <p className="text-sm text-gray-500">Sign in to your account</p>
      </div>
      <SignIn />
    </div>
  );
}

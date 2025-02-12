import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center mb-8">
          <Image
            src="/delivery.png"
            alt="Delivery Logo"
            width={150}
            height={40}
            className="h-10 w-auto"
          />
        </div>

        <form className="space-y-6">
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"

            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password?"
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"

            />
          </div>

          <div className="flex justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            Login
          </button>
        </form>

        <p className="mt-8 text-center text-gray-600">
          Don't have an account?{" "}
          <Link
            href="/auth/register"
            className="text-orange-500 hover:text-orange-600"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
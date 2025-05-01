import Link from "next/link";

export default function CTASection() {
  return (
    <section className="relative py-24 bg-blue-900 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff10_1px,transparent_1px)] bg-[length:20px_20px]"></div>
      <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-blue-800 blur-3xl opacity-70"></div>
      <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-indigo-800 blur-3xl opacity-70"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to transform your data?
          </h2>
          <p className="mt-4 text-xl text-blue-100">
            Get started with ClarityHub today and unlock the full potential of your data.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              href="/auth/register" 
              className="bg-white hover:bg-gray-50 text-blue-700 py-3 px-8 rounded-lg font-medium transition-colors"
            >
              Start Free Trial
            </Link>
            <Link 
              href="#" 
              className="bg-blue-800 hover:bg-blue-700 text-white py-3 px-8 rounded-lg font-medium transition-colors border border-blue-700"
            >
              Schedule Demo
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
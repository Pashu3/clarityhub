import { CompanyLogo } from "./types"; 
const companyLogos: CompanyLogo[] = [
  { name: "Acme Inc" },
  { name: "Globex" },
  { name: "Initech" },
  { name: "Massive Dynamic" },
  { name: "Umbrella Corp" },
  { name: "Stark Industries" },
];

export default function TrustedBySection() {
  return (
    <section className="py-16 bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-xl font-medium text-gray-500 dark:text-gray-400">
            Trusted by innovative companies worldwide
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 place-items-center">
          {companyLogos.map((company, index) => (
            <div 
              key={index} 
              className="h-10 w-32 grayscale hover:grayscale-0 transition-all bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center"
            >
              <span className="text-gray-600 dark:text-gray-300 font-medium">
                {company.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
import { ReactNode } from "react";

export interface CompanyLogo {
  name: string;
  logo?: string;
}

export interface Feature {
  title: string;
  description: string;
  icon: ReactNode;
}

export interface Testimonial {
  quote: string;
  author: string;
  title: string;
  avatar: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
}

export interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
}
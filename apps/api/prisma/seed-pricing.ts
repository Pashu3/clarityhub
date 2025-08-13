import { PrismaClient, SubscriptionPlan } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPricingPlans() {
  try {
    // Delete existing plans
    await prisma.pricingPlan.deleteMany({});

    // Create new plans
    await prisma.pricingPlan.createMany({
      data: [
        {
          name: 'Free Plan',
          description: 'Basic access to ClarityHub features',
          planType: SubscriptionPlan.FREE,
          monthlyPrice: 0,
          quarterlyPrice: 0,
          semiAnnualPrice: 0,
          annualPrice: 0,
          currency: 'INR',
          features: JSON.stringify([
            'Upload and analyze 3 documents per month',
            'Basic AI analysis',
            'Email support'
          ]),
          trialDays: 0,
          isActive: true
        },
        {
          name: 'Premium Plan',
          description: 'Full access to all ClarityHub features',
          planType: SubscriptionPlan.PREMIUM,
          monthlyPrice: 999,
          quarterlyPrice: 2697, // ~10% discount
          semiAnnualPrice: 4995, // ~15% discount
          annualPrice: 8990, // ~25% discount
          currency: 'INR',
          features: JSON.stringify([
            'Unlimited document uploads',
            'Advanced AI analysis',
            'Data exports and API access',
            'Priority support',
            'Team collaboration features',
            'Custom integrations'
          ]),
          trialDays: 14,
          isActive: true
        }
      ]
    });

    console.log('Pricing plans seeded successfully');
  } catch (error) {
    console.error('Error seeding pricing plans:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedPricingPlans();
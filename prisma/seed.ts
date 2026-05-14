import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const [agent, reviewer, lead, admin] = await Promise.all([
    prisma.user.upsert({
      where: { email: "nisha.rao@fastlend.example" },
      update: {},
      create: { name: "Nisha Rao", email: "nisha.rao@fastlend.example", role: "OPERATIONS_AGENT" }
    }),
    prisma.user.upsert({
      where: { email: "kabir.sen@fastlend.example" },
      update: {},
      create: { name: "Kabir Sen", email: "kabir.sen@fastlend.example", role: "COMPLIANCE_REVIEWER" }
    }),
    prisma.user.upsert({
      where: { email: "asha.mehta@fastlend.example" },
      update: {},
      create: { name: "Asha Mehta", email: "asha.mehta@fastlend.example", role: "TEAM_LEAD" }
    }),
    prisma.user.upsert({
      where: { email: "devika.iyer@fastlend.example" },
      update: {},
      create: { name: "Devika Iyer", email: "devika.iyer@fastlend.example", role: "ADMIN" }
    })
  ]);

  const retailTemplate = await prisma.checklistTemplate.upsert({
    where: { category_version: { category: "RETAIL", version: 1 } },
    update: {},
    create: {
      name: "Retail onboarding checklist",
      category: "RETAIL",
      version: 1,
      items: {
        create: [
          { title: "Owner identity proof", documentType: "PAN_AADHAAR", automationSupported: true, verificationService: "identity-verification", sortOrder: 1 },
          { title: "GST or tax registration", documentType: "GST_CERTIFICATE", automationSupported: true, verificationService: "gst-verification", sortOrder: 2 },
          { title: "Bank account verification", documentType: "BANK_STATEMENT", automationSupported: true, verificationService: "bank-verification", sortOrder: 3 },
          { title: "Operating address verification", documentType: "UTILITY_BILL", automationSupported: false, sortOrder: 4 }
        ]
      }
    }
  });

  const fbTemplate = await prisma.checklistTemplate.upsert({
    where: { category_version: { category: "FOOD_AND_BEVERAGE", version: 1 } },
    update: {},
    create: {
      name: "Food and beverage onboarding checklist",
      category: "FOOD_AND_BEVERAGE",
      version: 1,
      items: {
        create: [
          { title: "Owner identity proof", documentType: "PAN_AADHAAR", automationSupported: true, verificationService: "identity-verification", sortOrder: 1 },
          { title: "FSSAI license", documentType: "FSSAI_LICENSE", automationSupported: true, verificationService: "fssai-verification", sortOrder: 2 },
          { title: "Bank account verification", documentType: "BANK_STATEMENT", automationSupported: true, verificationService: "bank-verification", sortOrder: 3 },
          { title: "Operating address verification", documentType: "OUTLET_PHOTO", automationSupported: false, sortOrder: 4 }
        ]
      }
    }
  });

  const application = await prisma.merchantApplication.upsert({
    where: { referenceId: "FL-MOB-0001" },
    update: {},
    create: {
      referenceId: "FL-MOB-0001",
      legalName: "Rao Retail Ventures",
      displayName: "Rao Daily Mart",
      category: "RETAIL",
      businessConstitution: "Proprietorship",
      gstNumber: "27ABCDE1234F1Z5",
      pan: "ABCDE1234F",
      primaryContactName: "Mahesh Rao",
      primaryContactEmail: "mahesh.rao@example.com",
      primaryContactPhone: "+91 98765 43210",
      registeredAddress: "12 MG Road, Bengaluru, Karnataka",
      operatingAddress: "12 MG Road, Bengaluru, Karnataka",
      onboardingSource: "Operations intake",
      status: "EXCEPTION_REVIEW_REQUIRED",
      riskStatus: "MEDIUM",
      confidenceScore: "71.40",
      assignedAgentId: agent.id,
      assignedReviewerId: reviewer.id,
      checklistTemplateId: retailTemplate.id,
      checklistItems: {
        create: [
          { title: "Owner identity proof", documentType: "PAN_AADHAAR", automationSupported: true, status: "VERIFIED", confidenceScore: "96.20", sortOrder: 1 },
          { title: "GST or tax registration", documentType: "GST_CERTIFICATE", automationSupported: true, status: "FAILED", confidenceScore: "48.10", rejectionReason: "GST legal name mismatch", sortOrder: 2 },
          { title: "Bank account verification", documentType: "BANK_STATEMENT", automationSupported: true, status: "UPLOADED", confidenceScore: "76.00", sortOrder: 3 },
          { title: "Operating address verification", documentType: "UTILITY_BILL", automationSupported: false, status: "PENDING", sortOrder: 4 }
        ]
      },
      statusEvents: {
        create: {
          toStatus: "EXCEPTION_REVIEW_REQUIRED",
          reason: "GST mismatch routed to exception review",
          actorId: reviewer.id
        }
      },
      auditEvents: {
        create: {
          actorId: lead.id,
          action: "seed.application.created",
          entityType: "MerchantApplication",
          metadata: { source: "dummy seed data" }
        }
      }
    }
  });

  await prisma.merchantApplication.upsert({
    where: { referenceId: "FL-MOB-0002" },
    update: {},
    create: {
      referenceId: "FL-MOB-0002",
      legalName: "Urban Bites Foods Private Limited",
      displayName: "Urban Bites",
      category: "FOOD_AND_BEVERAGE",
      businessConstitution: "Private Limited",
      gstNumber: "29FOODS1234K1Z2",
      pan: "FOODS1234K",
      primaryContactName: "Ira Menon",
      primaryContactEmail: "ira.menon@example.com",
      primaryContactPhone: "+91 99887 76655",
      registeredAddress: "5 Residency Road, Bengaluru, Karnataka",
      onboardingSource: "Partner referral",
      status: "AUTO_APPROVED",
      riskStatus: "LOW",
      confidenceScore: "94.80",
      assignedAgentId: agent.id,
      assignedReviewerId: reviewer.id,
      checklistTemplateId: fbTemplate.id,
      decidedAt: new Date(),
      auditEvents: {
        create: {
          actorId: admin.id,
          action: "seed.application.auto_approved",
          entityType: "MerchantApplication",
          metadata: { source: "dummy seed data" }
        }
      }
    }
  });

  await prisma.verificationRun.create({
    data: {
      applicationId: application.id,
      serviceName: "gst-verification",
      status: "NEEDS_REVIEW",
      confidenceScore: "48.10",
      mismatchIndicators: { legalName: "MISMATCH" },
      escalationReason: "Entity name mismatch requires reviewer decision"
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

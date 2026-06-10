export type Credential = {
  title: string;
  issuer: string;
  reference?: string;
  status: string;
};

export const credentials: Credential[] = [
  {
    title: "Certificate of Incorporation",
    issuer: "Corporate Affairs Commission (CAC), Federal Republic of Nigeria",
    reference: "RC 797482 — incorporated 26 January 2009",
    status: "Active",
  },
  {
    title: "Tax Clearance Certificate",
    issuer: "Federal Inland Revenue Service (FIRS) — MSTO 9th Mile",
    reference: "TCC No. 225189456945",
    status: "Current",
  },
  {
    title: "FIRS Tax Identification Number (TIN)",
    issuer: "Federal Inland Revenue Service",
    reference: "Registered taxpayer in good standing",
    status: "Active",
  },
  {
    title: "ECS Clearance Certificate",
    issuer: "Nigeria Social Insurance Trust Fund (NSITF)",
    reference: "Employer Registration No. 1001335818",
    status: "Compliant",
  },
  {
    title: "Pension Clearance Certificate",
    issuer: "National Pension Commission (PenCom)",
    reference: "Employer Code PR0000797482",
    status: "Compliant",
  },
  {
    title: "BPP Interim Registration Report",
    issuer: "Bureau of Public Procurement",
    reference: "Ref. No. 0000-0012-6626",
    status: "Registered",
  },
  {
    title: "ITF Certificate of Compliance",
    issuer: "Industrial Training Fund",
    reference: "Registration No. 000519602",
    status: "Compliant",
  },
];
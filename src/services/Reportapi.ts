import { OgaReport } from "../types";
import api from "./Axios";

export interface ReportData {
  category: string;
  createdAt: string;
  id: number;
  property: string | null;
  propertyId: number;
  reason: string;
  reporterId: number;
  reportedAgentId: number;
  status: string;
  reportedAgent: {
    email: string;
    id: number;
    name: string;
  };
  reporter: {
    email: string;
    id: number;
    name: string;
  };
}

export interface ReportByIdRecord {
  id: number;
  reporterId: number;
  reportedAgentId: number;
  propertyId: number | null;
  reason: string;
  status: string;
  createdAt: string;
  category: string;
  reporter: {
    id: number;
    name: string;
    email: string;
  };
  reportedAgent: {
    id: number;
    name: string;
    email: string;
  };
  property: { id: number; title: string } | string | null;
}

interface ReportByIdResponse {
  data?: {
    report?: ReportByIdRecord;
    similarReports?: ReportByIdRecord | ReportByIdRecord[] | null;
  };
}

export interface ReportByIdResult {
  report: OgaReport;
  similarReports: OgaReport[];
}

const toOgaReport = (report: ReportByIdRecord): OgaReport => {
  const parsedDate = new Date(report.createdAt);
  const date = Number.isNaN(parsedDate.getTime())
    ? report.createdAt
    : parsedDate.toLocaleDateString();
  const rawStatus = report.status.toLowerCase();
  const status: OgaReport["status"] =
    rawStatus === "resolved"
      ? "Resolved"
      : rawStatus === "reviewed"
        ? "Reviewed"
        : "Open";
  const propertyName =
    typeof report.property === "string"
      ? report.property
      : report.property?.title;
  const propertyId =
    typeof report.property === "object" && report.property !== null
      ? report.property.id
      : report.propertyId;

  return {
    id: String(report.id),
    reporter: report.reporter?.name ?? "Unknown reporter",
    category: report.category ?? "Other",
    email: report.reporter?.email ?? "",
    createdAt: report.createdAt,
    reportedAgent: report.reportedAgent,
    agentId: String(report.reportedAgentId),
    agentName: report.reportedAgent?.name ?? "Unknown agent",
    reason: report.reason ?? "No reason provided",
    date,
    status,
    pastReportsCount: 0,
    severity: "Medium",
    description: report.reason ?? "No reason provided",
    ...(propertyId != null ? { relatedListingId: String(propertyId) } : {}),
    ...(propertyName ? { relatedListingName: propertyName } : {}),
    evidenceImages: [],
    previousOffenses: [],
  };
};

export const ReportByIdApi = async (id: string): Promise<ReportByIdResult> => {
  const response = await api.get<ReportByIdResponse>("/reports/by_id", {
    params: { id },
  });
  const result = response.data?.data;

  if (!result?.report) {
    throw new Error("The report details were not included in the response.");
  }

  const similarReports = result.similarReports;
  const similarReportRecords = Array.isArray(similarReports)
    ? similarReports
    : similarReports
      ? [similarReports]
      : [];

  return {
    report: toOgaReport(result.report),
    similarReports: similarReportRecords.map(toOgaReport),
  };
};

export const ReportsApi = async (): Promise<OgaReport[]> => {
  const response = await api.get("/reports");
  const reports = response.data?.data ?? response.data;

  if (!Array.isArray(reports)) return [];

  return reports.map((report: ReportData): OgaReport => {
    const createdAt = report.createdAt;
    const parsedDate = new Date(createdAt);
    const date = Number.isNaN(parsedDate.getTime())
      ? createdAt
      : parsedDate.toLocaleDateString();
    const status: OgaReport["status"] =
      report.status === "Reviewed" || report.status === "Resolved"
        ? report.status
        : "Open";

    return {
      id: String(report.id),
      reporter: report.reporter?.name ?? "Unknown reporter",
      category: report.category ?? "Other",
      email: report.reporter?.email ?? "",
      createdAt,
      reportedAgent: report.reportedAgent,
      agentId: String(report.reportedAgentId),
      agentName: report.reportedAgent?.name ?? "Unknown agent",
      reason: report.reason ?? "No reason provided",
      date,
      status,
      pastReportsCount: 0,
      severity: "Medium",
      description: report.reason ?? "No reason provided",
      ...(report.propertyId != null && report.property
        ? {
            relatedListingId: String(report.propertyId),
            relatedListingName: report.property,
          }
        : {}),
      evidenceImages: [],
      previousOffenses: [],
    };
  });
};

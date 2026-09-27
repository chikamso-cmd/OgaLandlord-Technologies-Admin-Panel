import type { OgaListing } from "../types";
import api from "./Axios";

type ApiRecord = Record<string, unknown>;

const isRecord = (value: unknown): value is ApiRecord =>
	typeof value === "object" && value !== null && !Array.isArray(value);

const getRecords = (payload: unknown): ApiRecord[] => {
	if (Array.isArray(payload)) return payload.filter(isRecord);
	if (!isRecord(payload)) return [];

	for (const key of ["data", "listings", "properties", "results"]) {
		const nested = payload[key];
		if (Array.isArray(nested)) return nested.filter(isRecord);
		if (isRecord(nested)) {
			const records = getRecords(nested);
			if (records.length > 0) return records;
		}
	}

	return [];
};

const getText = (...values: unknown[]): string => {
	const value = values.find(
		(candidate) => typeof candidate === "string" || typeof candidate === "number",
	);
	return value == null ? "" : String(value);
};

const getRecord = (...values: unknown[]): ApiRecord =>
	values.find(isRecord) ?? {};

const toListing = (record: ApiRecord, index: number): OgaListing => {
	const agent = getRecord(record.agent, record.owner);
	const sourceBreakdown = getRecord(record.breakdown, record.feeBreakdown);
	const requirements = getRecord(record.specialRequirements, record.requirements);
	const photos = Array.isArray(record.images) ? record.images : [];
	const statusValue = getText(record.status, record.listingStatus).toLowerCase();
	const status: OgaListing["status"] =
		statusValue.includes("verif") || statusValue.includes("active")
			? "Verified"
			: statusValue.includes("remov") || statusValue.includes("reject")
				? "Removed"
				: "Pending";
	const rentStatusValue = getText(record.rentStatus, record.availability).toLowerCase();
	const rentStatus: OgaListing["rentStatus"] =
		rentStatusValue.includes("rent")
			? "Rented"
			: rentStatusValue.includes("remov")
				? "Removed"
				: rentStatusValue.includes("pend")
					? "Pending"
					: "Available";
	const price = getText(record.price, record.rent, record.amount, "Not provided");

	return {
		id: getText(record.id, record.propertyId, record._id, `listing-${index}`),
		title: getText(record.title, record.propertyName, record.name, "Untitled listing"),
		area: getText(record.area, record.location, record.address, "Location unavailable"),
		price,
		agentId: getText(record.agentId, agent.id, ""),
		agentName: getText(record.agentName, agent.name, "Unknown agent"),
		status,
		beds: Number(record.beds ?? record.bedrooms ?? 0) || 0,
		baths: Number(record.baths ?? record.bathrooms ?? 0) || 0,
		rentStatus,
		timeAgo: getText(record.timeAgo, record.createdAt, "Recently listed"),
		image: getText(record.image, record.imageUrl, photos[0], ""),
		description: getText(record.description, record.details, "No description provided."),
		specialRequirements: {
			religion: getText(requirements.religion, "Any"),
			maritalStatus: getText(requirements.maritalStatus, "Any"),
		},
		breakdown: {
			rent: getText(sourceBreakdown.rent, price),
			serviceCharge: getText(sourceBreakdown.serviceCharge, "Not provided"),
			damageCharge: getText(sourceBreakdown.damageCharge, "Not provided"),
			agentFee: getText(sourceBreakdown.agentFee, "Not provided"),
			total: getText(sourceBreakdown.total, price),
			inspectionFee: getText(sourceBreakdown.inspectionFee, "Not provided"),
		},
	};
};

export const ListingsApi = async (): Promise<OgaListing[]> => {
	const response = await api.get(
		"/admin/all_agents_listed_properties",
	);
	return getRecords(response.data).map(toListing);
};

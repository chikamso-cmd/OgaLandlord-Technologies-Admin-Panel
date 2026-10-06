import type { OgaListing, OgaListingRating, OgaListingUnit } from "../types";
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
		(candidate) =>
			(typeof candidate === "string" && candidate !== "") || typeof candidate === "number",
	);
	return value == null ? "" : String(value);
};

const getNullableText = (value: unknown): string | null =>
	value === null || value === undefined || value === "" ? null : String(value);

const getNumber = (value: unknown): number => {
	const number = Number(value);
	return Number.isFinite(number) ? number : 0;
};

const getNullableNumber = (value: unknown): number | null =>
	value === null || value === undefined || value === "" ? null : getNumber(value);

const getRecord = (...values: unknown[]): ApiRecord =>
	values.find(isRecord) ?? {};

const getArray = (value: unknown): ApiRecord[] =>
	Array.isArray(value) ? value.filter(isRecord) : [];

export const formatNaira = (value: number): string =>
	`₦${value.toLocaleString("en-NG")}`;

const formatTimeAgo = (value: string): string => {
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
	if (days < 1) return "Today";
	if (days === 1) return "1 day ago";
	if (days < 30) return `${days} days ago`;
	return date.toLocaleDateString();
};

const toUnit = (unit: ApiRecord): OgaListingUnit => ({
	id: getNumber(unit.id),
	unitNumber: getNullableText(unit.unitNumber),
	rentPrice: getNumber(unit.rentPrice),
	bedrooms: getNumber(unit.bedrooms),
	bathrooms: getNumber(unit.bathrooms),
	isAvailable: unit.isAvailable === true,
	agentFee: getNumber(unit.agentFee),
	damageDeposit: getNumber(unit.damageDeposit),
	inspectionFee: getNumber(unit.inspectionFee),
	serviceCharge: getNumber(unit.serviceCharge),
	totalPackage: getNumber(unit.totalPackage),
});

const toRating = (rating: ApiRecord): OgaListingRating => ({
	id: getNumber(rating.id),
	tenantId: getNumber(rating.tenantId),
	stars: getNumber(rating.stars),
	comment: getNullableText(rating.comment),
	createdAt: getNullableText(rating.createdAt),
});

export const normalizeListingStatus = (value: string): OgaListing["status"] => {
	const statusValue = value.toLowerCase();
	if (statusValue.includes("rent")) return "rented";
	if (
		statusValue.includes("publish") ||
		statusValue.includes("verif") ||
		statusValue.includes("active") ||
		statusValue.includes("approved")
	)
		return "published";
	if (statusValue.includes("remov") || statusValue.includes("reject")) return "Removed";
	return "Pending";
};

const toListing = (record: ApiRecord, index: number): OgaListing => {
	const agent = getRecord(record.agent, record.owner);
	const sourceBreakdown = getRecord(record.breakdown, record.feeBreakdown);
	const requirements = getRecord(record.specialRequirements, record.requirements);
	const units = getArray(record.units).map(toUnit);
	const firstUnit = units[0];
	const ratings = getArray(record.ratings).map(toRating);
	const images = Array.isArray(record.images)
		? [...record.images]
				.sort((a, b) =>
					isRecord(a) && isRecord(b) ? getNumber(a.sortOrder) - getNumber(b.sortOrder) : 0,
				)
				.map((image) => (isRecord(image) ? getText(image.imageUrl, image.url) : getText(image)))
				.filter(Boolean)
		: [];

	const status = normalizeListingStatus(getText(record.status, record.listingStatus));
	const rentStatusValue = getText(record.rentStatus, record.availability).toLowerCase();
	const rentStatus: OgaListing["rentStatus"] = rentStatusValue
		? rentStatusValue.includes("rent")
			? "rented"
			: rentStatusValue.includes("remov")
				? "Removed"
				: rentStatusValue.includes("pend")
					? "Pending"
					: "Available"
		: firstUnit && !firstUnit.isAvailable
			? "rented"
			: "Available";

	const price = firstUnit
		? `${formatNaira(firstUnit.rentPrice)}/yr`
		: getText(record.price, record.rent, record.amount, "Not provided");
	const unitFee = (value: number | undefined, fallback: unknown) =>
		value !== undefined ? formatNaira(value) : getText(fallback, "Not provided");

	const address = getNullableText(record.address);
	const city = getNullableText(record.city);
	const state = getNullableText(record.state);
	const area = [address, city, state].filter(Boolean).join(", ");
	const createdAt = getNullableText(record.createdAt);

	return {
		id: getNumber(getText(record.id, record.propertyId, index)),
		title: getText(record.title, record.propertyName, record.name, "Untitled listing"),
		area: getText(record.area, record.location, area, "Location unavailable"),
		price,
		agentId: getNumber(getText(record.agentId, agent.id)),
		agentName: getText(record.agentName, agent.name, "Unknown agent"),
		status,
		beds: firstUnit?.bedrooms ?? getNumber(record.beds ?? record.bedrooms),
		baths: firstUnit?.bathrooms ?? getNumber(record.baths ?? record.bathrooms),
		rentStatus,
		timeAgo: createdAt ? formatTimeAgo(createdAt) : getText(record.timeAgo, "Recently listed"),
		image: images[0] ?? getText(record.image, record.imageUrl),
		description: getText(record.description, record.details, "No description provided."),
		specialRequirements: {
			religion: getText(requirements.religion, "Any"),
			maritalStatus: getText(requirements.maritalStatus, "Any"),
		},
		breakdown: {
			rent: firstUnit ? formatNaira(firstUnit.rentPrice) : getText(sourceBreakdown.rent, price),
			serviceCharge: unitFee(firstUnit?.serviceCharge, sourceBreakdown.serviceCharge),
			damageCharge: unitFee(firstUnit?.damageDeposit, sourceBreakdown.damageCharge),
			agentFee: unitFee(firstUnit?.agentFee, sourceBreakdown.agentFee),
			total: firstUnit ? formatNaira(firstUnit.totalPackage) : getText(sourceBreakdown.total, price),
			inspectionFee: unitFee(firstUnit?.inspectionFee, sourceBreakdown.inspectionFee),
		},
		propertyType: getNullableText(record.propertyType),
		address,
		city,
		state,
		country: getNullableText(record.country),
		latitude: getNullableNumber(record.latitude),
		longitude: getNullableNumber(record.longitude),
		rawStatus: getNullableText(record.status),
		createdAt,
		images,
		units,
		agent: isRecord(record.agent)
			? {
					id: getNumber(agent.id),
					name: getText(agent.name, "Unknown agent"),
					email: getNullableText(agent.email),
					username: getNullableText(agent.username),
					trustScore: getNumber(agent.trustScore),
					verificationStatus: getNullableText(agent.verificationStatus),
					imageUrl: getNullableText(agent.imageUrl),
				}
			: undefined,
		ratings,
		averageRating: ratings.length
			? ratings.reduce((sum, rating) => sum + rating.stars, 0) / ratings.length
			: null,
		viewsCount: Array.isArray(record.views) ? record.views.length : 0,
		favoritesCount: Array.isArray(record.favorites) ? record.favorites.length : 0,
		reportsCount: Array.isArray(record.reports) ? record.reports.length : 0,
		commentsCount: Array.isArray(record.commentOnListedProducts)
			? record.commentOnListedProducts.length
			: 0,
	};
};

export const ListingsApi = async (): Promise<OgaListing[]> => {
	const response = await api.get(
		"/admin/all_agents_listed_properties",
	);
	return getRecords(response.data).map(toListing);
};

export type ListingStatusUpdate = {
	message?: string;
	rawStatus: string;
	status: OgaListing["status"];
};

// Returns the status the backend actually saved, falling back to the requested one.
export const updateListingStatus = async (
	propertyID: number,
	requestedStatus: "published" | "removed" | "rented",
): Promise<ListingStatusUpdate> => {
	const response = await api.patch("/admin/update_agent_property_status", {
		propertyID,
		status: requestedStatus,
	});
	const body = getRecord(response.data);
	const updated = getRecord(body.data, body.property, body.listing);
	const rawStatus = getText(updated.status, body.status, requestedStatus);
	return {
		message: getNullableText(body.message) ?? undefined,
		rawStatus,
		status: normalizeListingStatus(rawStatus),
	};
};

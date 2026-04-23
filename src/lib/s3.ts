import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const requiredEnv = ["AWS_REGION", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "AWS_S3_BUCKET"] as const;

function getAwsConfig() {
	const missing = requiredEnv.filter((key) => !process.env[key]);
	if (missing.length > 0) {
		throw new Error(`Missing required AWS env vars: ${missing.join(", ")}`);
	}

	return {
		region: process.env.AWS_REGION as string,
		accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
		bucket: process.env.AWS_S3_BUCKET as string,
	};
}

function getS3Client() {
	const config = getAwsConfig();
	return new S3Client({
		region: config.region,
		credentials: {
			accessKeyId: config.accessKeyId,
			secretAccessKey: config.secretAccessKey,
		},
	});
}

type PresignedUploadInput = {
	key: string;
	contentType: string;
	expiresInSeconds?: number;
};

export async function createPresignedUploadUrl({
	key,
	contentType,
	expiresInSeconds = 300,
}: PresignedUploadInput): Promise<string> {
	const config = getAwsConfig();
	const s3Client = getS3Client();

	const command = new PutObjectCommand({
		Bucket: config.bucket,
		Key: key,
		ContentType: contentType,
	});

	return getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
}

type PresignedReadInput = {
	key: string;
	expiresInSeconds?: number;
};

export async function createPresignedReadUrl({
	key,
	expiresInSeconds = 300,
}: PresignedReadInput): Promise<string> {
	const config = getAwsConfig();
	const s3Client = getS3Client();

	const command = new GetObjectCommand({
		Bucket: config.bucket,
		Key: key,
	});

	return getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
}

export function getPublicS3Url(key: string): string {
	const config = getAwsConfig();
	return `https://${config.bucket}.s3.${config.region}.amazonaws.com/${key}`;
}

export const RECORDING_RESOLUTION_OPTIONS = [
	{ value: 720, label: "720p", dimensions: "1280×720" },
	{ value: 1080, label: "1080p", dimensions: "1920×1080" },
	{ value: 1440, label: "2K（1440p）", dimensions: "2560×1440" },
	{ value: 2160, label: "4K", dimensions: "3840×2160" },
];

export const RECORDING_FPS_OPTIONS = [24, 25, 30, 60, 120].map((value) => ({
	value,
	label: `${value} 帧/秒`,
}));

export function normalizeRecordingResolution(value: number | undefined) {
	return (
		RECORDING_RESOLUTION_OPTIONS.find((option) => option.value === value)
			?.value ?? 2160
	);
}

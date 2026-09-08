import { describe, expect, it } from "vitest";
import { deriveGeneralSettings } from "./general-settings";
import { normalizeRecordingResolution } from "./recording-quality";

describe("recording preferences", () => {
	it.each([720, 1080, 1440, 2160])(
		"retains resolution %i and the selected frame rate",
		(resolution) => {
			const settings = deriveGeneralSettings({
				enableNativeCameraPreview: false,
				recordingResolution: resolution,
				maxFps: 25,
			});
			expect(normalizeRecordingResolution(settings.recordingResolution)).toBe(
				resolution,
			);
			expect(settings.maxFps).toBe(25);
		},
	);
	it("defaults missing or invalid resolution to 4K without replacing saved fps", () => {
		const settings = deriveGeneralSettings({
			enableNativeCameraPreview: false,
			maxFps: 30,
		});
		expect(settings.recordingResolution).toBe(2160);
		expect(settings.maxFps).toBe(30);
		expect(normalizeRecordingResolution(0)).toBe(2160);
		expect(normalizeRecordingResolution(undefined)).toBe(2160);
	});
});

import { describe, expect, it } from "vitest";
import { localExportDestination, localRecordingMode } from "./local-build";

describe("local desktop preferences", () => {
	it("migrates a cloud recording preference without changing screenshots", () => {
		expect(localRecordingMode("instant")).toBe("studio");
		expect(localRecordingMode("studio")).toBe("studio");
		expect(localRecordingMode("screenshot")).toBe("screenshot");
	});
	it("keeps clipboard exports and recovers cloud or invalid destinations", () => {
		expect(localExportDestination("clipboard")).toBe("clipboard");
		expect(localExportDestination("file")).toBe("file");
		expect(localExportDestination("link")).toBe("file");
		expect(localExportDestination("unknown")).toBe("file");
	});
});

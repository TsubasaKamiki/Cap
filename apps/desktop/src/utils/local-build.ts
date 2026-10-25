import type { RecordingMode } from "./tauri";

export const LOCAL_BUILD = true;
export const LOCAL_EXPORT_SIZE = { x: 3840, y: 2160 };

export function localRecordingMode(mode: RecordingMode): RecordingMode {
	return mode === "instant" ? "studio" : mode;
}

export function localExportDestination(destination: string) {
	return destination === "clipboard" ? "clipboard" : "file";
}

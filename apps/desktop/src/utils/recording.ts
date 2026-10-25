import * as dialog from "@tauri-apps/plugin-dialog";
import { revealItemInDir } from "@tauri-apps/plugin-opener";
import type { createOptionsQuery } from "./queries";
import { commands, type RecordingAction, type RecordingMode } from "./tauri";

export function handleRecordingResult(
	result: Promise<RecordingAction>,
	setOptions: ReturnType<typeof createOptionsQuery>["setOptions"] | undefined,
) {
	return result
		.then(async (result) => {
			if (result === "Started") return;
			if (result === "InvalidAuthentication" || result === "UpgradeRequired") {
				setOptions?.({ mode: "studio" });
				await commands.setRecordingMode("studio");
				await dialog.message("已切换到本地录制，请重新开始。", {
					title: "本地录制",
				});
			} else
				await dialog.message(`无法开始录制：${result}`, { title: "录制错误" });
		})
		.catch((err) =>
			dialog.message(err, {
				title: "无法开始录制",
				kind: "error",
			}),
		);
}

export async function openRecordingFolder(
	projectPath: string,
	mode: RecordingMode,
) {
	const path = projectPath.replace(/[/\\]+$/, "");

	const openedContent =
		mode === "instant" &&
		(await commands.openFilePath(`${path}/content`).then(
			() => true,
			() => false,
		));

	if (openedContent) return;

	await revealItemInDir(`${path}/`);
}

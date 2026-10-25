import { createSignal, For, Show } from "solid-js";
import toast from "solid-toast";
import { generalSettingsStore } from "~/store";
import {
	normalizeRecordingResolution,
	RECORDING_FPS_OPTIONS,
	RECORDING_RESOLUTION_OPTIONS,
} from "~/utils/recording-quality";

export default function RecordingQualitySelect(props: {
	disabled: boolean;
	cameraOnly: boolean;
}) {
	const settings = generalSettingsStore.createQuery();
	const [saving, setSaving] = createSignal(false);
	const save = async (key: "recordingResolution" | "maxFps", value: number) => {
		setSaving(true);
		try {
			await generalSettingsStore.set({ [key]: value });
			await settings.refetch();
		} catch {
			toast.error("无法保存录制参数，请重试。");
		} finally {
			setSaving(false);
		}
	};
	return (
		<Show
			when={!props.cameraOnly}
			fallback={
				<p class="text-xs text-gray-10">
					纯摄像头录制的分辨率与帧率请在摄像头设备设置中选择。
				</p>
			}
		>
			<fieldset
				disabled={props.disabled || saving() || settings.isPending}
				class="flex shrink-0 gap-2 mb-1 disabled:opacity-50"
				aria-label="录制参数"
			>
				<label
					class="flex flex-1 items-center gap-1 text-xs text-gray-11"
					title="录屏分辨率上限；保持画面比例，不放大低分辨率画面。竖屏自动交换宽高。"
				>
					分辨率
					<select
						class="min-w-0 flex-1 rounded-md border border-gray-4 bg-gray-2 p-1.5 text-gray-12"
						value={normalizeRecordingResolution(
							settings.data?.recordingResolution,
						)}
						onChange={(event) =>
							void save(
								"recordingResolution",
								Number(event.currentTarget.value),
							)
						}
					>
						<For each={RECORDING_RESOLUTION_OPTIONS}>
							{(option) => <option value={option.value}>{option.label}</option>}
						</For>
					</select>
				</label>
				<label
					class="flex flex-1 items-center gap-1 text-xs text-gray-11"
					title="最高采集帧率，实际受屏幕刷新率限制；开启摄像头时最高 30 帧/秒（兼容画质为 24 帧/秒）。"
				>
					帧率
					<select
						class="min-w-0 flex-1 rounded-md border border-gray-4 bg-gray-2 p-1.5 text-gray-12"
						value={settings.data?.maxFps ?? 60}
						onChange={(event) =>
							void save("maxFps", Number(event.currentTarget.value))
						}
					>
						<For each={RECORDING_FPS_OPTIONS}>
							{(option) => <option value={option.value}>{option.label}</option>}
						</For>
					</select>
				</label>
			</fieldset>
		</Show>
	);
}

import { A, type RouteSectionProps } from "@solidjs/router";
import { getVersion } from "@tauri-apps/api/app";
import { createResource, For, Suspense } from "solid-js";
import { CapErrorBoundary } from "~/components/CapErrorBoundary";

const settingsItems = [
	{ href: "general", name: "通用" },
	{ href: "hotkeys", name: "快捷键" },
	{ href: "cli", name: "命令行" },
	{ href: "recordings", name: "录制" },
	{ href: "screenshots", name: "截图" },
	{ href: "automations", name: "自动化" },
	{ href: "transcription", name: "字幕与转录" },
];

export default function Settings(props: RouteSectionProps) {
	const [version] = createResource(getVersion);
	return (
		<div class="cap-settings-shell flex-1 flex flex-row divide-x divide-gray-3 text-sm leading-5 overflow-y-hidden">
			<aside
				class="cap-settings-sidebar flex flex-col h-full bg-gray-2"
				data-tauri-drag-region
			>
				<div class="cap-settings-window-spacer" data-tauri-drag-region />
				<div class="mx-4 mt-3 mb-4">
					<p class="font-semibold text-gray-12">Cap 本地版</p>
					<p class="mt-1 text-xs text-gray-10">无需账号 · 本地录制 · 4K 导出</p>
				</div>
				<ul class="cap-settings-nav min-w-48 flex-1 p-2.5 space-y-1 text-gray-12">
					<For each={settingsItems}>
						{(item) => (
							<li>
								<A
									href={`/settings/${item.href}`}
									class="flex items-center px-3 py-2 rounded-lg hover:bg-gray-3"
									activeClass="bg-gray-4 font-medium"
								>
									{item.name}
								</A>
							</li>
						)}
					</For>
				</ul>
				<p class="px-4 py-4 text-xs text-gray-10">
					版本 {version() ?? "…"} · 简体中文
				</p>
			</aside>
			<div class="cap-settings-content overflow-y-hidden flex-1 min-w-0">
				<CapErrorBoundary>
					<Suspense>{props.children}</Suspense>
				</CapErrorBoundary>
			</div>
		</div>
	);
}

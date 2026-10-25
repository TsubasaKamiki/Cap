import { execFileSync } from "node:child_process";
import {
	copyFileSync,
	mkdirSync,
	mkdtempSync,
	readFileSync,
	rmSync,
	symlinkSync,
} from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const desktop = fileURLToPath(new URL("../", import.meta.url));
const root = path.resolve(desktop, "../..");
const require = createRequire(import.meta.url);
const run = (file, args) =>
	execFileSync(file, args, { cwd: desktop, stdio: "inherit" });
const host = execFileSync("rustc", ["-vV"], { encoding: "utf8" }).match(
	/^host: (.+)$/m,
)?.[1];
if (!host) throw new Error("无法确定本机构建平台");

if (!process.argv.includes("--package-only")) {
	run(process.execPath, [
		require.resolve("@tauri-apps/cli/tauri.js"),
		"build",
		"--config",
		"src-tauri/tauri.local.conf.json",
		"--target",
		host,
		...(process.platform === "darwin" ? ["--bundles", "app"] : []),
	]);
}

if (process.platform === "darwin") {
	const config = JSON.parse(
		readFileSync(path.join(desktop, "src-tauri/tauri.local.conf.json"), "utf8"),
	);
	const bundle = path.join(root, "target", host, "release/bundle");
	const app = path.join(bundle, "macos", `${config.productName}.app`);
	run("codesign", ["--verify", "--deep", "--strict", app]);
	const version = execFileSync(
		"plutil",
		[
			"-extract",
			"CFBundleShortVersionString",
			"raw",
			path.join(app, "Contents/Info.plist"),
		],
		{ encoding: "utf8" },
	).trim();
	const destination = path.join(
		bundle,
		"dmg",
		`${config.productName}_${version}_${process.arch}.dmg`,
	);
	const staging = mkdtempSync(path.join(tmpdir(), "cap-local-installer-"));
	try {
		run("ditto", [app, path.join(staging, `${config.productName}.app`)]);
		symlinkSync("/Applications", path.join(staging, "应用程序"));
		copyFileSync(
			path.join(root, "README.zh-CN.md"),
			path.join(staging, "使用说明.md"),
		);
		mkdirSync(path.dirname(destination), { recursive: true });
		run("hdiutil", [
			"create",
			"-ov",
			"-volname",
			config.productName,
			"-srcfolder",
			staging,
			"-format",
			"UDZO",
			destination,
		]);
		run("hdiutil", ["verify", destination]);
		console.log(`本地版安装包：${destination}`);
	} finally {
		rmSync(staging, { recursive: true, force: true });
	}
}

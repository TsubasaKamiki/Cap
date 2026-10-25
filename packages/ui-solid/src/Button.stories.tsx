import { type ComponentProps, createSignal, For } from "solid-js";
import type { Meta, StoryObj } from "storybook-solidjs";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
	component: Button,
};
export default meta;

type Story = StoryObj<typeof meta>;

type ButtonSize = ComponentProps<typeof Button>["size"];

export const _Button: Story = {
	render: () => {
		const [size, setSize] = createSignal<ButtonSize>("md");

		return (
			<>
				<label for="size">大小</label>
				<select
					value={size()}
					onChange={(e) => setSize(e.target.value as ButtonSize)}
				>
					<For each={["xs", "sm", "md", "lg"]}>
						{(size) => <option value={size}>{size}</option>}
					</For>
				</select>
				<table class="text-sm text-left border-separate border-spacing-2">
					<thead>
						<tr>
							<th />
							<th>主色</th>
							<th>辅色</th>
							<th>危险操作</th>
						</tr>
					</thead>
					<tbody>
						<tr>
							<th>默认</th>
							<td>
								<Button variant="primary" size={size()}>
									按钮
								</Button>
							</td>
							<td>
								<Button variant="gray" size={size()}>
									按钮
								</Button>
							</td>
							<td>
								<Button variant="destructive" size={size()}>
									按钮
								</Button>
							</td>
						</tr>
						<tr>
							<th>悬停</th>
							<td>
								<Button
									variant="primary"
									size={size()}
									class="sb-pseudo--hover"
								>
									按钮
								</Button>
							</td>
							<td>
								<Button variant="gray" size={size()} class="sb-pseudo--hover">
									按钮
								</Button>
							</td>
							<td>
								<Button
									variant="destructive"
									size={size()}
									class="sb-pseudo--hover"
								>
									按钮
								</Button>
							</td>
						</tr>
						<tr>
							<th>已禁用</th>
							<td>
								<Button variant="primary" size={size()} disabled>
									按钮
								</Button>
							</td>
							<td>
								<Button variant="gray" size={size()} disabled>
									按钮
								</Button>
							</td>
							<td>
								<Button variant="destructive" size={size()} disabled>
									按钮
								</Button>
							</td>
						</tr>
					</tbody>
				</table>
			</>
		);
	},
};

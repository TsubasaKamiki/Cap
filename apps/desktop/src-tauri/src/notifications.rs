use crate::{AppSounds, general_settings::GeneralSettingsStore};
#[cfg(not(target_os = "linux"))]
use tauri_plugin_notification::NotificationExt;

#[allow(unused)]
pub enum NotificationType {
    VideoSaved,
    VideoCopiedToClipboard,
    ShareableLinkCopied,
    UploadFailed,
    VideoSaveFailed,
    VideoCopyFailed,
    ShareableLinkFailed,
    ScreenshotSaved,
    ScreenshotCopiedToClipboard,
    ScreenshotSaveFailed,
    ScreenshotCopyFailed,
}

impl NotificationType {
    fn details(&self) -> (&'static str, &'static str, bool) {
        match self {
            NotificationType::VideoSaved => ("视频已保存", "视频保存成功", false),
            NotificationType::VideoCopiedToClipboard => ("视频已复制", "视频已复制到剪贴板", false),
            NotificationType::ShareableLinkCopied => ("链接已复制", "链接已复制到剪贴板", false),
            NotificationType::UploadFailed => ("上传失败", "无法上传媒体，请重试", true),
            NotificationType::VideoSaveFailed => ("保存失败", "无法保存视频，请重试", true),
            NotificationType::VideoCopyFailed => ("复制失败", "无法复制视频到剪贴板，请重试", true),
            NotificationType::ShareableLinkFailed => ("分享失败", "无法创建分享链接，请重试", true),
            NotificationType::ScreenshotSaved => ("截图已保存", "截图保存成功", false),
            NotificationType::ScreenshotCopiedToClipboard => {
                ("截图已复制", "截图已复制到剪贴板", false)
            }
            NotificationType::ScreenshotSaveFailed => ("保存失败", "无法保存截图，请重试", true),
            NotificationType::ScreenshotCopyFailed => {
                ("复制失败", "无法复制截图到剪贴板，请重试", true)
            }
        }
    }

    #[allow(unused)]
    pub fn message(&self) -> &'static str {
        match self {
            NotificationType::UploadFailed => "多次尝试后仍无法上传视频，请稍后重试。",
            _ => "",
        }
    }

    #[allow(unused)]
    pub fn title(&self) -> &'static str {
        match self {
            NotificationType::UploadFailed => "上传失败",
            _ => "",
        }
    }

    pub fn send(self, app: &tauri::AppHandle) {
        send_notification(app, self);
    }
}

pub fn send_notification(app: &tauri::AppHandle, notification_type: NotificationType) {
    let enable_notifications = GeneralSettingsStore::get(app)
        .map(|settings| settings.is_some_and(|s| s.enable_notifications))
        .unwrap_or(false);

    if !enable_notifications {
        return;
    }

    let (title, body, _is_error) = notification_type.details();

    #[cfg(target_os = "linux")]
    tauri::async_runtime::spawn(async move {
        if let Err(error) = show_linux_notification(title, body).await {
            tracing::warn!(%error, "Failed to send notification");
        }
    });

    #[cfg(not(target_os = "linux"))]
    app.notification()
        .builder()
        .title(title)
        .body(body)
        .show()
        .ok();

    let skip_sound = matches!(
        notification_type,
        NotificationType::ScreenshotSaved
            | NotificationType::ScreenshotCopiedToClipboard
            | NotificationType::ScreenshotSaveFailed
            | NotificationType::ScreenshotCopyFailed
    );

    if !skip_sound {
        AppSounds::Notification.play();
    }
}

#[cfg(target_os = "linux")]
fn build_linux_notification(title: &str, body: &str) -> notify_rust::Notification {
    let mut notification = notify_rust::Notification::new();
    notification.summary(title).body(body).auto_icon();
    notification
}

#[cfg(target_os = "linux")]
pub(crate) async fn show_linux_notification(title: &str, body: &str) -> Result<(), String> {
    build_linux_notification(title, body)
        .show_async()
        .await
        .map(|_| ())
        .map_err(|error| format!("Failed to send notification: {error}"))
}

#[cfg(all(test, target_os = "linux"))]
mod tests {
    use super::build_linux_notification;

    #[test]
    fn linux_notification_preserves_content_and_application_icon() {
        let notification = build_linux_notification("截图已保存", "保存成功");

        assert_eq!(notification.summary, "截图已保存");
        assert_eq!(notification.body, "保存成功");
        assert_eq!(notification.icon, notification.appname);
        assert!(!notification.icon.is_empty());
    }
}

output "resource_group_name" {
  value = azurerm_resource_group.main.name
}

output "app_service_name" {
  value = azurerm_linux_web_app.main.name
}

output "site_url" {
  description = "배포된 블로그 접속 URL"
  value       = local.site_url
}

output "azure_portal_url" {
  description = "Azure Portal에서 리소스 그룹 바로가기"
  value       = "https://portal.azure.com/#@/resource${azurerm_resource_group.main.id}/overview"
}

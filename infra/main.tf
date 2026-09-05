# 리소스 이름 충돌을 피하기 위한 랜덤 접미사 (App Service 호스트네임은 전역적으로 유일해야 함)
resource "random_string" "suffix" {
  length  = 6
  special = false
  upper   = false
}

locals {
  app_name = "${var.project_name}-${var.environment}-${random_string.suffix.result}"
  site_url = "https://${local.app_name}.azurewebsites.net"

  # F1(Free) 티어는 Always On 기능을 지원하지 않음
  always_on_supported = var.app_service_sku != "F1" && var.app_service_sku != "D1"
}

resource "azurerm_resource_group" "main" {
  name     = "rg-${var.project_name}-${var.environment}"
  location = var.location
}

resource "azurerm_service_plan" "main" {
  name                = "asp-${var.project_name}-${var.environment}"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  os_type             = "Linux"
  sku_name            = var.app_service_sku
}

resource "azurerm_linux_web_app" "main" {
  name                = local.app_name
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_service_plan.main.location
  service_plan_id     = azurerm_service_plan.main.id

  # HTTPS만 허용 (Supabase 세션 쿠키 보안을 위해 필수)
  https_only = true

  site_config {
    always_on = local.always_on_supported

    application_stack {
      node_version = var.node_version
    }
  }

  app_settings = {
    # Oryx가 배포 시 npm install && npm run build를 자동 실행하도록 설정
    "SCM_DO_BUILD_DURING_DEPLOYMENT" = "true"
    "WEBSITE_NODE_DEFAULT_VERSION"   = var.node_version
    "NEXT_TELEMETRY_DISABLED"        = "1"

    # 앱 런타임 환경변수 (Supabase 연동) — 값은 tfvars/환경변수로 주입, 코드에 하드코딩하지 않음
    "NEXT_PUBLIC_SUPABASE_URL"      = var.supabase_url
    "NEXT_PUBLIC_SUPABASE_ANON_KEY" = var.supabase_anon_key
    "NEXT_PUBLIC_SITE_URL"          = local.site_url

    # 프로덕션에서는 목업 데이터를 절대 사용하지 않음 (의도적으로 미설정 상태 유지)
    # "USE_MOCK_DATA" = "false"
  }

  logs {
    application_logs {
      file_system_level = "Information"
    }
    http_logs {
      file_system {
        retention_in_days = 7
        retention_in_mb   = 35
      }
    }
  }
}

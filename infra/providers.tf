terraform {
  required_version = ">= 1.6.0"

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.2"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }

  # 로컬 상태 파일 사용 (1인 개발/소규모 프로젝트 기준).
  # 팀 협업 시에는 azurerm backend(Storage Account)로 원격 상태 관리를 권장합니다.
}

provider "azurerm" {
  features {
    resource_group {
      # 리소스 그룹 삭제 시 하위 리소스가 남아있어도 강제로 삭제되지 않도록 안전장치 유지
      prevent_deletion_if_contains_resources = false
    }
  }
}

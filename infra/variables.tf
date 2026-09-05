variable "project_name" {
  description = "리소스 이름에 사용할 프로젝트 이름 (소문자/숫자/하이픈)"
  type        = string
  default     = "vibe-venture-blog"
}

variable "environment" {
  description = "배포 환경 구분자 (예: prod, dev)"
  type        = string
  default     = "prod"
}

variable "location" {
  description = "Azure 리전"
  type        = string
  default     = "koreacentral"
}

variable "app_service_sku" {
  description = "App Service Plan SKU (F1=무료, B1=Basic 등)"
  type        = string
  default     = "F1"
}

variable "node_version" {
  description = "App Service에서 사용할 Node.js 버전"
  type        = string
  default     = "22-lts"
}

# --- Supabase 연동 정보 (민감정보) ---
# 실제 값은 절대 이 파일이나 git에 커밋하지 말고, terraform.tfvars(gitignore 처리) 또는
# 환경변수(TF_VAR_supabase_url 등)로 전달하세요.

variable "supabase_url" {
  description = "Supabase 프로젝트 URL (NEXT_PUBLIC_SUPABASE_URL)"
  type        = string
  sensitive   = true
}

variable "supabase_anon_key" {
  description = "Supabase anon/publishable key (NEXT_PUBLIC_SUPABASE_ANON_KEY)"
  type        = string
  sensitive   = true
}

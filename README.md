# AWS Discord Bot: Discord를 활용한 AWS 클라우드 환경 관리

이 Discord 봇은 사용자가 Discord에서 직접 AWS 클라우드 환경을 관리할 수 있도록 설계되었습니다. AWS 계정, EC2 인스턴스, VPC, RDS 데이터베이스 등 다양한 AWS 서비스에 대한 명령어를 제공하여, 클라우드 아키텍처를 보다 쉽고 효율적으로 제어할 수 있습니다.

---

## 🚀 주요 기능

* **AWS 계정 관리**: 자격 증명 설정, 저장 및 유효성 검사
* **EC2 관리**: 인스턴스 목록 조회, 상태 변경 및 모니터링
* **VPC 관리**: VPC, 서브넷, 라우팅 테이블 생성 및 수정
* **RDS 관리**: 데이터베이스 인스턴스 목록 조회, 생성 및 삭제

---

## 사용 가능한 명령어

아래는 현재 봇에서 지원하는 주요 명령어 목록입니다. 모든 명령어는 슬래시 (`/`) 명령어로 시작합니다.

### ⚙️ `aws`: AWS 관리

AWS 자격 증명 및 계정 정보를 관리합니다.

* `aws console-login`: AWS 콘솔 로그인 URL을 생성합니다.
* `aws configure`: AWS 자격 증명(Access Key ID, Secret Access Key)을 설정합니다.
* `aws save-credentials`: 현재 설정된 자격 증명을 파일에 저장합니다.
* `aws load-credentials`: 저장된 자격 증명을 불러옵니다.
* `aws saved-credentials`: 저장된 자격 증명 정보를 확인합니다.
* `aws delete-credentials`: 저장된 자격 증명을 삭제합니다.
* `aws validate`: AWS 자격 증명의 유효성을 검사합니다.
* `aws credentials`: 현재 설정된 자격 증명 정보를 표시합니다.
* `aws account-info`: AWS 계정 정보를 조회합니다.
* `aws iam-user`: 특정 IAM 사용자 정보를 조회합니다.
* `aws iam-list-up`: IAM 사용자 목록을 조회합니다.

---

### 💻 `ec2`: EC2 관리

EC2 인스턴스 상태를 제어하고 정보를 조회합니다.

* `ec2 list-up`: EC2 인스턴스 목록을 조회합니다.
* `ec2 specify-instance`: 특정 EC2 인스턴스 세부 정보를 불러옵니다.
* `ec2 state-change`: 인스턴스 상태를 변경합니다 (실행/중지/재부팅).
* `ec2 monitoring-instance`: 인스턴스 모니터링 여부를 확인합니다.

---

### 🌐 `vpc`: VPC 관리

VPC와 그 구성 요소를 관리합니다.

* `vpc create`: 새로운 VPC를 생성합니다.
* `vpc delete-vpc`: VPC를 삭제합니다.
* `vpc list-up`: VPC 목록을 조회합니다.
* `vpc add-subnet`: 서브넷을 추가합니다.
* `vpc delete-subnet`: 서브넷을 삭제합니다.
* `vpc add-routing-table`: 라우팅 테이블을 생성합니다.
* `vpc attach-routing-table`: 서브넷을 라우팅 테이블에 연결합니다.
* `vpc add-routing-table-rule`: 라우팅 테이블 규칙을 추가합니다.
* `vpc list-routing-tables`: VPC의 라우팅 테이블과 서브넷 정보를 조회합니다.
* `vpc list-subnet`: VPC의 서브넷 정보를 조회합니다.

---

### 🗄️ `rds`: RDS 인스턴스 관리

RDS 데이터베이스 인스턴스를 관리합니다.

* `rds list`: RDS 인스턴스 목록을 조회합니다.
* `rds status`: 특정 RDS 인스턴스의 상태를 조회합니다.
* `rds create`: RDS 인스턴스를 생성합니다.
* `rds delete`: RDS 인스턴스를 삭제합니다.

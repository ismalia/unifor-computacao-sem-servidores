# [Unifor] Computação sem servidores

Repositório dedicado à disciplina **Computação sem servidores**, ministrada pelo professor Marcondes Josino Alexandre na Especialização em Engenharia de Software com DevOps, curso de pós-graduação lato sensu da Universidade de Fortaleza (UNIFOR).

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Índice**  *gerado com [DocToc](https://github.com/thlorenz/doctoc)*

- [Atividade avaliativa](#atividade-avaliativa)
  - [Equipe](#equipe)
  - [Cenário escolhido](#cen%C3%A1rio-escolhido)
  - [Objetivo](#objetivo)
  - [Projeto: Message Board](#projeto-message-board)
    - [Arquitetura](#arquitetura)
  - [Configuração e deployment](#configura%C3%A7%C3%A3o-e-deployment)
    - [Pré-requisitos](#pr%C3%A9-requisitos)
    - [I. Publicar o Azure Function App](#i-publicar-o-azure-function-app)
      - [1. Fazer login no Azure](#1-fazer-login-no-azure)
      - [2. Criar um grupo de recursos](#2-criar-um-grupo-de-recursos)
      - [3. Criar uma conta de armazenamento](#3-criar-uma-conta-de-armazenamento)
      - [4. Obter a string de conexão do armazenamento](#4-obter-a-string-de-conex%C3%A3o-do-armazenamento)
      - [5. Criar a tabela no Azure Storage](#5-criar-a-tabela-no-azure-storage)
      - [6. Criar o Azure Function App com plano de consumo](#6-criar-o-azure-function-app-com-plano-de-consumo)
      - [7. Navegar para o diretório `function-app`](#7-navegar-para-o-diret%C3%B3rio-function-app)
      - [8. Instalar dependências](#8-instalar-depend%C3%AAncias)
      - [9. Publicar o Function App](#9-publicar-o-function-app)
      - [10. Ajustar variáveis de ambiente](#10-ajustar-vari%C3%A1veis-de-ambiente)
      - [11. [Opcional] Testar Function App localmente](#11-opcional-testar-function-app-localmente)
    - [II. Publicar o Azure Web App](#ii-publicar-o-azure-web-app)
      - [1. Criar um Azure Container Registry](#1-criar-um-azure-container-registry)
      - [2. Fazer login no registry](#2-fazer-login-no-registry)
      - [3. Habilita admin no registry](#3-habilita-admin-no-registry)
      - [4. Navegar para o diretório web-app](#4-navegar-para-o-diret%C3%B3rio-web-app)
      - [5. Criar arquivo `.env` com a variável de ambiente `VITE_API_URL`](#5-criar-arquivo-env-com-a-vari%C3%A1vel-de-ambiente-vite_api_url)
      - [6. Adicionar a URL do Function App ao `proxy_pass` no `nginx.conf`](#6-adicionar-a-url-do-function-app-ao-proxy_pass-no-nginxconf)
      - [7. Criar a imagem Docker](#7-criar-a-imagem-docker)
      - [8. Enviar a imagem Docker](#8-enviar-a-imagem-docker)
      - [9. Criar plano App Service](#9-criar-plano-app-service)
      - [10. Criar Web App](#10-criar-web-app)
      - [11. Configurar o Web App para usar o registry de container](#11-configurar-o-web-app-para-usar-o-registry-de-container)
      - [12. Configurar CORS do Function App](#12-configurar-cors-do-function-app)
    - [III. Testando a aplicação](#iii-testando-a-aplica%C3%A7%C3%A3o)
  - [Resolução de problemas](#resolu%C3%A7%C3%A3o-de-problemas)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Atividade avaliativa

### Equipe

- Ismália Dulce Gonçalves Santiago (2328703)
- João Victor de Andrade Mesquita (2416898)
- Pedro Luiz Loureiro Maia Silva (2328034)

### Cenário escolhido

\#1: Aplicação Serverless com Azure Functions, Web App e Docker

### Objetivo

Implementar uma aplicação serverless no Microsoft Azure utilizando Azure Functions, Azure Web App e Docker para processar e exibir mensagens enviadas por meio de uma API REST.

### Projeto: Message Board

***Message Board*** é uma aplicação serverless construída com Azure Functions, Azure Storage Tables e um Azure Web App feito em React e containerizado com Docker.

#### Arquitetura

- **Azure Web App**: Frontend React que exibe as mensagens e permite criar novas.
- **Azure Function App**: Função HTTP que recebe e armazena mensagens em um Azure Storage Table.
- **Azure Storage Table**: Armazena as mensagens.

### Configuração e deployment

⚠️ Dados sensíveis foram sanitizados para evitar problemas de segurança.

#### Pré-requisitos

- [Conta Azure](https://azure.microsoft.com/en-us/pricing/purchase-options/azure-account)
- [Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)
- [Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/functions-run-local?tabs=macos%2Cisolated-process%2Cnode-v4%2Cpython-v2%2Chttp-trigger%2Ccontainer-apps&pivots=programming-language-javascript#install-the-azure-functions-core-tools)
- [Node.js 22](https://nodejs.org/en/download)
- [Docker](https://www.docker.com/get-started/) ou [Podman](https://podman.io/get-started)

#### I. Publicar o Azure Function App

##### 1. Fazer login no Azure

```bash
az login
```

- Output:

```console
A web browser has been opened at https://login.microsoftonline.com/organizations/oauth2/v2.0/authorize. Please continue the login in the web browser. If no web browser is available or if the web browser fails to open, use device code flow with `az login --use-device-code`.

Retrieving tenants and subscriptions for the selection...

[Tenant and subscription selection]

No     Subscription name    Subscription ID                       Tenant
-----  -------------------  ------------------------------------  -----------------
[1] *  Azure for Students   e985eaa6-XXXX-XXXX-XXXX-XXXXXXXXXXXX  Default Directory

The default is marked with an *; the default tenant is 'Default Directory' and subscription is 'Azure for Students' (e985eaa6-XXXX-XXXX-XXXX-XXXXXXXXXXXX).

Select a subscription and tenant (Type a number or Enter for no changes): 1

Tenant: Default Directory
Subscription: Azure for Students (e985eaa6-XXXX-XXXX-XXXX-XXXXXXXXXXXX)

[Announcements]
With the new Azure CLI login experience, you can select the subscription you want to use more easily. Learn more about it and its configuration at https://go.microsoft.com/fwlink/?linkid=2271236

If you encounter any problem, please open an issue at https://aka.ms/azclibug

[Warning] The login output has been updated. Please be aware that it no longer displays the full list of available subscriptions by default.
```

##### 2. Criar um grupo de recursos

```bash
az group create --name MessageBoardResourceGroup --location eastus
```

- Output:

```json
{
  "id": "/subscriptions/e985eaa6-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/MessageBoardResourceGroup",
  "location": "eastus",
  "managedBy": null,
  "name": "MessageBoardResourceGroup",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null,
  "type": "Microsoft.Resources/resourceGroups"
}
```

##### 3. Criar uma conta de armazenamento

```bash
az storage account create --name storageaccounte985eaa6 --resource-group MessageBoardResourceGroup --location eastus --sku Standard_LRS
```

- Output:

```json
{
  "accessTier": "Hot",
  "accountMigrationInProgress": null,
  "allowBlobPublicAccess": false,
  "allowCrossTenantReplication": false,
  "allowSharedKeyAccess": null,
  "allowedCopyScope": null,
  "azureFilesIdentityBasedAuthentication": null,
  "blobRestoreStatus": null,
  "creationTime": "2025-04-12T20:03:43.797377+00:00",
  "customDomain": null,
  "defaultToOAuthAuthentication": null,
  "dnsEndpointType": null,
  "enableExtendedGroups": null,
  "enableHttpsTrafficOnly": true,
  "enableNfsV3": null,
  "encryption": {
    "encryptionIdentity": null,
    "keySource": "Microsoft.Storage",
    "keyVaultProperties": null,
    "requireInfrastructureEncryption": null,
    "services": {
      "blob": {
        "enabled": true,
        "keyType": "Account",
        "lastEnabledTime": "2025-04-12T20:03:43.953623+00:00"
      },
      "file": {
        "enabled": true,
        "keyType": "Account",
        "lastEnabledTime": "2025-04-12T20:03:43.953623+00:00"
      },
      "queue": null,
      "table": null
    }
  },
  "extendedLocation": null,
  "failoverInProgress": null,
  "geoReplicationStats": null,
  "id": "/subscriptions/e985eaa6-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/MessageBoardResourceGroup/providers/Microsoft.Storage/storageAccounts/storageaccounte985eaa6",
  "identity": null,
  "immutableStorageWithVersioning": null,
  "isHnsEnabled": null,
  "isLocalUserEnabled": null,
  "isSftpEnabled": null,
  "isSkuConversionBlocked": null,
  "keyCreationTime": {
    "key1": "2025-04-12T20:03:43.953623+00:00",
    "key2": "2025-04-12T20:03:43.953623+00:00"
  },
  "keyPolicy": null,
  "kind": "StorageV2",
  "largeFileSharesState": null,
  "lastGeoFailoverTime": null,
  "location": "eastus",
  "minimumTlsVersion": "TLS1_0",
  "name": "storageaccounte985eaa6",
  "networkRuleSet": {
    "bypass": "AzureServices",
    "defaultAction": "Allow",
    "ipRules": [],
    "ipv6Rules": [],
    "resourceAccessRules": null,
    "virtualNetworkRules": []
  },
  "primaryEndpoints": {
    "blob": "https://storageaccounte985eaa6.blob.core.windows.net/",
    "dfs": "https://storageaccounte985eaa6.dfs.core.windows.net/",
    "file": "https://storageaccounte985eaa6.file.core.windows.net/",
    "internetEndpoints": null,
    "microsoftEndpoints": null,
    "queue": "https://storageaccounte985eaa6.queue.core.windows.net/",
    "table": "https://storageaccounte985eaa6.table.core.windows.net/",
    "web": "https://storageaccounte985eaa6.z13.web.core.windows.net/"
  },
  "primaryLocation": "eastus",
  "privateEndpointConnections": [],
  "provisioningState": "Succeeded",
  "publicNetworkAccess": null,
  "resourceGroup": "MessageBoardResourceGroup",
  "routingPreference": null,
  "sasPolicy": null,
  "secondaryEndpoints": null,
  "secondaryLocation": null,
  "sku": {
    "name": "Standard_LRS",
    "tier": "Standard"
  },
  "statusOfPrimary": "available",
  "statusOfSecondary": null,
  "storageAccountSkuConversionStatus": null,
  "tags": {},
  "type": "Microsoft.Storage/storageAccounts"
}
```

##### 4. Obter a string de conexão do armazenamento

```bash
az storage account show-connection-string --name storageaccounte985eaa6 --resource-group MessageBoardResourceGroup
```

- Output:

```json
{
  "connectionString": "DefaultEndpointsProtocol=https;EndpointSuffix=core.windows.net;AccountName=storageaccounte985eaa6;AccountKey=<REDACTED>;BlobEndpoint=https://storageaccounte985eaa6.blob.core.windows.net/;FileEndpoint=https://storageaccounte985eaa6.file.core.windows.net/;QueueEndpoint=https://storageaccounte985eaa6.queue.core.windows.net/;TableEndpoint=https://storageaccounte985eaa6.table.core.windows.net/"
}
```

##### 5. Criar a tabela no Azure Storage

```bash
az storage table create --name Messages --connection-string "DefaultEndpointsProtocol=https;EndpointSuffix=core.windows.net;AccountName=storageaccounte985eaa6;AccountKey=<REDACTED>;BlobEndpoint=https://storageaccounte985eaa6.blob.core.windows.net/;FileEndpoint=https://storageaccounte985eaa6.file.core.windows.net/;QueueEndpoint=https://storageaccounte985eaa6.queue.core.windows.net/;TableEndpoint=https://storageaccounte985eaa6.table.core.windows.net/"
```

- Output:

```json
{
  "created": true
}
```

##### 6. Criar o Azure Function App com plano de consumo

```bash
az functionapp create --name message-board-function-app --resource-group MessageBoardResourceGroup --storage-account storageaccounte985eaa6 --consumption-plan-location eastus --runtime node --runtime-version 22 --functions-version 4
```

- Output:

```json
Application Insights "message-board-function-app" was created for this Function App. You can visit https://portal.azure.com/#resource/subscriptions/e985eaa6-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/MessageBoardResourceGroup/providers/microsoft.insights/components/message-board-function-app/overview to view your Application Insights component
{
  "availabilityState": "Normal",
  "clientAffinityEnabled": false,
  "clientCertEnabled": false,
  "clientCertExclusionPaths": null,
  "clientCertMode": "Required",
  "cloningInfo": null,
  "containerSize": 1536,
  "customDomainVerificationId": "<REDACTED>",
  "dailyMemoryTimeQuota": 0,
  "daprConfig": null,
  "defaultHostName": "message-board-function-app.azurewebsites.net",
  "enabled": true,
  "enabledHostNames": [
    "message-board-function-app.azurewebsites.net",
    "message-board-function-app.scm.azurewebsites.net"
  ],
  "endToEndEncryptionEnabled": false,
  "extendedLocation": null,
  "hostNameSslStates": [
    {
      "certificateResourceId": null,
      "hostType": "Standard",
      "ipBasedSslResult": null,
      "ipBasedSslState": "NotConfigured",
      "name": "message-board-function-app.azurewebsites.net",
      "sslState": "Disabled",
      "thumbprint": null,
      "toUpdate": null,
      "toUpdateIpBasedSsl": null,
      "virtualIPv6": null,
      "virtualIp": null
    },
    {
      "certificateResourceId": null,
      "hostType": "Repository",
      "ipBasedSslResult": null,
      "ipBasedSslState": "NotConfigured",
      "name": "message-board-function-app.scm.azurewebsites.net",
      "sslState": "Disabled",
      "thumbprint": null,
      "toUpdate": null,
      "toUpdateIpBasedSsl": null,
      "virtualIPv6": null,
      "virtualIp": null
    }
  ],
  "hostNames": [
    "message-board-function-app.azurewebsites.net"
  ],
  "hostNamesDisabled": false,
  "hostingEnvironmentProfile": null,
  "httpsOnly": false,
  "hyperV": false,
  "id": "/subscriptions/e985eaa6-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/MessageBoardResourceGroup/providers/Microsoft.Web/sites/message-board-function-app",
  "identity": null,
  "inProgressOperationId": null,
  "isDefaultContainer": null,
  "isXenon": false,
  "keyVaultReferenceIdentity": "SystemAssigned",
  "kind": "functionapp",
  "lastModifiedTimeUtc": "2025-04-12T23:35:58.676666",
  "location": "eastus",
  "managedEnvironmentId": null,
  "maxNumberOfWorkers": null,
  "name": "message-board-function-app",
  "outboundIpAddresses": "<REDACTED>",
  "possibleOutboundIpAddresses": "<REDACTED>",
  "publicNetworkAccess": null,
  "redundancyMode": "None",
  "repositorySiteName": "message-board-function-app",
  "reserved": false,
  "resourceConfig": null,
  "resourceGroup": "MessageBoardResourceGroup",
  "scmSiteAlsoStopped": false,
  "serverFarmId": "/subscriptions/e985eaa6-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/MessageBoardResourceGroup/providers/Microsoft.Web/serverfarms/EastUSPlan",
  "siteConfig": {
    "acrUseManagedIdentityCreds": false,
    "acrUserManagedIdentityId": null,
    "alwaysOn": false,
    "antivirusScanEnabled": null,
    "apiDefinition": null,
    "apiManagementConfig": null,
    "appCommandLine": null,
    "appSettings": null,
    "autoHealEnabled": null,
    "autoHealRules": null,
    "autoSwapSlotName": null,
    "azureMonitorLogCategories": null,
    "azureStorageAccounts": null,
    "clusteringEnabled": false,
    "connectionStrings": null,
    "cors": null,
    "customAppPoolIdentityAdminState": null,
    "customAppPoolIdentityTenantState": null,
    "defaultDocuments": null,
    "detailedErrorLoggingEnabled": null,
    "documentRoot": null,
    "elasticWebAppScaleLimit": null,
    "experiments": null,
    "fileChangeAuditEnabled": null,
    "ftpsState": null,
    "functionAppScaleLimit": 0,
    "functionsRuntimeScaleMonitoringEnabled": null,
    "handlerMappings": null,
    "healthCheckPath": null,
    "http20Enabled": false,
    "http20ProxyFlag": null,
    "httpLoggingEnabled": null,
    "ipSecurityRestrictions": [
      {
        "action": "Allow",
        "description": "Allow all access",
        "headers": null,
        "ipAddress": "Any",
        "name": "Allow all",
        "priority": 2147483647,
        "subnetMask": null,
        "subnetTrafficTag": null,
        "tag": null,
        "vnetSubnetResourceId": null,
        "vnetTrafficTag": null
      }
    ],
    "ipSecurityRestrictionsDefaultAction": null,
    "javaContainer": null,
    "javaContainerVersion": null,
    "javaVersion": null,
    "keyVaultReferenceIdentity": null,
    "limits": null,
    "linuxFxVersion": "",
    "loadBalancing": null,
    "localMySqlEnabled": null,
    "logsDirectorySizeLimit": null,
    "machineKey": null,
    "managedPipelineMode": null,
    "managedServiceIdentityId": null,
    "metadata": null,
    "minTlsCipherSuite": null,
    "minTlsVersion": null,
    "minimumElasticInstanceCount": 0,
    "netFrameworkVersion": null,
    "nodeVersion": null,
    "numberOfWorkers": 1,
    "phpVersion": null,
    "powerShellVersion": null,
    "preWarmedInstanceCount": null,
    "publicNetworkAccess": null,
    "publishingPassword": null,
    "publishingUsername": null,
    "push": null,
    "pythonVersion": null,
    "remoteDebuggingEnabled": null,
    "remoteDebuggingVersion": null,
    "requestTracingEnabled": null,
    "requestTracingExpirationTime": null,
    "routingRules": null,
    "runtimeADUser": null,
    "runtimeADUserPassword": null,
    "sandboxType": null,
    "scmIpSecurityRestrictions": [
      {
        "action": "Allow",
        "description": "Allow all access",
        "headers": null,
        "ipAddress": "Any",
        "name": "Allow all",
        "priority": 2147483647,
        "subnetMask": null,
        "subnetTrafficTag": null,
        "tag": null,
        "vnetSubnetResourceId": null,
        "vnetTrafficTag": null
      }
    ],
    "scmIpSecurityRestrictionsDefaultAction": null,
    "scmIpSecurityRestrictionsUseMain": null,
    "scmMinTlsCipherSuite": null,
    "scmMinTlsVersion": null,
    "scmSupportedTlsCipherSuites": null,
    "scmType": null,
    "sitePort": null,
    "sitePrivateLinkHostEnabled": null,
    "storageType": null,
    "supportedTlsCipherSuites": null,
    "tracingOptions": null,
    "use32BitWorkerProcess": null,
    "virtualApplications": null,
    "vnetName": null,
    "vnetPrivatePortsCount": null,
    "vnetRouteAllEnabled": null,
    "webSocketsEnabled": null,
    "websiteTimeZone": null,
    "winAuthAdminState": null,
    "winAuthTenantState": null,
    "windowsConfiguredStacks": null,
    "windowsFxVersion": null,
    "xManagedServiceIdentityId": null
  },
  "slotSwapStatus": null,
  "state": "Running",
  "storageAccountRequired": false,
  "suspendedTill": null,
  "tags": null,
  "targetSwapSlot": null,
  "trafficManagerHostNames": null,
  "type": "Microsoft.Web/sites",
  "usageState": "Normal",
  "virtualNetworkSubnetId": null,
  "vnetContentShareEnabled": false,
  "vnetImagePullEnabled": false,
  "vnetRouteAllEnabled": false,
  "workloadProfileName": null
}
```

##### 7. Navegar para o diretório `function-app`

```bash
cd function-app
```

##### 8. Instalar dependências

```bash
npm install
```

- Output:

```console
added 18 packages, and audited 19 packages in 3s

2 packages are looking for funding
  run `npm fund` for details

found 0 vulnerabilities
```

##### 9. Publicar o Function App

```bash
func azure functionapp publish message-board-function-app
```

- Output:

```console
Setting Functions site property 'netFrameworkVersion' to 'v8.0'
Getting site publishing info...
[2025-04-13T00:00:35.098Z] Starting the function app deployment...
Creating archive for current directory...
Uploading 2.13 MB [###############################################################################]
Upload completed successfully.
Deployment completed successfully.
[2025-04-13T00:00:54.703Z] Syncing triggers...
Functions in message-board-function-app:
    MessageFunction - [httpTrigger]
        Invoke url: https://message-board-function-app.azurewebsites.net/api/messages
```

##### 10. Ajustar variáveis de ambiente

```bash
# Configura STORAGE_ACCOUNT_NAME
az functionapp config appsettings set --name message-board-function-app --resource-group MessageBoardResourceGroup --settings STORAGE_ACCOUNT_NAME=storageaccounte985eaa6

# Configura STORAGE_ACCOUNT_KEY
az functionapp config appsettings set --name message-board-function-app --resource-group MessageBoardResourceGroup --settings STORAGE_ACCOUNT_KEY=<REDACTED>
```

> `STORAGE_ACCOUNT_KEY` pode ter o valor tanto da `key1` quanto da `key2` do retorno do seguinte comando:
>
> ```bash
> $ az storage account keys list --account-name storageaccounte985eaa6 --resource-group MessageBoardResourceGroup
> [
>   {
>     "creationTime": "2025-04-12T20:03:43.953623+00:00",
>     "keyName": "key1",
>     "permissions": "FULL",
>     "value": "<REDACTED>"
>   },
>   {
>     "creationTime": "2025-04-12T20:03:43.953623+00:00",
>     "keyName": "key2",
>     "permissions": "FULL",
>     "value": "<REDACTED>"
>   }
> ]
> ```

- Output:

```json
[
  {
    "name": "FUNCTIONS_WORKER_RUNTIME",
    "slotSetting": false,
    "value": null
  },
  {
    "name": "WEBSITE_NODE_DEFAULT_VERSION",
    "slotSetting": false,
    "value": null
  },
  {
    "name": "FUNCTIONS_EXTENSION_VERSION",
    "slotSetting": false,
    "value": null
  },
  {
    "name": "AzureWebJobsStorage",
    "slotSetting": false,
    "value": null
  },
  {
    "name": "WEBSITE_CONTENTAZUREFILECONNECTIONSTRING",
    "slotSetting": false,
    "value": null
  },
  {
    "name": "WEBSITE_CONTENTSHARE",
    "slotSetting": false,
    "value": null
  },
  {
    "name": "APPLICATIONINSIGHTS_CONNECTION_STRING",
    "slotSetting": false,
    "value": null
  },
  {
    "name": "WEBSITE_RUN_FROM_PACKAGE",
    "slotSetting": false,
    "value": null
  },
  {
    "name": "STORAGE_ACCOUNT_NAME",
    "slotSetting": false,
    "value": null
  },
  {
    "name": "STORAGE_ACCOUNT_KEY",
    "slotSetting": false,
    "value": null
  }
]
```

##### 11. [Opcional] Testar Function App localmente

1. Atualizar `local.settings.json` com a chave da conta de armazenamento:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "STORAGE_ACCOUNT_NAME": "storageaccounte985eaa6",
    "STORAGE_ACCOUNT_KEY": "<storage_account_key>"
  },
  "Host": {
    "CORS": "*"
  }
}
```

2. Iniciar o runtime do Functions:

```bash
$ func start

Azure Functions Core Tools
Core Tools Version:       4.0.7030 Commit hash: N/A +bb4c949899cd5659d6bfe8b92cc923453a2e8f88 (64-bit)
Function Runtime Version: 4.1037.0.23568

[2025-04-13T03:53:26.055Z] Worker process started and initialized.

Functions:

  MessageFunction: [GET,POST] http://localhost:7071/api/messages

For detailed output, run func with --verbose flag.
```

3. Executar a Function localmente:

```bash
$ curl -X POST http://localhost:7071/api/messages -H "Content-Type: application/json" -d '{"title": "t2", "description": "d2"}'
{
  "id": "message-1744516432018",
  "title": "teste",
  "description": "teste",
  "timestamp": "2025-04-13T03:53:52.018Z"
}

$ curl -X GET http://localhost:7071/api/messages
[
  {
    "id": "message-1744516432018",
    "title": "teste",
    "description": "teste",
    "timestamp": "2025-04-13T03:53:52.5091478Z"
  }
]
```

#### II. Publicar o Azure Web App

##### 1. Criar um Azure Container Registry

```bash
az acr create --name messageboardregistry --resource-group MessageBoardResourceGroup --sku Basic
```

- Output:

```json
Resource provider 'Microsoft.ContainerRegistry' used by this operation is not registered. We are registering for you.
Registration succeeded.
{
  "adminUserEnabled": false,
  "anonymousPullEnabled": false,
  "creationDate": "2025-04-12T21:07:45.054864+00:00",
  "dataEndpointEnabled": false,
  "dataEndpointHostNames": [],
  "encryption": {
    "keyVaultProperties": null,
    "status": "disabled"
  },
  "id": "/subscriptions/e985eaa6-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/MessageBoardResourceGroup/providers/Microsoft.ContainerRegistry/registries/messageboardregistry",
  "identity": null,
  "location": "eastus",
  "loginServer": "messageboardregistry.azurecr.io",
  "metadataSearch": "Disabled",
  "name": "messageboardregistry",
  "networkRuleBypassOptions": "AzureServices",
  "networkRuleSet": null,
  "policies": {
    "azureAdAuthenticationAsArmPolicy": {
      "status": "enabled"
    },
    "exportPolicy": {
      "status": "enabled"
    },
    "quarantinePolicy": {
      "status": "disabled"
    },
    "retentionPolicy": {
      "days": 7,
      "lastUpdatedTime": "2025-04-12T21:07:56.928888+00:00",
      "status": "disabled"
    },
    "softDeletePolicy": {
      "lastUpdatedTime": "2025-04-12T21:07:56.928928+00:00",
      "retentionDays": 7,
      "status": "disabled"
    },
    "trustPolicy": {
      "status": "disabled",
      "type": "Notary"
    }
  },
  "privateEndpointConnections": [],
  "provisioningState": "Succeeded",
  "publicNetworkAccess": "Enabled",
  "resourceGroup": "MessageBoardResourceGroup",
  "sku": {
    "name": "Basic",
    "tier": "Basic"
  },
  "status": null,
  "systemData": {
    "createdAt": "2025-04-12T21:07:45.054864+00:00",
    "createdBy": "ismaliadulce@gmail.com",
    "createdByType": "User",
    "lastModifiedAt": "2025-04-12T21:07:45.054864+00:00",
    "lastModifiedBy": "ismaliadulce@gmail.com",
    "lastModifiedByType": "User"
  },
  "tags": {},
  "type": "Microsoft.ContainerRegistry/registries",
  "zoneRedundancy": "Disabled"
}
```

##### 2. Fazer login no registry

```bash
az acr login --name messageboardregistry
```

- Output:

```console
The output will be changed in next breaking change release(2.73.0) scheduled for May 2025. Exit code will be 1 if command fails for docker login.
Login Succeeded!
```

##### 3. Habilita admin no registry

```bash
az acr update -n messageboardregistry --admin-enabled true
```

- Output:

```json
{
  "adminUserEnabled": true,
  "anonymousPullEnabled": false,
  "creationDate": "2025-04-12T21:07:45.054864+00:00",
  "dataEndpointEnabled": false,
  "dataEndpointHostNames": [],
  "encryption": {
    "keyVaultProperties": null,
    "status": "disabled"
  },
  "id": "/subscriptions/e985eaa6-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/MessageBoardResourceGroup/providers/Microsoft.ContainerRegistry/registries/messageboardregistry",
  "identity": null,
  "location": "eastus",
  "loginServer": "messageboardregistry.azurecr.io",
  "metadataSearch": "Disabled",
  "name": "messageboardregistry",
  "networkRuleBypassOptions": "AzureServices",
  "networkRuleSet": null,
  "policies": {
    "azureAdAuthenticationAsArmPolicy": {
      "status": "enabled"
    },
    "exportPolicy": {
      "status": "enabled"
    },
    "quarantinePolicy": {
      "status": "disabled"
    },
    "retentionPolicy": {
      "days": 7,
      "lastUpdatedTime": "2025-04-12T21:07:56.928888+00:00",
      "status": "disabled"
    },
    "softDeletePolicy": {
      "lastUpdatedTime": "2025-04-12T21:07:56.928928+00:00",
      "retentionDays": 7,
      "status": "disabled"
    },
    "trustPolicy": {
      "status": "disabled",
      "type": "Notary"
    }
  },
  "privateEndpointConnections": [],
  "provisioningState": "Succeeded",
  "publicNetworkAccess": "Enabled",
  "resourceGroup": "MessageBoardResourceGroup",
  "sku": {
    "name": "Basic",
    "tier": "Basic"
  },
  "status": null,
  "systemData": {
    "createdAt": "2025-04-12T21:07:45.054864+00:00",
    "createdBy": "ismaliadulce@gmail.com",
    "createdByType": "User",
    "lastModifiedAt": "2025-04-13T01:58:02.575411+00:00",
    "lastModifiedBy": "ismaliadulce@gmail.com",
    "lastModifiedByType": "User"
  },
  "tags": {},
  "type": "Microsoft.ContainerRegistry/registries",
  "zoneRedundancy": "Disabled"
}
```

##### 4. Navegar para o diretório web-app

```bash
cd web-app
```

##### 5. Criar arquivo `.env` com a variável de ambiente `VITE_API_URL`

```bash
touch .env
echo "VITE_API_URL=https://message-board-function-app.azurewebsites.net/api/messages" > .env
```

##### 6. Adicionar a URL do Function App ao `proxy_pass` no `nginx.conf`

```nginx
server {
    listen  80;
    charset utf-8;

    location / {
        root      /usr/share/nginx/html;
        try_files $uri $uri/ /index.html;
    }

    # Forward API requests if needed
    location /api {
        proxy_pass       https://message-board-function-app.azurewebsites.net/api/messages;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

##### 7. Criar a imagem Docker

```bash
# Docker
docker build \
  -t messageboardregistry.azurecr.io/message-board-app:1.0.0 \
  -t messageboardregistry.azurecr.io/message-board-app:latest .

# Podman
podman build \
  -t messageboardregistry.azurecr.io/message-board-app:1.0.0 \
  -t messageboardregistry.azurecr.io/message-board-app:latest .
```

- Output:

```console
[1/2] STEP 1/6: FROM node:22-alpine AS build
[1/2] STEP 2/6: WORKDIR /app
--> Using cache 7c0d84e3136c4ed1928449be61a733069429bc22274b210dbc7b5bf0afe7aa40
--> 7c0d84e3136c
[1/2] STEP 3/6: COPY package.json yarn.lock ./
--> Using cache d99c180b80657bd31d76156e8fd055f6bf35cf6839eda896011eda5ca19138f1
--> d99c180b8065
[1/2] STEP 4/6: RUN yarn
--> Using cache e7ce0f12926ad30052b2d8c419e08d70f8ce02ff25e2d203758e357498e66abd
--> e7ce0f12926a
[1/2] STEP 5/6: COPY . .
--> b594aed14cfa
[1/2] STEP 6/6: RUN yarn build
yarn run v1.22.22
$ vite build
vite v6.2.6 building for production...
transforming...
✓ 29 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   0.51 kB │ gzip:  0.30 kB
dist/assets/index-YuWrkxAS.css    1.15 kB │ gzip:  0.55 kB
dist/assets/index-DzZ4WlIn.js   189.58 kB │ gzip: 59.76 kB
✓ built in 2.13s
Done in 2.82s.
--> 37cdbab1ba1c
[2/2] STEP 1/5: FROM nginx:1.27.4-alpine
[2/2] STEP 2/5: COPY --from=build /app/dist /usr/share/nginx/html
--> 992b8657109d
[2/2] STEP 3/5: COPY nginx.conf /etc/nginx/conf.d/default.conf
--> a4b8d5d50b13
[2/2] STEP 4/5: EXPOSE 80
--> e7925a8551cf
[2/2] STEP 5/5: CMD ["nginx", "-g", "daemon off;"]
[2/2] COMMIT messageboardregistry.azurecr.io/message-board-app:1.0.0
--> fe548d28b392
Successfully tagged messageboardregistry.azurecr.io/message-board-app:latest
Successfully tagged messageboardregistry.azurecr.io/message-board-app:1.0.0
fe548d28b39200f7aef99f5538514aed2ecea0d1fbb108d70a8a94074288ce94
```

##### 8. Enviar a imagem Docker

```bash
# Docker
docker push messageboardregistry.azurecr.io/message-board-app:1.0.0
docker push messageboardregistry.azurecr.io/message-board-app:latest

# Podman
podman push messageboardregistry.azurecr.io/message-board-app:1.0.0
podman push messageboardregistry.azurecr.io/message-board-app:latest
```

- Output:

```console
Getting image source signatures
Copying blob sha256:f1f70b13aacc43849d4f4ab87a889304a4300210ecd32be5a55305486af5f1ea
Copying blob sha256:c1761f3c364a963ec0ebd4d728cb6dd5aa24273f7dba0c3dd2fdb8411682ef0a
Copying blob sha256:08000c18d16dadf9553d747a58cf44023423a9ab010aab96cf263d2216b8b350
Copying blob sha256:c9ce8cb4e76a801ef89c226cb8657556e62e3bb962b3641b051bb25f13dd1a26
Copying blob sha256:8f3c313eb1240a3b86e0c76d0abda7a6fa7df30ad3151e98c4e3725a3fb710dc
Copying blob sha256:252b6db79fae151ab547c0f86a873dc97274d8b61f3921158d480b4242fef957
Copying blob sha256:9af9e76ea07fe05a1f7660b80ec2417bc3fe500991df4995b0adfa13aade20b6
Copying blob sha256:c18897d5e3dd125d3d9f2ca7f361cb6b05cf7fad8ef9bc00548f3eb6f3def644
Copying blob sha256:dd7bdcc120b262f6272136f68f8b39803369c83a7672b900ef0c47f0d5ef84eb
Copying blob sha256:41eef35fd7f09d3e519fe35c57f299df2b3853cbbc0679bd587dc4823d541137
Copying blob sha256:c496a25fb45ceb4eb4b485883c06ce1c694a3080c619ce00c7fcfd496beaba3b
Copying config sha256:1b3c3c1d7ebd9506a262e6f184d49f1a761a6a78ee0b75aa0f7d4f33b80a0786
Writing manifest to image destination
```

##### 9. Criar plano App Service

```bash
az appservice plan create --name MessageBoardAppPlan --resource-group MessageBoardResourceGroup --sku B1 --is-linux
```

- Output:

```json
{
  "elasticScaleEnabled": false,
  "extendedLocation": null,
  "freeOfferExpirationTime": "2025-10-12T21:54:55.456666",
  "geoRegion": "East US",
  "hostingEnvironmentProfile": null,
  "hyperV": false,
  "id": "/subscriptions/e985eaa6-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/MessageBoardResourceGroup/providers/Microsoft.Web/serverfarms/MessageBoardAppPlan",
  "isSpot": false,
  "isXenon": false,
  "kind": "linux",
  "kubeEnvironmentProfile": null,
  "location": "eastus",
  "maximumElasticWorkerCount": 1,
  "maximumNumberOfWorkers": 0,
  "name": "MessageBoardAppPlan",
  "numberOfSites": 0,
  "numberOfWorkers": 1,
  "perSiteScaling": false,
  "provisioningState": "Succeeded",
  "reserved": true,
  "resourceGroup": "MessageBoardResourceGroup",
  "sku": {
    "capabilities": null,
    "capacity": 1,
    "family": "B",
    "locations": null,
    "name": "B1",
    "size": "B1",
    "skuCapacity": null,
    "tier": "Basic"
  },
  "spotExpirationTime": null,
  "status": "Ready",
  "subscription": "e985eaa6-XXXX-XXXX-XXXX-XXXXXXXXXXXX",
  "tags": null,
  "targetWorkerCount": 0,
  "targetWorkerSizeId": 0,
  "type": "Microsoft.Web/serverfarms",
  "workerTierName": null,
  "zoneRedundant": false
}
```

##### 10. Criar Web App

```bash
az webapp create --resource-group MessageBoardResourceGroup --plan MessageBoardAppPlan --name message-board-web-app --container-image-name messageboardregistry.azurecr.io/message-board-app:1.0.0
```

- Output:

```json
{
  "availabilityState": "Normal",
  "clientAffinityEnabled": true,
  "clientCertEnabled": false,
  "clientCertExclusionPaths": null,
  "clientCertMode": "Required",
  "cloningInfo": null,
  "containerSize": 0,
  "customDomainVerificationId": "<REDACTED>",
  "dailyMemoryTimeQuota": 0,
  "daprConfig": null,
  "defaultHostName": "message-board-web-app.azurewebsites.net",
  "enabled": true,
  "enabledHostNames": [
    "message-board-web-app.azurewebsites.net",
    "message-board-web-app.scm.azurewebsites.net"
  ],
  "endToEndEncryptionEnabled": false,
  "extendedLocation": null,
  "ftpPublishingUrl": "ftps://waws-prod-blu-583.ftp.azurewebsites.windows.net/site/wwwroot",
  "hostNameSslStates": [
    {
      "certificateResourceId": null,
      "hostType": "Standard",
      "ipBasedSslResult": null,
      "ipBasedSslState": "NotConfigured",
      "name": "message-board-web-app.azurewebsites.net",
      "sslState": "Disabled",
      "thumbprint": null,
      "toUpdate": null,
      "toUpdateIpBasedSsl": null,
      "virtualIPv6": null,
      "virtualIp": null
    },
    {
      "certificateResourceId": null,
      "hostType": "Repository",
      "ipBasedSslResult": null,
      "ipBasedSslState": "NotConfigured",
      "name": "message-board-web-app.scm.azurewebsites.net",
      "sslState": "Disabled",
      "thumbprint": null,
      "toUpdate": null,
      "toUpdateIpBasedSsl": null,
      "virtualIPv6": null,
      "virtualIp": null
    }
  ],
  "hostNames": [
    "message-board-web-app.azurewebsites.net"
  ],
  "hostNamesDisabled": false,
  "hostingEnvironmentProfile": null,
  "httpsOnly": false,
  "hyperV": false,
  "id": "/subscriptions/e985eaa6-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/MessageBoardResourceGroup/providers/Microsoft.Web/sites/message-board-web-app",
  "identity": null,
  "inProgressOperationId": null,
  "isDefaultContainer": null,
  "isXenon": false,
  "keyVaultReferenceIdentity": "SystemAssigned",
  "kind": "app,linux,container",
  "lastModifiedTimeUtc": "2025-04-13T02:21:21.723333",
  "location": "East US",
  "managedEnvironmentId": null,
  "maxNumberOfWorkers": null,
  "name": "message-board-web-app",
  "outboundIpAddresses": "<REDACTED>",
  "possibleOutboundIpAddresses": "<REDACTED>",
  "publicNetworkAccess": null,
  "redundancyMode": "None",
  "repositorySiteName": "message-board-web-app",
  "reserved": true,
  "resourceConfig": null,
  "resourceGroup": "MessageBoardResourceGroup",
  "scmSiteAlsoStopped": false,
  "serverFarmId": "/subscriptions/e985eaa6-XXXX-XXXX-XXXX-XXXXXXXXXXXX/resourceGroups/MessageBoardResourceGroup/providers/Microsoft.Web/serverfarms/MessageBoardAppPlan",
  "siteConfig": {
    "acrUseManagedIdentityCreds": false,
    "acrUserManagedIdentityId": null,
    "alwaysOn": false,
    "antivirusScanEnabled": null,
    "apiDefinition": null,
    "apiManagementConfig": null,
    "appCommandLine": null,
    "appSettings": null,
    "autoHealEnabled": null,
    "autoHealRules": null,
    "autoSwapSlotName": null,
    "azureMonitorLogCategories": null,
    "azureStorageAccounts": null,
    "clusteringEnabled": false,
    "connectionStrings": null,
    "cors": null,
    "customAppPoolIdentityAdminState": null,
    "customAppPoolIdentityTenantState": null,
    "defaultDocuments": null,
    "detailedErrorLoggingEnabled": null,
    "documentRoot": null,
    "elasticWebAppScaleLimit": 0,
    "experiments": null,
    "fileChangeAuditEnabled": null,
    "ftpsState": null,
    "functionAppScaleLimit": null,
    "functionsRuntimeScaleMonitoringEnabled": null,
    "handlerMappings": null,
    "healthCheckPath": null,
    "http20Enabled": false,
    "http20ProxyFlag": null,
    "httpLoggingEnabled": null,
    "ipSecurityRestrictions": [
      {
        "action": "Allow",
        "description": "Allow all access",
        "headers": null,
        "ipAddress": "Any",
        "name": "Allow all",
        "priority": 2147483647,
        "subnetMask": null,
        "subnetTrafficTag": null,
        "tag": null,
        "vnetSubnetResourceId": null,
        "vnetTrafficTag": null
      }
    ],
    "ipSecurityRestrictionsDefaultAction": null,
    "javaContainer": null,
    "javaContainerVersion": null,
    "javaVersion": null,
    "keyVaultReferenceIdentity": null,
    "limits": null,
    "linuxFxVersion": "",
    "loadBalancing": null,
    "localMySqlEnabled": null,
    "logsDirectorySizeLimit": null,
    "machineKey": null,
    "managedPipelineMode": null,
    "managedServiceIdentityId": null,
    "metadata": null,
    "minTlsCipherSuite": null,
    "minTlsVersion": null,
    "minimumElasticInstanceCount": 0,
    "netFrameworkVersion": null,
    "nodeVersion": null,
    "numberOfWorkers": 1,
    "phpVersion": null,
    "powerShellVersion": null,
    "preWarmedInstanceCount": null,
    "publicNetworkAccess": null,
    "publishingPassword": null,
    "publishingUsername": null,
    "push": null,
    "pythonVersion": null,
    "remoteDebuggingEnabled": null,
    "remoteDebuggingVersion": null,
    "requestTracingEnabled": null,
    "requestTracingExpirationTime": null,
    "routingRules": null,
    "runtimeADUser": null,
    "runtimeADUserPassword": null,
    "sandboxType": null,
    "scmIpSecurityRestrictions": [
      {
        "action": "Allow",
        "description": "Allow all access",
        "headers": null,
        "ipAddress": "Any",
        "name": "Allow all",
        "priority": 2147483647,
        "subnetMask": null,
        "subnetTrafficTag": null,
        "tag": null,
        "vnetSubnetResourceId": null,
        "vnetTrafficTag": null
      }
    ],
    "scmIpSecurityRestrictionsDefaultAction": null,
    "scmIpSecurityRestrictionsUseMain": null,
    "scmMinTlsCipherSuite": null,
    "scmMinTlsVersion": null,
    "scmSupportedTlsCipherSuites": null,
    "scmType": null,
    "sitePort": null,
    "sitePrivateLinkHostEnabled": null,
    "storageType": null,
    "supportedTlsCipherSuites": null,
    "tracingOptions": null,
    "use32BitWorkerProcess": null,
    "virtualApplications": null,
    "vnetName": null,
    "vnetPrivatePortsCount": null,
    "vnetRouteAllEnabled": null,
    "webSocketsEnabled": null,
    "websiteTimeZone": null,
    "winAuthAdminState": null,
    "winAuthTenantState": null,
    "windowsConfiguredStacks": null,
    "windowsFxVersion": null,
    "xManagedServiceIdentityId": null
  },
  "slotSwapStatus": null,
  "state": "Running",
  "storageAccountRequired": false,
  "suspendedTill": null,
  "tags": null,
  "targetSwapSlot": null,
  "trafficManagerHostNames": null,
  "type": "Microsoft.Web/sites",
  "usageState": "Normal",
  "virtualNetworkSubnetId": null,
  "vnetContentShareEnabled": false,
  "vnetImagePullEnabled": false,
  "vnetRouteAllEnabled": false,
  "workloadProfileName": null
}
```

##### 11. Configurar o Web App para usar o registry de container

```bash
az webapp config container set --name message-board-web-app --resource-group MessageBoardResourceGroup --container-image-name messageboardregistry.azurecr.io/message-board-app:1.0.0 --container-registry-url https://messageboardregistry.azurecr.io
```

- Output:

```json
No credential was provided to access Azure Container Registry. Trying to look up...
[
  {
    "name": "WEBSITES_ENABLE_APP_SERVICE_STORAGE",
    "slotSetting": false,
    "value": "false"
  },
  {
    "name": "DOCKER_REGISTRY_SERVER_URL",
    "slotSetting": false,
    "value": "https://messageboardregistry.azurecr.io"
  },
  {
    "name": "DOCKER_REGISTRY_SERVER_USERNAME",
    "slotSetting": false,
    "value": "messageboardregistry"
  },
  {
    "name": "DOCKER_REGISTRY_SERVER_PASSWORD",
    "slotSetting": false,
    "value": null
  },
  {
    "name": "DOCKER_CUSTOM_IMAGE_NAME",
    "value": "DOCKER|messageboardregistry.azurecr.io/message-board-app:1.0.0"
  }
]
```

##### 12. Configurar CORS do Function App

```bash
az functionapp cors add --name message-board-function-app --resource-group MessageBoardResourceGroup --allowed-origins https://message-board-web-app.azurewebsites.net

# Adiciona https://portal.azure.com também para permitir testes pelo console da Azure
az functionapp cors add --name message-board-function-app --resource-group MessageBoardResourceGroup --allowed-origins https://portal.azure.com
```

- Output:

```json
{
  "allowedOrigins": [
    "https://message-board-web-app.azurewebsites.net",
    "https://portal.azure.com"
  ],
  "supportCredentials": false
}
```

#### III. Testando a aplicação

1. Acesse o Web App em: <https://message-board-web-app.azurewebsites.net>.
2. Crie novas mensagens usando o formulário.
3. Verifique se as mensagens são exibidas na lista.

### Resolução de problemas

- Se as mensagens não aparecerem, verifique o console do navegador para erros de CORS.
- Verifique se o `VITE_API_URL` nas variáveis de ambiente do app React está correto.
- Verifique os logs do Function App para quaisquer erros de backend.

declare global {
  type Fl32_Web_Back_Api_Handler = import("./src/Back/Api/Handler.mjs").default;
  type Fl32_Web_Back_Defaults = import("./src/Back/Defaults.mjs").default;
  type Fl32_Web_Back_Dto_Handler_Info = import("./src/Back/Dto/Handler/Info.mjs").default;
  type Fl32_Web_Back_Dto_Handler_Info$Dto = import("./src/Back/Dto/Handler/Info.mjs").Dto;
  type Fl32_Web_Back_Dto_Handler_Source = import("./src/Back/Dto/Handler/Source.mjs").default;
  type Fl32_Web_Back_Dto_Handler_Source$Dto = import("./src/Back/Dto/Handler/Source.mjs").Dto;
  type Fl32_Web_Back_Enum_Server_Type = import("./src/Back/Enum/Server/Type.mjs").default;
  type Fl32_Web_Back_Enum_Stage = import("./src/Back/Enum/Stage.mjs").default;
  type Fl32_Web_Back_Handler_Pre_Log = import("./src/Back/Handler/Pre/Log.mjs").default;
  type Fl32_Web_Back_Handler_Static = import("./src/Back/Handler/Static.mjs").default;
  type Fl32_Web_Back_Handler_Static_A_Config = import("./src/Back/Handler/Static/A/Config.mjs").default;
  type Fl32_Web_Back_Handler_Static_A_Fallback = import("./src/Back/Handler/Static/A/Fallback.mjs").default;
  type Fl32_Web_Back_Handler_Static_A_FileService = import("./src/Back/Handler/Static/A/FileService.mjs").default;
  type Fl32_Web_Back_Handler_Static_A_Registry = import("./src/Back/Handler/Static/A/Registry.mjs").default;
  type Fl32_Web_Back_Handler_Static_A_Resolver = import("./src/Back/Handler/Static/A/Resolver.mjs").default;
  type Fl32_Web_Back_Helper_Cast = import("./src/Back/Helper/Cast.mjs").default;
  type Fl32_Web_Back_Helper_Mime = import("./src/Back/Helper/Mime.mjs").default;
  type Fl32_Web_Back_Helper_Order_Kahn = import("./src/Back/Helper/Order/Kahn.mjs").default;
  type Fl32_Web_Back_Helper_Respond = import("./src/Back/Helper/Respond.mjs").default;
  type Fl32_Web_Back_Logger = import("./src/Back/Logger.mjs").default;
  type Fl32_Web_Back_PipelineEngine = import("./src/Back/PipelineEngine.mjs").default;
  type Fl32_Web_Back_Server = import("./src/Back/Server.mjs").default;
  type Fl32_Web_Back_Server_Config = import("./src/Back/Server/Config.mjs").default;
  type Fl32_Web_Back_Server_Config$Dto = import("./src/Back/Server/Config.mjs").Dto;
  type Fl32_Web_Back_Server_Config_Tls = import("./src/Back/Server/Config/Tls.mjs").default;
  type Fl32_Web_Back_Server_Config_Tls$Dto = import("./src/Back/Server/Config/Tls.mjs").Dto;
}

export {};

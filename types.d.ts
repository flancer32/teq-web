declare global {
  type Fl32_Web_Back_Api_Handler = import("./src/Back/Api/Handler.mjs").default;
  type Fl32_Web_Back_Config_Runtime = import("./src/Back/Config/Runtime.mjs").Data;
  type Fl32_Web_Back_Config_Runtime$Factory = import("./src/Back/Config/Runtime.mjs").Factory;
  type Fl32_Web_Back_Config_Runtime_Server = import("./src/Back/Config/Runtime.mjs").Server;
  type Fl32_Web_Back_Config_Runtime_Tls = import("./src/Back/Config/Runtime/Tls.mjs").Data;
  type Fl32_Web_Back_Config_Runtime_Tls$Factory = import("./src/Back/Config/Runtime/Tls.mjs").Factory;
  type Fl32_Web_Back_Dto_Info = import("./src/Back/Dto/Info.mjs").default;
  type Fl32_Web_Back_Dto_Info$Factory = import("./src/Back/Dto/Info.mjs").Factory;
  type Fl32_Web_Back_Dto_Source = import("./src/Back/Dto/Source.mjs").default;
  type Fl32_Web_Back_Dto_Source$Factory = import("./src/Back/Dto/Source.mjs").Factory;
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
}

export {};

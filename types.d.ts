declare global {
  type Fl32_Web_Back_Api_Handler = import("./src/Back/Api/Handler.js").default;
  type Fl32_Web_Back_Defaults = import("./src/Back/Defaults.js").default;
  type Fl32_Web_Back_Dispatcher = import("./src/Back/Dispatcher.js").default;
  type Fl32_Web_Back_Dto_Handler_Info = import("./src/Back/Dto/Handler/Info.js").default;
  type Fl32_Web_Back_Dto_Handler_Source = import("./src/Back/Dto/Handler/Source.js").default;
  type Fl32_Web_Back_Enum_Server_Type = import("./src/Back/Enum/Server/Type.js").default;
  type Fl32_Web_Back_Enum_Stage = import("./src/Back/Enum/Stage.js").default;
  type Fl32_Web_Back_Handler_Pre_Log = import("./src/Back/Handler/Pre/Log.js").default;
  type Fl32_Web_Back_Handler_Static = import("./src/Back/Handler/Static.js").default;
  type Fl32_Web_Back_Handler_Static_A_Config = import("./src/Back/Handler/Static/A/Config.js").default;
  type Fl32_Web_Back_Handler_Static_A_Fallback = import("./src/Back/Handler/Static/A/Fallback.js").default;
  type Fl32_Web_Back_Handler_Static_A_FileService = import("./src/Back/Handler/Static/A/FileService.js").default;
  type Fl32_Web_Back_Handler_Static_A_Registry = import("./src/Back/Handler/Static/A/Registry.js").default;
  type Fl32_Web_Back_Handler_Static_A_Resolver = import("./src/Back/Handler/Static/A/Resolver.js").default;
  type Fl32_Web_Back_Helper_Cast = import("./src/Back/Helper/Cast.js").default;
  type Fl32_Web_Back_Helper_Mime = import("./src/Back/Helper/Mime.js").default;
  type Fl32_Web_Back_Helper_Order_Kahn = import("./src/Back/Helper/Order/Kahn.js").default;
  type Fl32_Web_Back_Helper_Respond = import("./src/Back/Helper/Respond.js").default;
  type Fl32_Web_Back_Logger = import("./src/Back/Logger.js").default;
  type Fl32_Web_Back_Server = import("./src/Back/Server.js").default;
  type Fl32_Web_Back_Server_Config = import("./src/Back/Server/Config.js").default;
  type Fl32_Web_Back_Server_Config_Tls = import("./src/Back/Server/Config/Tls.js").default;
}
export {};

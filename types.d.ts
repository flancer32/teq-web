declare global {
  type Fl32_Web_Back_Api_Handler = typeof import("./src/Back/Api/Handler.mjs").default;
  type Fl32_Web_Back_Api_Handler$ = InstanceType<typeof import("./src/Back/Api/Handler.mjs").default>;

  type Fl32_Web_Back_Config_Runtime = typeof import("./src/Back/Config/Runtime.mjs").default;
  type Fl32_Web_Back_Config_Runtime$ = InstanceType<typeof import("./src/Back/Config/Runtime.mjs").default>;
  type Fl32_Web_Back_Config_Runtime__Data = import("./src/Back/Config/Runtime.mjs").Data;
  type Fl32_Web_Back_Config_Runtime__Factory = typeof import("./src/Back/Config/Runtime.mjs").Factory;
  type Fl32_Web_Back_Config_Runtime__Factory$ = InstanceType<typeof import("./src/Back/Config/Runtime.mjs").Factory>;

  type Fl32_Web_Back_Config_Runtime_Tls = typeof import("./src/Back/Config/Runtime/Tls.mjs").default;
  type Fl32_Web_Back_Config_Runtime_Tls$ = InstanceType<typeof import("./src/Back/Config/Runtime/Tls.mjs").default>;
  type Fl32_Web_Back_Config_Runtime_Tls__Data = import("./src/Back/Config/Runtime/Tls.mjs").Data;
  type Fl32_Web_Back_Config_Runtime_Tls__Factory = typeof import("./src/Back/Config/Runtime/Tls.mjs").Factory;
  type Fl32_Web_Back_Config_Runtime_Tls__Factory$ = InstanceType<typeof import("./src/Back/Config/Runtime/Tls.mjs").Factory>;
  type Fl32_Web_Back_Config_Runtime_Tls__Params = import("./src/Back/Config/Runtime/Tls.mjs").Params;

  type Fl32_Web_Back_Dto_Info = typeof import("./src/Back/Dto/Info.mjs").default;
  type Fl32_Web_Back_Dto_Info$ = InstanceType<typeof import("./src/Back/Dto/Info.mjs").default>;
  type Fl32_Web_Back_Dto_Info__Factory = typeof import("./src/Back/Dto/Info.mjs").Factory;
  type Fl32_Web_Back_Dto_Info__Factory$ = InstanceType<typeof import("./src/Back/Dto/Info.mjs").Factory>;

  type Fl32_Web_Back_Dto_RequestContext = typeof import("./src/Back/Dto/RequestContext.mjs").default;
  type Fl32_Web_Back_Dto_RequestContext$ = InstanceType<typeof import("./src/Back/Dto/RequestContext.mjs").default>;
  type Fl32_Web_Back_Dto_RequestContext__Factory = typeof import("./src/Back/Dto/RequestContext.mjs").Factory;
  type Fl32_Web_Back_Dto_RequestContext__Factory$ = InstanceType<typeof import("./src/Back/Dto/RequestContext.mjs").Factory>;

  type Fl32_Web_Back_Dto_Source = typeof import("./src/Back/Dto/Source.mjs").default;
  type Fl32_Web_Back_Dto_Source$ = InstanceType<typeof import("./src/Back/Dto/Source.mjs").default>;
  type Fl32_Web_Back_Dto_Source__Factory = typeof import("./src/Back/Dto/Source.mjs").Factory;
  type Fl32_Web_Back_Dto_Source__Factory$ = InstanceType<typeof import("./src/Back/Dto/Source.mjs").Factory>;

  type Fl32_Web_Back_Enum_Server_Type = typeof import("./src/Back/Enum/Server/Type.mjs").default;
  type Fl32_Web_Back_Enum_Server_Type$ = InstanceType<typeof import("./src/Back/Enum/Server/Type.mjs").default>;
  type Fl32_Web_Back_Enum_Stage = typeof import("./src/Back/Enum/Stage.mjs").default;
  type Fl32_Web_Back_Enum_Stage$ = InstanceType<typeof import("./src/Back/Enum/Stage.mjs").default>;

  type Fl32_Web_Back_Handler_Pre_Log = typeof import("./src/Back/Handler/Pre/Log.mjs").default;
  type Fl32_Web_Back_Handler_Pre_Log$ = InstanceType<typeof import("./src/Back/Handler/Pre/Log.mjs").default>;
  type Fl32_Web_Back_Handler_Static = typeof import("./src/Back/Handler/Static.mjs").default;
  type Fl32_Web_Back_Handler_Static$ = InstanceType<typeof import("./src/Back/Handler/Static.mjs").default>;
  type Fl32_Web_Back_Handler_Static_A_Config = typeof import("./src/Back/Handler/Static/A/Config.mjs").default;
  type Fl32_Web_Back_Handler_Static_A_Config$ = InstanceType<typeof import("./src/Back/Handler/Static/A/Config.mjs").default>;
  type Fl32_Web_Back_Handler_Static_A_Config__Value = import("./src/Back/Handler/Static/A/Config.mjs").Value;
  type Fl32_Web_Back_Handler_Static_A_Fallback = typeof import("./src/Back/Handler/Static/A/Fallback.mjs").default;
  type Fl32_Web_Back_Handler_Static_A_Fallback$ = InstanceType<typeof import("./src/Back/Handler/Static/A/Fallback.mjs").default>;
  type Fl32_Web_Back_Handler_Static_A_FileService = typeof import("./src/Back/Handler/Static/A/FileService.mjs").default;
  type Fl32_Web_Back_Handler_Static_A_FileService$ = InstanceType<typeof import("./src/Back/Handler/Static/A/FileService.mjs").default>;
  type Fl32_Web_Back_Handler_Static_A_Registry = typeof import("./src/Back/Handler/Static/A/Registry.mjs").default;
  type Fl32_Web_Back_Handler_Static_A_Registry$ = InstanceType<typeof import("./src/Back/Handler/Static/A/Registry.mjs").default>;
  type Fl32_Web_Back_Handler_Static_A_Registry__Match = import("./src/Back/Handler/Static/A/Registry.mjs").Match;
  type Fl32_Web_Back_Handler_Static_A_Resolver = typeof import("./src/Back/Handler/Static/A/Resolver.mjs").default;
  type Fl32_Web_Back_Handler_Static_A_Resolver$ = InstanceType<typeof import("./src/Back/Handler/Static/A/Resolver.mjs").default>;

  type Fl32_Web_Back_Helper_Cast = typeof import("./src/Back/Helper/Cast.mjs").default;
  type Fl32_Web_Back_Helper_Cast$ = InstanceType<typeof import("./src/Back/Helper/Cast.mjs").default>;
  type Fl32_Web_Back_Helper_Mime = typeof import("./src/Back/Helper/Mime.mjs").default;
  type Fl32_Web_Back_Helper_Mime$ = InstanceType<typeof import("./src/Back/Helper/Mime.mjs").default>;
  type Fl32_Web_Back_Helper_Order_Kahn = typeof import("./src/Back/Helper/Order/Kahn.mjs").default;
  type Fl32_Web_Back_Helper_Order_Kahn$ = InstanceType<typeof import("./src/Back/Helper/Order/Kahn.mjs").default>;
  type Fl32_Web_Back_Helper_Respond = typeof import("./src/Back/Helper/Respond.mjs").default;
  type Fl32_Web_Back_Helper_Respond$ = InstanceType<typeof import("./src/Back/Helper/Respond.mjs").default>;

  type Fl32_Web_Back_PipelineEngine = typeof import("./src/Back/PipelineEngine.mjs").default;
  type Fl32_Web_Back_PipelineEngine$ = InstanceType<typeof import("./src/Back/PipelineEngine.mjs").default>;
  type Fl32_Web_Back_Server = typeof import("./src/Back/Server.mjs").default;
  type Fl32_Web_Back_Server$ = InstanceType<typeof import("./src/Back/Server.mjs").default>;

  type Fl32_Web_Back_Response_Body = string | object;
  type Fl32_Web_Back_Response_Headers = {[key: string]: string};
  type Fl32_Web_Back_Response_Target = Fl32_Web_Node_Http_ServerResponse | Fl32_Web_Node_Http2_ServerResponse;

  type Fl32_Web_Node_Fs = typeof import("node:fs");
  type Fl32_Web_Node_Http = typeof import("node:http");
  type Fl32_Web_Node_Http_Server = import("node:http").Server;
  type Fl32_Web_Node_Http_IncomingMessage = import("node:http").IncomingMessage;
  type Fl32_Web_Node_Http_ServerResponse = import("node:http").ServerResponse;
  type Fl32_Web_Node_Http2 = typeof import("node:http2");
  type Fl32_Web_Node_Http2_ServerRequest = import("node:http2").Http2ServerRequest;
  type Fl32_Web_Node_Http2_ServerResponse = import("node:http2").Http2ServerResponse;
  type Fl32_Web_Node_Path = typeof import("node:path");
}

export {};

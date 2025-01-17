export interface ResponseMessageType {
  type: "success" | "error";
  message: string;
  duration?: number;
}

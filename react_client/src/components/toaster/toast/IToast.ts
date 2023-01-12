export default interface IToast {
  message: string,
  timestamp?: number,
  type: "error" | "success",
}
import IToast from "./toast/IToast";

export default interface IToasterState {
  showToast: (toast: IToast) => void,
  removeToast: (toast: IToast) => void,
  toasts: IToast[],
}
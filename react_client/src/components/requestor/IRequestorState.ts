export default interface IRequestorState {
  trackRequest: <T>(request: Promise<T>) => Promise<T>,
  ongoingRequests: Promise<unknown>[],
}
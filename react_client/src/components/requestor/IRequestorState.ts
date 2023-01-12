export default interface IRequestorState {
  trackRequest: (request: Promise<any>) => Promise<any>,
  ongoingRequests: Promise<any>[],
}
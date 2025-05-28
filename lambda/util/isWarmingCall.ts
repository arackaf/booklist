export function isWarmingCall(evt) {
  try {
    const payload = JSON.parse(evt.body);
    return !!payload.avoidColdStart;
  } catch (er) {}
}

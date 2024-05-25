class PeerProvider {
   constructor() {
    if (!this.peer) {
        this.peer = new RTCPeerConnection({
          iceServers: [
            {
              url: 'stun:global.stun.twilio.com:3478',
              urls: 'stun:global.stun.twilio.com:3478'
            },
            {
              url: 'turn:global.turn.twilio.com:3478?transport=udp',
              username: 'f871480bbe6d29cfe47cf21f464e422956f2268cb81504306effc2697e235e5f',
              urls: 'turn:global.turn.twilio.com:3478?transport=udp',
              credential: 'XHGrd//cXVq9ujIiBkYyr85DYaa8EgETWFn+N6Ow4oA='
            },
            {
              url: 'turn:global.turn.twilio.com:3478?transport=tcp',
              username: 'f871480bbe6d29cfe47cf21f464e422956f2268cb81504306effc2697e235e5f',
              urls: 'turn:global.turn.twilio.com:3478?transport=tcp',
              credential: 'XHGrd//cXVq9ujIiBkYyr85DYaa8EgETWFn+N6Ow4oA='
            },
            {
              url: 'turn:global.turn.twilio.com:443?transport=tcp',
              username: 'f871480bbe6d29cfe47cf21f464e422956f2268cb81504306effc2697e235e5f',
              urls: 'turn:global.turn.twilio.com:443?transport=tcp',
              credential: 'XHGrd//cXVq9ujIiBkYyr85DYaa8EgETWFn+N6Ow4oA='
            }]
        });
    }
  }

  async getAnswer(offer) {
    if (this.peer) {
      await this.peer.setRemoteDescription(offer);
      const ans = await this.peer.createAnswer();
      await this.peer.setLocalDescription(new RTCSessionDescription(ans));
      return ans;
    }
  }

  async setRemoteDescription(ans) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
    }
  }

  async getOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    }
  }
}

export default new PeerProvider();
